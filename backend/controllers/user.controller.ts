import { Request, Response, NextFunction } from "express";
import prisma from "../prisma";
import ApiError from "../utils/ApiError";
import type { CreateUserInput } from "../validators/user.validator";

/**
 * GET /api/users
 * List all users (for assignee dropdowns, etc.).
 */
export async function getUsers(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
      orderBy: { name: "asc" },
    });

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

    // Check for duplicate email
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });
    if (existingUser) {
      throw ApiError.conflict("A user with this email already exists");
    }

    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        role: data.role,
      },
    });

    res.status(201).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
}
