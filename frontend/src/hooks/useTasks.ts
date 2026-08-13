import { useState, useEffect, useCallback } from "react";
import type { Task, PaginationMeta, TaskQueryParams } from "../types";
import { getTasks } from "../api/taskApi";

export function useTasks(initialParams: TaskQueryParams = {}) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [params, setParams] = useState<TaskQueryParams>({
    page: 1,
    limit: 10,
    sortBy: "createdAt",
    sortOrder: "desc",
    ...initialParams,
  });

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Clean undefined values from params
      const cleanParams: Record<string, any> = {};
      for (const [key, value] of Object.entries(params)) {
        if (value !== undefined && value !== "" && value !== null) {
          cleanParams[key] = value;
        }
      }

      const data = await getTasks(cleanParams);
      setTasks(data.tasks);
      setPagination(data.pagination);
    } catch (err: any) {
      setError(err.message || "Failed to load tasks");
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const updateParams = useCallback(
    (newParams: Partial<TaskQueryParams>) => {
      setParams((prev) => ({
        ...prev,
        ...newParams,
        // Reset to page 1 when filters change (unless page is explicitly set)
        page: newParams.page ?? 1,
      }));
    },
    []
  );

  return {
    tasks,
    pagination,
    loading,
    error,
    params,
    updateParams,
    refresh: fetchTasks,
  };
}
