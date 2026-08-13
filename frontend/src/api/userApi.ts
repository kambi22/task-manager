import axiosClient from "./axiosClient";
import type { ApiResponse, User, CreateUserData } from "../types";

export interface UpdateUserData {
  name?: string;
  email?: string;
  role?: "USER" | "ADMIN";
}

export async function getUsers(): Promise<User[]> {
  const res = await axiosClient.get<ApiResponse<User[]>>("/users");
  return res.data.data;
}

export async function createUser(data: CreateUserData): Promise<User> {
  const res = await axiosClient.post<ApiResponse<User>>("/users", data);
  return res.data.data;
}

export async function updateUser(
  id: string,
  data: UpdateUserData
): Promise<User> {
  const res = await axiosClient.put<ApiResponse<User>>(`/users/${id}`, data);
  return res.data.data;
}

export async function deleteUser(id: string): Promise<void> {
  await axiosClient.delete(`/users/${id}`);
}
