import axiosClient from "./axiosClient";
import type { ApiResponse } from "../types";
import type { SignupData, LoginData, AuthResponse, AuthUser } from "../types/auth";

export async function signup(data: SignupData): Promise<AuthResponse> {
  const res = await axiosClient.post<ApiResponse<AuthResponse>>("/auth/signup", data);
  return res.data.data;
}

export async function login(data: LoginData): Promise<AuthResponse> {
  const res = await axiosClient.post<ApiResponse<AuthResponse>>("/auth/login", data);
  return res.data.data;
}

export async function getMe(): Promise<AuthUser> {
  const res = await axiosClient.get<ApiResponse<AuthUser>>("/auth/me");
  return res.data.data;
}
