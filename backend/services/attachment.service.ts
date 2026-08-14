import fs from "fs";
import path from "path";
import { attachmentRepository } from "../repositories/attachment.repository";
import { taskRepository } from "../repositories/task.repository";
import { userRepository } from "../repositories/user.repository";
import { taskHistoryService } from "./task-history.service";
import ApiError from "../utils/ApiError";
import type { Role } from "../models/user.model";

export class AttachmentService {
  async uploadAttachment(
    taskId: string,
    file: Express.Multer.File,
    uploader: { userId: string; role: Role }
  ) {
    const task = await taskRepository.findRawById(taskId);
    if (!task) {
      // If task does not exist, make sure to clean up the uploaded file to prevent leaking orphans
      this.cleanupPhysicalFile(file.path);
      throw ApiError.notFound("Task not found");
    }

    // Permission check: only admin or assignee can attach files
    if (uploader.role !== "ADMIN" && task.assignedTo !== uploader.userId) {
      this.cleanupPhysicalFile(file.path);
      throw ApiError.forbidden("Access denied: You are not authorized to add attachments to this task");
    }

    const fileUrl = `/uploads/${file.filename}`;

    const attachment = await attachmentRepository.create({
      taskId,
      fileName: file.originalname,
      fileUrl,
      fileSize: file.size,
      mimeType: file.mimetype,
    });

    // Log to task history
    const user = await userRepository.findById(uploader.userId);
    const userName = user ? user.name : "Unknown User";

    await taskHistoryService.logEvent({
      taskId,
      taskTitle: task.title,
      userId: uploader.userId,
      userName,
      action: "UPDATE",
      details: {
        changes: [`Attachment "${file.originalname}" was uploaded.`],
      },
    });

    return attachment;
  }

  async deleteAttachment(
    taskId: string,
    attachmentId: string,
    requester: { userId: string; role: Role }
  ) {
    const task = await taskRepository.findRawById(taskId);
    if (!task) {
      throw ApiError.notFound("Task not found");
    }

    const attachment = await attachmentRepository.findById(attachmentId);
    if (!attachment || attachment.taskId !== taskId) {
      throw ApiError.notFound("Attachment not found");
    }

    // Permission check: only admin or assignee can delete attachments
    if (requester.role !== "ADMIN" && task.assignedTo !== requester.userId) {
      throw ApiError.forbidden("Access denied: You are not authorized to delete attachments from this task");
    }

    // Delete physical file
    const filename = path.basename(attachment.fileUrl);
    const filepath = path.resolve(__dirname, "../../uploads", filename);
    this.cleanupPhysicalFile(filepath);

    // Delete database record
    await attachmentRepository.delete(attachmentId);

    // Log to task history
    const user = await userRepository.findById(requester.userId);
    const userName = user ? user.name : "Unknown User";

    await taskHistoryService.logEvent({
      taskId,
      taskTitle: task.title,
      userId: requester.userId,
      userName,
      action: "UPDATE",
      details: {
        changes: [`Attachment "${attachment.fileName}" was deleted.`],
      },
    });
  }

  private cleanupPhysicalFile(filepath: string) {
    try {
      if (fs.existsSync(filepath)) {
        fs.unlinkSync(filepath);
      }
    } catch (err: any) {
      console.error(`Failed to cleanup file ${filepath}:`, err.message);
    }
  }
}

export const attachmentService = new AttachmentService();
