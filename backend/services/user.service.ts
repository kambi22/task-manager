import { userRepository } from "../repositories/user.repository";
import ApiError from "../utils/ApiError";
import type { CreateUserData } from "../models/user.model";

export class UserService {
  async getAllUsers() {
    return userRepository.findAll();
  }

  async createUser(data: CreateUserData) {
    const existingUser = await userRepository.findByEmail(data.email);
    if (existingUser) {
      throw ApiError.conflict("A user with this email already exists");
    }

    return userRepository.create(data);
  }
}

export const userService = new UserService();
