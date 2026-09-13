import axiosClient from "../client";
import { ENDPOINTS } from "../endpoints";
import type { Role, RolesResponse } from "../../types/role.types";

export const rolesService = {
  async getAll(): Promise<Role[]> {
    const response = await axiosClient.get(ENDPOINTS.ROLES.LIST);
    const responseData = response.data as
      | RolesResponse
      | { data?: RolesResponse };
    const data = "data" in responseData ? responseData.data : responseData;

    return data && "roles" in data ? data.roles : [];
  },
};
