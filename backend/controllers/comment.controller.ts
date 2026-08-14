import { Request, Response, NextFunction } from "express";
import { commentService } from "../services/comment.service";
import { auditLogService } from "../services/audit-log.service";
import type { CreateCommentInput } from "../schemas/comment.schema";

/**
 * GET /api/tasks/:taskId/comments
 * List all comments for a task.
 */
export async function getComments(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const taskId = req.params.taskId as string;
    const comments = await commentService.getComments(taskId);

    res.json({
      success: true,
      data: comments,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/tasks/:taskId/comments
 * Add a comment to a task.
 */
export async function createComment(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const taskId = req.params.taskId as string;
    const data = req.body as CreateCommentInput;
    const userId = (req as any).user.userId;
    const comment = await commentService.createComment(taskId, {
      ...data,
      userId,
    });

    // Log comment creation
    await auditLogService.logEvent({
      userId,
      action: "COMMENT_ADD",
      resource: "Comment",
      resourceId: comment.id,
      details: { taskId, commentPreview: comment.comment.substring(0, 50) },
      ipAddress: req.ip,
      userAgent: req.headers["user-agent"],
    });

    res.status(201).json({
      success: true,
      data: comment,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * DELETE /api/tasks/:taskId/comments/:id
 * Delete a comment.
 */
export async function deleteComment(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const taskId = req.params.taskId as string;
    const id = req.params.id as string;
    const user = (req as any).user;
    await commentService.deleteComment(taskId, id, user);

    // Log comment deletion
    await auditLogService.logEvent({
      userId: user.userId,
      action: "COMMENT_DELETE",
      resource: "Comment",
      resourceId: id,
      details: { taskId, id },
      ipAddress: req.ip,
      userAgent: req.headers["user-agent"],
    });

    res.json({
      success: true,
      message: "Comment deleted successfully",
    });
  } catch (error) {
    next(error);
  }
}

