export type Role = "USER" | "ADMIN";

export interface UserModel {
  id: string;
  name: string;
  email: string;
  password: string;
  role: Role;
  createdAt: Date;
}

/** User data returned to clients (no password) */
export interface UserSelectModel {
  id: string;
  name: string;
  email: string;
  role: Role;
  createdAt: Date;
}

export interface CreateUserData {
  name: string;
  email: string;
  role?: Role;
}

export interface SignupData {
  name: string;
  email: string;
  password: string;
  role?: Role;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: UserSelectModel;
  token: string;
}

export interface UpdateUserData {
  name?: string;
  email?: string;
  role?: Role;
}
