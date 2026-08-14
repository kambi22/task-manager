import { z } from "zod";

export const historyQuerySchema = z.object({
  taskId: z.string().uuid("Invalid task ID").optional(),
  userId: z.string().uuid("Invalid user ID").optional(),
  action: z.enum(["CREATE", "UPDATE", "DELETE"]).optional(),
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
});

export type HistoryQueryInput = z.infer<typeof historyQuerySchema>;
