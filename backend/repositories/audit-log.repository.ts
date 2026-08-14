import prisma from "../config/prisma";

export interface CreateAuditLogData {
  userId?: string | null;
  userName: string;
  userEmail: string;
  action: string;
  resource: string;
  resourceId?: string | null;
  details?: any;
  ipAddress?: string | null;
  userAgent?: string | null;
}

export class AuditLogRepository {
  async create(data: CreateAuditLogData) {
    return prisma.auditLog.create({
      data: {
        userId: data.userId || null,
        userName: data.userName,
        userEmail: data.userEmail,
        action: data.action,
        resource: data.resource,
        resourceId: data.resourceId || null,
        details: data.details || null,
        ipAddress: data.ipAddress || null,
        userAgent: data.userAgent || null,
      },
    });
  }

  async count(where: any) {
    return prisma.auditLog.count({ where });
  }

  async findMany(where: any, skip: number, limit: number) {
    return prisma.auditLog.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: { id: true, name: true, email: true, role: true },
        },
      },
    });
  }
}

export const auditLogRepository = new AuditLogRepository();
