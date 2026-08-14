import { Request, Response, NextFunction } from "express";
import { attachmentService } from "../services/attachment.service";
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

    res.json({
      success: true,
      message: "Attachment deleted successfully",
    });
  } catch (error) {
    next(error);
  }
}
