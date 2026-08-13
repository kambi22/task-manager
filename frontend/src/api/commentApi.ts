import axiosClient from "./axiosClient";
import type { ApiResponse, Comment, CreateCommentData } from "../types";

export async function getComments(taskId: string): Promise<Comment[]> {
  const res = await axiosClient.get<ApiResponse<Comment[]>>(
    `/tasks/${taskId}/comments`
  );
  return res.data.data;
}

export async function createComment(
  taskId: string,
  data: CreateCommentData
): Promise<Comment> {
  const res = await axiosClient.post<ApiResponse<Comment>>(
    `/tasks/${taskId}/comments`,
    data
  );
  return res.data.data;
}

export async function deleteComment(
  taskId: string,
  commentId: string
): Promise<void> {
  await axiosClient.delete(`/tasks/${taskId}/comments/${commentId}`);
}
