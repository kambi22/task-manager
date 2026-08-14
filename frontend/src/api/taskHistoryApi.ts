import axiosClient from "./axiosClient";
import type { TaskHistory, PaginationMeta } from "../types";

interface HistoryResponse {
  success: boolean;
  data: TaskHistory[];
  pagination: PaginationMeta;
}

export async function getHistory(
  params: Record<string, any> = {}
): Promise<{ history: TaskHistory[]; pagination: PaginationMeta }> {
  const res = await axiosClient.get<HistoryResponse>("/history", { params });
  return { history: res.data.data, pagination: res.data.pagination };
}
