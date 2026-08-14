import { taskRepository } from "../repositories/task.repository";
import { userRepository } from "../repositories/user.repository";
import ApiError from "../utils/ApiError";
import { buildPaginationMeta } from "../utils/pagination";
import type { TaskQueryParams, CreateTaskData, UpdateTaskData } from "../models/task.model";
import type { Role } from "../models/user.model";
import { taskHistoryService } from "./task-history.service";


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

    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 20;
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

  async createTask(data: CreateTaskData, creator: { userId: string; role: Role }) {
    if (data.assignedTo) {
      const user = await userRepository.findById(data.assignedTo);
      if (!user) {
        throw ApiError.badRequest("Assigned user not found");
      }
    }

    const task = await taskRepository.create(data);

    // Fetch creator details
    const creatorUser = await userRepository.findById(creator.userId);
    const creatorName = creatorUser ? creatorUser.name : "Unknown User";

    await taskHistoryService.logEvent({
      taskId: task.id,
      taskTitle: task.title,
      userId: creator.userId,
      userName: creatorName,
      action: "CREATE",
      details: { message: `Task "${task.title}" was created.` },
    });

    return task;
  }

  async updateTask(id: string, data: UpdateTaskData, requester: { userId: string; role: Role }) {
    const existing = await taskRepository.findRawById(id);
    if (!existing) {
      throw ApiError.notFound("Task not found");
    }

    if (requester.role !== "ADMIN") {
      if (existing.assignedTo !== requester.userId) {
        throw ApiError.forbidden("Access denied: You are not authorized to update this task");
      }
      
      const fields = Object.keys(data);
      const invalidFields = fields.filter(
        (key) => key !== "status" && data[key as keyof UpdateTaskData] !== undefined
      );
      if (invalidFields.length > 0) {
        throw ApiError.forbidden("Access denied: You can only update the status of this task");
      }
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

    // Track changes
    const changes: string[] = [];
    if (data.title !== undefined && data.title !== existing.title) {
      changes.push(`Title changed from "${existing.title}" to "${data.title}"`);
    }
    if (data.description !== undefined && data.description !== existing.description) {
      const oldDesc = existing.description ? `"${existing.description}"` : "empty";
      const newDesc = data.description ? `"${data.description}"` : "empty";
      changes.push(`Description updated from ${oldDesc} to ${newDesc}`);
    }
    if (data.status !== undefined && data.status !== existing.status) {
      changes.push(`Status updated from ${existing.status} to ${data.status}`);
    }
    if (data.priority !== undefined && data.priority !== existing.priority) {
      changes.push(`Priority updated from ${existing.priority} to ${data.priority}`);
    }
    if (data.assignedTo !== undefined && data.assignedTo !== existing.assignedTo) {
      let oldName = "Unassigned";
      let newName = "Unassigned";
      if (existing.assignedTo) {
        const u = await userRepository.findById(existing.assignedTo);
        if (u) oldName = u.name;
      }
      if (data.assignedTo) {
        const u = await userRepository.findById(data.assignedTo);
        if (u) newName = u.name;
      }
      changes.push(`Assignee changed from ${oldName} to ${newName}`);
    }
    if (data.dueDate !== undefined) {
      const existingDate = existing.dueDate ? new Date(existing.dueDate).toISOString().split('T')[0] : "none";
      const newDate = data.dueDate ? new Date(data.dueDate).toISOString().split('T')[0] : "none";
      if (existingDate !== newDate) {
        changes.push(`Due date updated from ${existingDate} to ${newDate}`);
      }
    }

    const task = await taskRepository.update(id, updateData);

    if (changes.length > 0) {
      const requesterUser = await userRepository.findById(requester.userId);
      const requesterName = requesterUser ? requesterUser.name : "Unknown User";

      await taskHistoryService.logEvent({
        taskId: task.id,
        taskTitle: task.title,
        userId: requester.userId,
        userName: requesterName,
        action: "UPDATE",
        details: { changes },
      });
    }

    return task;
  }

  async deleteTask(id: string, requester: { userId: string; role: Role }) {
    const existing = await taskRepository.findRawById(id);
    if (!existing) {
      throw ApiError.notFound("Task not found");
    }

    const task = await taskRepository.delete(id);

    const requesterUser = await userRepository.findById(requester.userId);
    const requesterName = requesterUser ? requesterUser.name : "Unknown User";

    await taskHistoryService.logEvent({
      taskId: id,
      taskTitle: existing.title,
      userId: requester.userId,
      userName: requesterName,
      action: "DELETE",
      details: { message: `Task "${existing.title}" was deleted permanently.` },
    });

    return task;
  }
}

export const taskService = new TaskService();
