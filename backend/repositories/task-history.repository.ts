import prisma from "../config/prisma";

export interface CreateTaskHistoryData {
  taskId: string;
  taskTitle: string;
  userId?: string | null;
  userName: string;
  action: string;
  details?: any;
}

export class TaskHistoryRepository {
  async create(data: CreateTaskHistoryData) {
    return prisma.taskHistory.create({
      data: {
        taskId: data.taskId,
        taskTitle: data.taskTitle,
        userId: data.userId || null,
        userName: data.userName,
        action: data.action,
        details: data.details || null,
      },
    });
  }

  async count(where: any) {
    return prisma.taskHistory.count({ where });
  }

  async findMany(where: any, skip: number, limit: number) {
    return prisma.taskHistory.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
      },
    });
  }
}

export const taskHistoryRepository = new TaskHistoryRepository();
