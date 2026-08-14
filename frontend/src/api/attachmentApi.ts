import axiosClient from "./axiosClient";
import type { ApiResponse, Attachment } from "../types";

/**
 * Uploads a file attachment for a task.
 */
export async function uploadAttachment(
  taskId: string,
  file: File
): Promise<Attachment> {
  const formData = new FormData();
  formData.append("file", file);

  const res = await axiosClient.post<ApiResponse<Attachment>>(
    `/tasks/${taskId}/attachments`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return res.data.data;
}

/**
 * Deletes a file attachment from a task.
 */
export async function deleteAttachment(
  taskId: string,
  attachmentId: string
): Promise<void> {
  await axiosClient.delete(`/tasks/${taskId}/attachments/${attachmentId}`);
}
