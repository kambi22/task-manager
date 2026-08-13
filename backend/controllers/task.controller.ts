import { Request, Response, NextFunction } from "express";
import prisma from "../prisma";
import ApiError from "../utils/ApiError";
import { buildPaginationMeta } from "../utils/pagination";
import type {
  CreateTaskInput,
  UpdateTaskInput,
  TaskQueryInput,
} from "../validators/task.validator";

/**
 * GET /api/tasks
 * List tasks with filtering, search, sorting, and pagination.
 */
export async function getTasks(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const query = req.query as unknown as TaskQueryInput;

    // Build where clause
    const where: any = {};

    if (query.status) {
      where.status = query.status;
    }

    if (query.priority) {
      where.priority = query.priority;
    }

    if (query.assignee) {
      where.assignedTo = query.assignee;
    }

    if (query.search) {
      where.OR = [
        { title: { contains: query.search, mode: "insensitive" } },
        { description: { contains: query.search, mode: "insensitive" } },
      ];
    }

    // Count total matching records
    const totalCount = await prisma.task.count({ where });

    // Build pagination
    const page = query.page;
    const limit = query.limit;
    const skip = (page - 1) * limit;

    // Fetch tasks
    const tasks = await prisma.task.findMany({
      where,
      skip,
      take: limit,
      orderBy: { [query.sortBy]: query.sortOrder },
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    const pagination = buildPaginationMeta(totalCount, { page, limit, skip });

    res.json({
      success: true,
      data: tasks,
      pagination,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/tasks/:id
 * Get a single task by ID with comments and assignee.
 */
export async function getTaskById(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { id } = req.params;

    const task = await prisma.task.findUnique({
      where: { id },
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
        comments: {
          include: {
            user: {
              select: { id: true, name: true },
            },
          },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!task) {
      throw ApiError.notFound("Task not found");
    }

    res.json({
      success: true,
      data: task,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/tasks
 * Create a new task.
 */
export async function createTask(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const data = req.body as CreateTaskInput;

    // Verify assignee exists if provided
    if (data.assignedTo) {
      const user = await prisma.user.findUnique({
        where: { id: data.assignedTo },
      });
      if (!user) {
        throw ApiError.badRequest("Assigned user not found");
      }
    }

    const task = await prisma.task.create({
      data: {
        title: data.title,
        description: data.description || null,
        status: data.status,
        priority: data.priority,
        assignedTo: data.assignedTo || null,
        dueDate: data.dueDate ? new Date(data.dueDate) : null,
      },
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    res.status(201).json({
      success: true,
      data: task,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * PUT /api/tasks/:id
 * Update an existing task.
 */
export async function updateTask(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { id } = req.params;
    const data = req.body as UpdateTaskInput;

    // Verify task exists
    const existing = await prisma.task.findUnique({ where: { id } });
    if (!existing) {
      throw ApiError.notFound("Task not found");
    }

    // Verify assignee exists if being changed
    if (data.assignedTo) {
      const user = await prisma.user.findUnique({
        where: { id: data.assignedTo },
      });
      if (!user) {
        throw ApiError.badRequest("Assigned user not found");
      }
    }

    // Build update payload — only include fields that were provided
    const updateData: any = {};
    if (data.title !== undefined) updateData.title = data.title;
    if (data.description !== undefined)
      updateData.description = data.description;
    if (data.status !== undefined) updateData.status = data.status;
    if (data.priority !== undefined) updateData.priority = data.priority;
    if (data.assignedTo !== undefined) updateData.assignedTo = data.assignedTo;
    if (data.dueDate !== undefined)
      updateData.dueDate = data.dueDate ? new Date(data.dueDate) : null;

    const task = await prisma.task.update({
      where: { id },
      data: updateData,
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    res.json({
      success: true,
      data: task,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * DELETE /api/tasks/:id
 * Delete a task permanently.
 */
export async function deleteTask(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { id } = req.params;

    // Verify task exists
    const existing = await prisma.task.findUnique({ where: { id } });
    if (!existing) {
      throw ApiError.notFound("Task not found");
    }

    await prisma.task.delete({ where: { id } });

    res.json({
      success: true,
      message: "Task deleted successfully",
    });
  } catch (error) {
    next(error);
  }
}
