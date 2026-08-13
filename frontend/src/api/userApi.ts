import axiosClient from "./axiosClient";
import type { ApiResponse, User, CreateUserData, UpdateUserData } from "../types";

export async function getUsers(params?: { isTeamMember?: boolean }): Promise<User[]> {
  const res = await axiosClient.get<ApiResponse<User[]>>("/users", { params });
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

export async function addUsersToTeam(userIds: string[]): Promise<void> {
  await axiosClient.post("/users/add-to-team", { userIds });
}

export async function deleteUser(id: string): Promise<void> {
  await axiosClient.delete(`/users/${id}`);
}
