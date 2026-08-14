import { Request, Response, NextFunction } from "express";
import { auditLogService } from "../services/audit-log.service";
import type { AuditLogQueryInput } from "../schemas/audit-log.schema";

/**
 * GET /api/audit-logs
 * List system audit logs (ADMIN only).
 */
export async function getAuditLogs(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const query = req.query as unknown as AuditLogQueryInput;
    const { auditLogs, pagination } = await auditLogService.getAuditLogs(query);

    res.json({
      success: true,
      data: auditLogs,
      pagination,
    });
  } catch (error) {
    next(error);
  }
}
