import { useState, useEffect, useCallback } from "react";
import type { User } from "../types";
import { getUsers } from "../api/userApi";

export function useUsers(filters?: { isTeamMember?: boolean }) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Stringify filters to prevent unnecessary re-fetches or infinite loops from object references
  const filtersKey = JSON.stringify(filters);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const parsedFilters = filtersKey ? JSON.parse(filtersKey) : undefined;
      const data = await getUsers(parsedFilters);
      setUsers(data);
    } catch (err: any) {
      setError(err.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  }, [filtersKey]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return { users, loading, error, refresh: fetchUsers };
}
