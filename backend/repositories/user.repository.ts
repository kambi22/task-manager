import prisma from "../config/prisma";
import type { CreateUserData } from "../models/user.model";

export class UserRepository {
  async findAll() {
    return prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
      orderBy: { name: "asc" },
    });
  }

  async findById(id: string) {
    return prisma.user.findUnique({
      where: { id },
    });
  }

  async findByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
    });
  }

  async create(data: CreateUserData) {
    return prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        role: data.role,
      },
    });
  }

  async count() {
    return prisma.user.count();
  }
}

export const userRepository = new UserRepository();
