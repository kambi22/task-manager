import { Router } from "express";
import { getAuditLogs } from "../controllers/audit-log.controller";
import { validate } from "../middleware/validate";
import { authenticate, authorize } from "../middleware/auth";
import { auditLogQuerySchema } from "../schemas/audit-log.schema";

const router = Router();

router.get(
  "/audit-logs",
  authenticate,
  authorize(["ADMIN"]),
  validate(auditLogQuerySchema, "query"),
  getAuditLogs
);

export default router;
