import { taskHistoryRepository } from "../repositories/task-history.repository";
import { buildPaginationMeta } from "../utils/pagination";

export interface HistoryQueryParams {
  taskId?: string;
  userId?: string;
  action?: string;
  page?: number;
  limit?: number;
}

export class TaskHistoryService {
  async getHistory(query: HistoryQueryParams) {
    const where: any = {};

    if (query.taskId) {
      where.taskId = query.taskId;
    }

    if (query.userId) {
      where.userId = query.userId;
    }

    if (query.action) {
      where.action = query.action;
    }

    const totalCount = await taskHistoryRepository.count(where);

    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 20;
    const skip = (page - 1) * limit;

    const history = await taskHistoryRepository.findMany(where, skip, limit);
    const pagination = buildPaginationMeta(totalCount, { page, limit, skip });

    return { history, pagination };
  }

  async logEvent(data: {
    taskId: string;
    taskTitle: string;
    userId: string | null;
    userName: string;
    action: "CREATE" | "UPDATE" | "DELETE";
    details?: any;
  }) {
    return taskHistoryRepository.create(data);
  }
}

export const taskHistoryService = new TaskHistoryService();
