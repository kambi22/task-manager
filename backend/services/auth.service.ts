import bcrypt from "bcryptjs";
import { userRepository } from "../repositories/user.repository";
import { generateToken } from "../config/jwt";
import ApiError from "../utils/ApiError";
import type { SignupData, LoginData, AuthResponse } from "../models/user.model";

const SALT_ROUNDS = 10;

export class AuthService {
  /**
   * Register a new user, hash password, return user + JWT.
   */
  async signup(data: SignupData): Promise<AuthResponse> {
    const existing = await userRepository.findByEmail(data.email);
    if (existing) {
      throw ApiError.conflict("A user with this email already exists");
    }

    const hashedPassword = await bcrypt.hash(data.password, SALT_ROUNDS);

    const user = await userRepository.create({
      name: data.name,
      email: data.email,
      password: hashedPassword,
      role: data.role,
    });

    const token = generateToken(user.id, user.role);

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        isTeamMember: user.isTeamMember,
        createdAt: user.createdAt,
      },
      token,
    };
  }

  /**
   * Authenticate user with email + password, return user + JWT.
   */
  async login(data: LoginData): Promise<AuthResponse> {
    const user = await userRepository.findByEmailWithPassword(data.email);
    if (!user) {
      throw ApiError.unauthorized("Invalid email or password");
    }

    const isPasswordValid = await bcrypt.compare(data.password, user.password);
    if (!isPasswordValid) {
      throw ApiError.unauthorized("Invalid email or password");
    }

    const token = generateToken(user.id, user.role);

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        isTeamMember: user.isTeamMember,
        createdAt: user.createdAt,
      },
      token,
    };
  }

  /**
   * Get current user from token payload.
   */
  async getMe(userId: string) {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw ApiError.notFound("User not found");
    }
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      isTeamMember: user.isTeamMember,
      createdAt: user.createdAt,
    };
  }
}

export const authService = new AuthService();
