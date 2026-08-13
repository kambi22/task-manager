export type TaskStatus = "Pending" | "InProgress" | "Completed" | "Blocked";
export type TaskPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

export interface TaskModel {
  id: string;
  title: string;
  description?: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  assignedTo?: string | null;
  dueDate?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface TaskQueryParams {
  status?: TaskStatus;
  priority?: TaskPriority;
  assignee?: string;
  search?: string;
  page: number;
  limit: number;
  sortBy: "title" | "status" | "priority" | "dueDate" | "createdAt" | "updatedAt";
  sortOrder: "asc" | "desc";
}

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
