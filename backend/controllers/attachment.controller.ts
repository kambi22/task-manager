import { Request, Response, NextFunction } from "express";
import { attachmentService } from "../services/attachment.service";
import { auditLogService } from "../services/audit-log.service";
import ApiError from "../utils/ApiError";

/**
 * POST /api/tasks/:taskId/attachments
 * Upload file attachment for a task.
 */
export async function uploadAttachment(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const taskId = req.params.taskId as string;
    const file = req.file;
    const user = (req as any).user;

    if (!file) {
      throw ApiError.badRequest("No file uploaded");
    }

    const attachment = await attachmentService.uploadAttachment(taskId, file, user);

    // Log attachment upload
    await auditLogService.logEvent({
      userId: user.userId,
      action: "ATTACHMENT_UPLOAD",
      resource: "Attachment",
      resourceId: attachment.id,
      details: { taskId, fileName: attachment.fileName, fileSize: attachment.fileSize, mimeType: attachment.mimeType },
      ipAddress: req.ip,
      userAgent: req.headers["user-agent"],
    });

    res.status(201).json({
      success: true,
      data: attachment,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * DELETE /api/tasks/:taskId/attachments/:id
 * Delete a file attachment from a task.
 */
export async function deleteAttachment(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const taskId = req.params.taskId as string;
    const id = req.params.id as string;
    const user = (req as any).user;

    await attachmentService.deleteAttachment(taskId, id, user);

    // Log attachment deletion
    await auditLogService.logEvent({
      userId: user.userId,
      action: "ATTACHMENT_DELETE",
      resource: "Attachment",
      resourceId: id,
      details: { taskId, id },
      ipAddress: req.ip,
      userAgent: req.headers["user-agent"],
    });

    res.json({
      success: true,
      message: "Attachment deleted successfully",
    });
  } catch (error) {
    next(error);
  }
}

