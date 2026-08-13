export type Role = "USER" | "ADMIN";

export interface UserModel {
  id: string;
  name: string;
  email: string;
  password: string;
  role: Role;
  isTeamMember: boolean;
  createdAt: Date;
}

/** User data returned to clients (no password) */
export interface UserSelectModel {
  id: string;
  name: string;
  email: string;
  role: Role;
  isTeamMember: boolean;
  createdAt: Date;
}

export interface CreateUserData {
  name: string;
  email: string;
  role?: Role;
  isTeamMember?: boolean;
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
  role?: Role;
  isTeamMember?: boolean;
}
