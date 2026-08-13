import { z } from "zod";

/**
 * Schema for creating a comment on a task.
 */
export const createCommentSchema = z.object({
  comment: z
    .string({ required_error: "Comment is required" })
    .min(1, "Comment cannot be empty")
    .max(2000, "Comment must be 2000 characters or fewer"),
  userId: z
    .string({ required_error: "User ID is required" })
    .uuid("Invalid user ID"),
});

export type CreateCommentInput = z.infer<typeof createCommentSchema>;
