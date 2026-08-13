import prisma from "../config/prisma";
import type { CreateCommentData } from "../models/comment.model";

export class CommentRepository {
  async findByTaskId(taskId: string) {
    return prisma.comment.findMany({
      where: { taskId },
      include: {
        user: {
          select: { id: true, name: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async findFirst(where: { id: string; taskId: string }) {
    return prisma.comment.findFirst({
      where,
    });
  }

  async create(taskId: string, data: CreateCommentData) {
    return prisma.comment.create({
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
  }

  async delete(id: string) {
    return prisma.comment.delete({
      where: { id },
    });
  }
}

export const commentRepository = new CommentRepository();
