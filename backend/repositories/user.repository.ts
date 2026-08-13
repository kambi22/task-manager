import prisma from "../config/prisma";
import type { CreateUserData, UpdateUserData } from "../models/user.model";

export class UserRepository {
  /** Get all users (never returns password) with optional filtering by isTeamMember */
  async findAll(filters?: { isTeamMember?: boolean }) {
    const where: any = {};
    if (filters?.isTeamMember !== undefined) {
      where.isTeamMember = filters.isTeamMember;
    }

    return prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isTeamMember: true,
        createdAt: true,
      },
      orderBy: { name: "asc" },
    });
  }

  /** Find user by ID (no password) */
  async findById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isTeamMember: true,
        createdAt: true,
      },
    });
  }

  /** Find user by email (no password) */
  async findByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isTeamMember: true,
        createdAt: true,
      },
    });
  }

  /** Find user by email WITH password (for login verification) */
  async findByEmailWithPassword(email: string) {
    return prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        password: true,
        role: true,
        isTeamMember: true,
        createdAt: true,
      },
    });
  }

  /** Create a new user (with hashed password from auth service) */
  async create(data: CreateUserData & { password?: string }) {
    return prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: data.password || "",
        role: data.role,
        isTeamMember: data.isTeamMember ?? false,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isTeamMember: true,
        createdAt: true,
      },
    });
  }

  /** Update a user by ID */
  async update(id: string, data: UpdateUserData) {
    return prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isTeamMember: true,
        createdAt: true,
      },
    });
  }

  /** Update team status for multiple users in bulk */
  async updateManyTeamStatus(ids: string[], isTeamMember: boolean) {
    return prisma.user.updateMany({
      where: {
        id: { in: ids },
      },
      data: {
        isTeamMember,
      },
    });
  }

  /** Delete a user by ID */
  async delete(id: string) {
    return prisma.user.delete({
      where: { id },
    });
  }

  async count() {
    return prisma.user.count();
  }
}

export const userRepository = new UserRepository();
