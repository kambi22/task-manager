import { auditLogRepository } from "../repositories/audit-log.repository";
import { userRepository } from "../repositories/user.repository";
import { buildPaginationMeta } from "../utils/pagination";

export interface AuditLogQueryParams {
  userId?: string;
  action?: string;
  resource?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export class AuditLogService {
  async getAuditLogs(query: AuditLogQueryParams) {
    const where: any = {};

    if (query.userId) {
      where.userId = query.userId;
    }

    if (query.action) {
      where.action = query.action;
    }

    if (query.resource) {
      where.resource = query.resource;
    }

    if (query.search) {
      const searchLower = query.search.toLowerCase();
      where.OR = [
        { userName: { contains: query.search, mode: "insensitive" } },
        { userEmail: { contains: query.search, mode: "insensitive" } },
        { action: { contains: query.search, mode: "insensitive" } },
        { resource: { contains: query.search, mode: "insensitive" } },
        { resourceId: { contains: query.search, mode: "insensitive" } },
      ];
    }

    const totalCount = await auditLogRepository.count(where);

    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 20;
    const skip = (page - 1) * limit;

    const auditLogs = await auditLogRepository.findMany(where, skip, limit);
    const pagination = buildPaginationMeta(totalCount, { page, limit, skip });

    return { auditLogs, pagination };
  }

  async logEvent(data: {
    userId?: string | null;
    userName?: string;
    userEmail?: string;
    action: string;
    resource: string;
    resourceId?: string | null;
    details?: any;
    ipAddress?: string | null;
    userAgent?: string | null;
  }) {
    let userName = data.userName || "System / Guest";
    let userEmail = data.userEmail || "system@taskmanager.local";

    if (data.userId) {
      const user = await userRepository.findById(data.userId);
      if (user) {
        userName = user.name;
        userEmail = user.email;
      }
    }

    return auditLogRepository.create({
      userId: data.userId,
      userName,
      userEmail,
      action: data.action,
      resource: data.resource,
      resourceId: data.resourceId,
      details: data.details,
      ipAddress: data.ipAddress,
      userAgent: data.userAgent,
    });
  }
}

export const auditLogService = new AuditLogService();
