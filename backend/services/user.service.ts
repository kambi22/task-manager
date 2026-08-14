import { userRepository } from "../repositories/user.repository";
import { taskRepository } from "../repositories/task.repository";
import ApiError from "../utils/ApiError";
import type { CreateUserData, UpdateUserData } from "../models/user.model";

export class UserService {
  async getAllUsers(filters?: { isTeamMember?: boolean }) {
    return userRepository.findAll(filters);
  }

  async getUserById(id: string) {
    const user = await userRepository.findById(id);
    if (!user) {
      throw ApiError.notFound("User not found");
    }
    return user;
  }

  async createUser(data: CreateUserData) {
    const existingUser = await userRepository.findByEmail(data.email);
    if (existingUser) {
      throw ApiError.conflict("A user with this email already exists");
    }

    return userRepository.create(data);
  }

  async updateUser(id: string, data: UpdateUserData) {
    const user = await userRepository.findById(id);
    if (!user) {
      throw ApiError.notFound("User not found");
    }

    if (user.isTeamMember && data.isTeamMember === false) {
      await taskRepository.unassignUserTasks(id);
    }

    // Email is no longer updateable from this service layer
    return userRepository.update(id, data);
  }

  async addUsersToTeam(userIds: string[]) {
    if (!userIds || userIds.length === 0) {
      throw ApiError.badRequest("At least one user ID must be provided");
    }
    return userRepository.updateManyTeamStatus(userIds, true);
  }

  async deleteUser(id: string) {
    const user = await userRepository.findById(id);
    if (!user) {
      throw ApiError.notFound("User not found");
    }

    await userRepository.delete(id);
    return { message: "User deleted successfully" };
  }
}

export const userService = new UserService();
