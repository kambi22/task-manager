import { commentRepository } from "../repositories/comment.repository";
import { taskRepository } from "../repositories/task.repository";
import { userRepository } from "../repositories/user.repository";
import ApiError from "../utils/ApiError";
import type { CreateCommentData } from "../models/comment.model";
import type { Role } from "../models/user.model";

export class CommentService {
  async getComments(taskId: string) {
    const task = await taskRepository.findRawById(taskId);
    if (!task) {
      throw ApiError.notFound("Task not found");
    }

    return commentRepository.findByTaskId(taskId);
  }

  async createComment(taskId: string, data: CreateCommentData) {
    const task = await taskRepository.findRawById(taskId);
    if (!task) {
      throw ApiError.notFound("Task not found");
    }

    const user = await userRepository.findById(data.userId);
    if (!user) {
      throw ApiError.badRequest("User not found");
    }

    return commentRepository.create(taskId, data);
  }

  async deleteComment(taskId: string, id: string, requester: { userId: string; role: Role }) {
    const comment = await commentRepository.findFirst({ id, taskId });
    if (!comment) {
      throw ApiError.notFound("Comment not found");
    }

    if (requester.role !== "ADMIN" && comment.userId !== requester.userId) {
      throw ApiError.forbidden("Access denied: You can only delete your own comments");
    }

    return commentRepository.delete(id);
  }
}

export const commentService = new CommentService();
