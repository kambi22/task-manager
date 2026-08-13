import axiosClient from "./axiosClient";
import type {
  ApiResponse,
  Task,
  CreateTaskData,
  UpdateTaskData,
  TaskQueryParams,
  PaginationMeta,
} from "../types";

interface TaskListResponse {
  success: boolean;
  data: Task[];
  pagination: PaginationMeta;
}

export async function getTasks(
  params: TaskQueryParams = {}
): Promise<{ tasks: Task[]; pagination: PaginationMeta }> {
  const res = await axiosClient.get<TaskListResponse>("/tasks", { params });
  return { tasks: res.data.data, pagination: res.data.pagination };
}

export async function getTaskById(id: string): Promise<Task> {
  const res = await axiosClient.get<ApiResponse<Task>>(`/tasks/${id}`);
  return res.data.data;
}

export async function createTask(data: CreateTaskData): Promise<Task> {
  const res = await axiosClient.post<ApiResponse<Task>>("/tasks", data);
  return res.data.data;
}

export async function updateTask(
  id: string,
  data: UpdateTaskData
): Promise<Task> {
  const res = await axiosClient.put<ApiResponse<Task>>(`/tasks/${id}`, data);
  return res.data.data;
}

export async function deleteTask(id: string): Promise<void> {
  await axiosClient.delete(`/tasks/${id}`);
}
