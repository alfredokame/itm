export interface Role {
  id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  description: string;
}

export interface RolesResponse {
  roles: Role[];
  total: number;
  page: number;
  limit: number;
}
