import { userRepository } from "../repositories/user.repository";
import ApiError from "../utils/ApiError";
import type { CreateUserData, UpdateUserData } from "../models/user.model";

export class UserService {
  async getAllUsers() {
    return userRepository.findAll();
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

    // If email is changing, check uniqueness
    if (data.email && data.email !== user.email) {
      const existingUser = await userRepository.findByEmail(data.email);
      if (existingUser) {
        throw ApiError.conflict("A user with this email already exists");
      }
    }

    return userRepository.update(id, data);
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
