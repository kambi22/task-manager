export type Role = "USER" | "ADMIN";

export interface UserModel {
  id: string;
  name: string;
  email: string;
  role: Role;
  createdAt: Date;
}

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
