import axiosClient from "./axiosClient";
import type { AuditLog, PaginationMeta } from "../types";

export interface AuditLogQueryParams {
  userId?: string;
  action?: string;
  resource?: string;
  search?: string;
  page?: number;
  limit?: number;
}

interface AuditLogResponse {
  success: boolean;
  data: AuditLog[];
  pagination: PaginationMeta;
}

export async function getAuditLogs(
  params: AuditLogQueryParams = {}
): Promise<{ auditLogs: AuditLog[]; pagination: PaginationMeta }> {
  const res = await axiosClient.get<AuditLogResponse>("/audit-logs", { params });
  return { auditLogs: res.data.data, pagination: res.data.pagination };
}
