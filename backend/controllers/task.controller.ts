import { Request, Response, NextFunction } from "express";
import { taskService } from "../services/task.service";
import type {
  CreateTaskInput,
  UpdateTaskInput,
  TaskQueryInput,
} from "../schemas/task.schema";

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
    const { tasks, pagination } = await taskService.getTasks(query);

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
 * Get a single task by ID.
 */
export async function getTaskById(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const id = req.params.id as string;
    const task = await taskService.getTaskById(id);

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
    const task = await taskService.createTask(data);

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
    const id = req.params.id as string;
    const data = req.body as UpdateTaskInput;
    const user = (req as any).user;
    const task = await taskService.updateTask(id, data, user);

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
    const id = req.params.id as string;
    await taskService.deleteTask(id);

    res.json({
      success: true,
      message: "Task deleted successfully",
    });
  } catch (error) {
    next(error);
  }
}
