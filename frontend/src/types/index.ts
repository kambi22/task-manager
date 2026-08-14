// ── Status & Priority enums ──────────────────────────────────────────
export type TaskStatus = "Pending" | "InProgress" | "Completed" | "Blocked";
export type TaskPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";
export type Role = "USER" | "ADMIN";

// ── User ─────────────────────────────────────────────────────────────
export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  isTeamMember: boolean;
  createdAt: string;
}

// ── Comment ──────────────────────────────────────────────────────────
export interface Comment {
  id: string;
  taskId: string;
  userId: string;
  comment: string;
  createdAt: string;
  user: {
    id: string;
    name: string;
  };
}

// ── Attachment ───────────────────────────────────────────────────────
export interface Attachment {
  id: string;
  taskId: string;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  mimeType: string;
  createdAt: string;
}

// ── Task History ─────────────────────────────────────────────────────
export interface TaskHistory {
  id: string;
  taskId: string;
  taskTitle: string;
  userId: string | null;
  userName: string;
  action: "CREATE" | "UPDATE" | "DELETE";
  details: {
    message?: string;
    changes?: string[];
  } | null;
  createdAt: string;
  user?: {
    id: string;
    name: string;
    email: string;
  } | null;
}

// ── Task ─────────────────────────────────────────────────────────────
export interface Task {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  assignedTo: string | null;
  dueDate: string | null;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    name: string;
    email: string;
  } | null;
  comments?: Comment[];
  attachments?: Attachment[];
}

// ── Create / Update DTOs ─────────────────────────────────────────────
export interface CreateTaskData {
  title: string;
  description?: string | null;
  status?: TaskStatus;
  priority?: TaskPriority;
  assignedTo?: string | null;
  dueDate?: string | null;
}

export interface UpdateTaskData {
  title?: string;
  description?: string | null;
  status?: TaskStatus;
  priority?: TaskPriority;
  assignedTo?: string | null;
  dueDate?: string | null;
}

export interface CreateUserData {
  name: string;
  email: string;
  role?: Role;
  isTeamMember?: boolean;
}

export interface UpdateUserData {
  name?: string;
  role?: Role;
  isTeamMember?: boolean;
}

export interface CreateCommentData {
  comment: string;
  userId: string;
}

// ── Dashboard ────────────────────────────────────────────────────────
export interface DashboardStats {
  totalTasks: number;
  totalUsers: number;
  overdueCount: number;
  myTasksCount?: number;
  byStatus: Record<string, number>;
  byPriority: Record<string, number>;
  recentTasks: Task[];
}

// ── Pagination ───────────────────────────────────────────────────────
export interface PaginationMeta {
  total: number;
  totalCount?: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

// ── API Response wrapper ─────────────────────────────────────────────
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  pagination?: PaginationMeta;
  message?: string;
}

// ── Task Query Params ────────────────────────────────────────────────
export interface TaskQueryParams {
  status?: TaskStatus;
  priority?: TaskPriority;
  assignee?: string;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

// ── Audit Log ────────────────────────────────────────────────────────
export interface AuditLog {
  id: string;
  userId: string | null;
  userName: string;
  userEmail: string;
  action: string;
  resource: string;
  resourceId: string | null;
  details: any | null;
  ipAddress: string | null;
  userAgent: string | null;
  createdAt: string;
  user?: {
    id: string;
    name: string;
    email: string;
    role: Role;
  } | null;
}

