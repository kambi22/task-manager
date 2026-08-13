import { z } from "zod";

const roles = ["USER", "ADMIN"] as const;

/**
 * Schema for creating a new user.
 */
export const createUserSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name must be 100 characters or fewer"),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email address"),
  role: z.enum(roles).optional().default("USER"),
  isTeamMember: z.boolean().optional(),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;

/**
 * Schema for updating a user.
 */
export const updateUserSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name must be 100 characters or fewer")
    .optional(),
  role: z.enum(roles).optional(),
  isTeamMember: z.boolean().optional(),
});

export type UpdateUserInput = z.infer<typeof updateUserSchema>;

/**
 * Schema for adding multiple users to the team.
 */
export const addUsersToTeamSchema = z.object({
  userIds: z
    .array(z.string().uuid("Invalid user ID format"))
    .min(1, "At least one user ID is required"),
});

export type AddUsersToTeamInput = z.infer<typeof addUsersToTeamSchema>;
