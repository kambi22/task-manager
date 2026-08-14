/** Auth-related types for signup, login, and authentication state */

export interface SignupData {
  name: string;
  email: string;
  password: string;
  role?: "USER" | "ADMIN";
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: "USER" | "ADMIN";
  isTeamMember: boolean;
  createdAt: string;
}

export interface AuthResponse {
  user: AuthUser;
  token: string;
}
