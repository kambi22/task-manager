import { taskRepository } from "../repositories/task.repository";
import { userRepository } from "../repositories/user.repository";
import ApiError from "../utils/ApiError";
import { buildPaginationMeta } from "../utils/pagination";
import type { TaskQueryParams, CreateTaskData, UpdateTaskData } from "../models/task.model";

export class TaskService {
  async getTasks(query: TaskQueryParams) {
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

    const totalCount = await taskRepository.count(where);

    const page = query.page;
    const limit = query.limit;
    const skip = (page - 1) * limit;

    const tasks = await taskRepository.findMany(
      where,
      skip,
      limit,
      query.sortBy,
      query.sortOrder
    );

    const pagination = buildPaginationMeta(totalCount, { page, limit, skip });

    return { tasks, pagination };
  }

  async getTaskById(id: string) {
    const task = await taskRepository.findById(id);
    if (!task) {
      throw ApiError.notFound("Task not found");
    }
    return task;
  }

  async createTask(data: CreateTaskData) {
    if (data.assignedTo) {
      const user = await userRepository.findById(data.assignedTo);
      if (!user) {
        throw ApiError.badRequest("Assigned user not found");
      }
    }

    return taskRepository.create(data);
  }

  async updateTask(id: string, data: UpdateTaskData) {
    const existing = await taskRepository.findRawById(id);
    if (!existing) {
      throw ApiError.notFound("Task not found");
    }

    if (data.assignedTo) {
      const user = await userRepository.findById(data.assignedTo);
      if (!user) {
        throw ApiError.badRequest("Assigned user not found");
      }
    }

    const updateData: any = {};
    if (data.title !== undefined) updateData.title = data.title;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.status !== undefined) updateData.status = data.status;
    if (data.priority !== undefined) updateData.priority = data.priority;
    if (data.assignedTo !== undefined) updateData.assignedTo = data.assignedTo;
    if (data.dueDate !== undefined)
      updateData.dueDate = data.dueDate ? new Date(data.dueDate) : null;

    return taskRepository.update(id, updateData);
  }

  async deleteTask(id: string) {
    const existing = await taskRepository.findRawById(id);
    if (!existing) {
      throw ApiError.notFound("Task not found");
    }

    return taskRepository.delete(id);
  }
}

export const taskService = new TaskService();
