import { useState, useEffect, useCallback } from "react";
import type { AuditLog, PaginationMeta } from "../types";
import { getAuditLogs, type AuditLogQueryParams } from "../api/auditLogApi";

export function useAuditLogs(initialParams: AuditLogQueryParams = {}) {
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [params, setParams] = useState<AuditLogQueryParams>({
    page: 1,
    limit: 15,
    ...initialParams,
  });

  const fetchAuditLogs = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Clean parameters
      const cleanParams: Record<string, any> = {};
      for (const [key, value] of Object.entries(params)) {
        if (value !== undefined && value !== "" && value !== null) {
          cleanParams[key] = value;
        }
      }

      const data = await getAuditLogs(cleanParams);
      setAuditLogs(data.auditLogs);
      setPagination(data.pagination);
    } catch (err: any) {
      setError(err.message || "Failed to load audit logs");
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchAuditLogs();
  }, [fetchAuditLogs]);

  const updateParams = useCallback((newParams: Partial<AuditLogQueryParams>) => {
    setParams((prev) => ({
      ...prev,
      ...newParams,
      // If we are changing filters (like search, action, resource), reset page to 1
      page: newParams.page ?? (newParams.userId !== undefined || newParams.action !== undefined || newParams.resource !== undefined || newParams.search !== undefined ? 1 : prev.page),
    }));
  }, []);

  return {
    auditLogs,
    pagination,
    loading,
    error,
    params,
    updateParams,
    refresh: fetchAuditLogs,
  };
}
