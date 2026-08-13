import { Request, Response, NextFunction } from "express";
import prisma from "../prisma";
import ApiError from "../utils/ApiError";
import type { CreateCommentInput } from "../validators/comment.validator";

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
    const { taskId } = req.params;

    // Verify task exists
    const task = await prisma.task.findUnique({ where: { id: taskId } });
    if (!task) {
      throw ApiError.notFound("Task not found");
    }

    const comments = await prisma.comment.findMany({
      where: { taskId },
      include: {
        user: {
          select: { id: true, name: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

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
    const { taskId } = req.params;
    const data = req.body as CreateCommentInput;

    // Verify task exists
    const task = await prisma.task.findUnique({ where: { id: taskId } });
    if (!task) {
      throw ApiError.notFound("Task not found");
    }

    // Verify user exists
    const user = await prisma.user.findUnique({
      where: { id: data.userId },
    });
    if (!user) {
      throw ApiError.badRequest("User not found");
    }

    const comment = await prisma.comment.create({
      data: {
        taskId,
        userId: data.userId,
        comment: data.comment,
      },
      include: {
        user: {
          select: { id: true, name: true },
        },
      },
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
    const { taskId, id } = req.params;

    const comment = await prisma.comment.findFirst({
      where: { id, taskId },
    });
    if (!comment) {
      throw ApiError.notFound("Comment not found");
    }

    await prisma.comment.delete({ where: { id } });

    res.json({
      success: true,
      message: "Comment deleted successfully",
    });
  } catch (error) {
    next(error);
  }
}
