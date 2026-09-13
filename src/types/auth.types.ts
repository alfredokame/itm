export interface Role {
  id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  description: string;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: string;
  updatedAt: string;
  isActive?: boolean;
  address?: string;
  phone?: string;
  roles?: Role[];
  role?: string;
}

export interface AuthResponse {
  access_token: string;
  user: User;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  address: string;
  phone: string;
}

export interface CreateUserPayload {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  address: string;
  phone: string;
  roles: Array<{ id: string }>;
}

export interface UpdateUserPayload {
  email: string;
  firstName: string;
  lastName: string;
  address: string;
  phone: string;
  roles?: Array<{ id: string }>;
}
