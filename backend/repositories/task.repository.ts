import prisma from "../config/prisma";
import type { TaskQueryParams, CreateTaskData, UpdateTaskData } from "../models/task.model";

export class TaskRepository {
  async count(where: any) {
    return prisma.task.count({ where });
  }

  async findMany(where: any, skip: number, limit: number, sortBy: string, sortOrder: "asc" | "desc") {
    return prisma.task.findMany({
      where,
      skip,
      take: limit,
      orderBy: { [sortBy]: sortOrder },
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
      },
    });
  }

  async findById(id: string) {
    return prisma.task.findUnique({
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
  }

  async findRawById(id: string) {
    return prisma.task.findUnique({
      where: { id },
    });
  }

  async create(data: CreateTaskData) {
    return prisma.task.create({
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
  }

  async update(id: string, updateData: any) {
    return prisma.task.update({
      where: { id },
      data: updateData,
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
      },
    });
  }

  async delete(id: string) {
    return prisma.task.delete({
      where: { id },
    });
  }

  async unassignUserTasks(userId: string) {
    return prisma.task.updateMany({
      where: { assignedTo: userId },
      data: { assignedTo: null },
    });
  }
}

export const taskRepository = new TaskRepository();
