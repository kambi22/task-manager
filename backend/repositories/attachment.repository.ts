import prisma from "../config/prisma";

export interface CreateAttachmentInput {
  taskId: string;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  mimeType: string;
}

export class AttachmentRepository {
  async create(data: CreateAttachmentInput) {
    return prisma.attachment.create({
      data: {
        taskId: data.taskId,
        fileName: data.fileName,
        fileUrl: data.fileUrl,
        fileSize: data.fileSize,
        mimeType: data.mimeType,
      },
    });
  }

  async findById(id: string) {
    return prisma.attachment.findUnique({
      where: { id },
    });
  }

  async findByTaskId(taskId: string) {
    return prisma.attachment.findMany({
      where: { taskId },
      orderBy: { createdAt: "desc" },
    });
  }

  async delete(id: string) {
    return prisma.attachment.delete({
      where: { id },
    });
  }
}

export const attachmentRepository = new AttachmentRepository();
