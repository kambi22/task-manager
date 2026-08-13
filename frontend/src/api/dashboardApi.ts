import axiosClient from "./axiosClient";
import type { ApiResponse, DashboardStats } from "../types";

export async function getDashboardStats(): Promise<DashboardStats> {
  const res = await axiosClient.get<ApiResponse<DashboardStats>>("/dashboard");
  return res.data.data;
}
