import axiosClient from "./axiosClient";
import type { ApiResponse, User, CreateUserData } from "../types";

export async function getUsers(): Promise<User[]> {
  const res = await axiosClient.get<ApiResponse<User[]>>("/users");
  return res.data.data;
}

export async function createUser(data: CreateUserData): Promise<User> {
  const res = await axiosClient.post<ApiResponse<User>>("/users", data);
  return res.data.data;
}
