import { Request, Response, NextFunction } from "express";
import { commentService } from "../services/comment.service";
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
    const comment = await commentService.createComment(taskId, data);

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
    await commentService.deleteComment(taskId, id);

    res.json({
      success: true,
      message: "Comment deleted successfully",
    });
  } catch (error) {
    next(error);
  }
}
