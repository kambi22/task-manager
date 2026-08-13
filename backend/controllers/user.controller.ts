import { Request, Response, NextFunction } from "express";
import { userService } from "../services/user.service";
import type { CreateUserInput } from "../schemas/user.schema";
import type { UpdateUserData } from "../models/user.model";

/**
 * GET /api/users
 * List all users.
 */
export async function getUsers(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const users = await userService.getAllUsers();
    res.json({
      success: true,
      data: users,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/users
 * Create a new user.
 */
export async function createUser(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const data = req.body as CreateUserInput;
    const user = await userService.createUser(data);
    res.status(201).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * PUT /api/users/:id
 * Update an existing user.
 */
export async function updateUser(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const id = req.params.id as string;
    const data = req.body as UpdateUserData;
    const user = await userService.updateUser(id, data);
    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * DELETE /api/users/:id
 * Delete a user.
 */
export async function deleteUser(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const id = req.params.id as string;
    const result = await userService.deleteUser(id);
    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
}
