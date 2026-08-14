import { useState, useEffect, useCallback } from "react";
import type { TaskHistory, PaginationMeta } from "../types";
import { getHistory } from "../api/taskHistoryApi";

export interface HistoryQueryParams {
  taskId?: string;
  userId?: string;
  action?: string;
  page?: number;
  limit?: number;
}

export function useTaskHistory(initialParams: HistoryQueryParams = {}) {
  const [history, setHistory] = useState<TaskHistory[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [params, setParams] = useState<HistoryQueryParams>({
    page: 1,
    limit: 10,
    ...initialParams,
  });

  const fetchHistory = useCallback(async () => {
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

      const data = await getHistory(cleanParams);
      setHistory(data.history);
      setPagination(data.pagination);
    } catch (err: any) {
      setError(err.message || "Failed to load activity history");
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const updateParams = useCallback((newParams: Partial<HistoryQueryParams>) => {
    setParams((prev) => ({
      ...prev,
      ...newParams,
      page: newParams.page ?? 1, // default to page 1 on filter changes
    }));
  }, []);

  return {
    history,
    pagination,
    loading,
    error,
    params,
    updateParams,
    refresh: fetchHistory,
  };
}
