import { z } from "zod";

// Valid enum values (must match Prisma enums)
const taskStatuses = ["Pending", "InProgress", "Completed", "Blocked"] as const;
const taskPriorities = ["LOW", "MEDIUM", "HIGH", "URGENT"] as const;
const sortableFields = [
  "title",
  "status",
  "priority",
  "dueDate",
  "createdAt",
  "updatedAt",
] as const;

/**
 * Schema for creating a new task.
 */
export const createTaskSchema = z.object({
  title: z
    .string({ required_error: "Title is required" })
    .min(1, "Title cannot be empty")
    .max(255, "Title must be 255 characters or fewer"),
  description: z.string().max(5000).optional().nullable(),
  status: z.enum(taskStatuses).optional().default("Pending"),
  priority: z.enum(taskPriorities).optional().default("MEDIUM"),
  assignedTo: z.string().uuid("Invalid user ID").optional().nullable(),
  dueDate: z
    .string()
    .datetime({ message: "Invalid ISO date format" })
    .optional()
    .nullable(),
});

/**
 * Schema for updating a task — all fields optional.
 */
export const updateTaskSchema = z.object({
  title: z
    .string()
    .min(1, "Title cannot be empty")
    .max(255, "Title must be 255 characters or fewer")
    .optional(),
  description: z.string().max(5000).optional().nullable(),
  status: z.enum(taskStatuses).optional(),
  priority: z.enum(taskPriorities).optional(),
  assignedTo: z.string().uuid("Invalid user ID").optional().nullable(),
  dueDate: z
    .string()
    .datetime({ message: "Invalid ISO date format" })
    .optional()
    .nullable(),
});

/**
 * Schema for task list query parameters.
 */
export const taskQuerySchema = z.object({
  status: z.enum(taskStatuses).optional(),
  priority: z.enum(taskPriorities).optional(),
  assignee: z.string().uuid("Invalid assignee ID").optional(),
  search: z.string().max(255).optional(),
  page: z
    .string()
    .optional()
    .default("1")
    .transform((v) => parseInt(v, 10))
    .pipe(z.number().int().min(1, "Page must be at least 1")),
  limit: z
    .string()
    .optional()
    .default("20")
    .transform((v) => parseInt(v, 10))
    .pipe(z.number().int().min(1).max(100, "Limit must be 100 or fewer")),
  sortBy: z.enum(sortableFields).optional().default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).optional().default("desc"),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
export type TaskQueryInput = z.infer<typeof taskQuerySchema>;
