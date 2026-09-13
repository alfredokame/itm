import { rolesService } from "@/api/services/roles.service";
import type { Role } from "@/types/role.types";
import { create } from "zustand";

interface RoleState {
  roles: Role[];
  isLoading: boolean;
  error: string | null;
  fetchRoles: () => Promise<void>;
}

export const useRoleStore = create<RoleState>((set) => ({
  roles: [],
  isLoading: false,
  error: null,

  fetchRoles: async () => {
    set({ isLoading: true, error: null });
    try {
      const roles = await rolesService.getAll();
      set({ roles, isLoading: false });
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : "No se pudieron cargar los roles",
        isLoading: false,
      });
    }
  },
}));
