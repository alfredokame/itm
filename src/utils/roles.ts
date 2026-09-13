import type { User } from "../types/auth.types";

export const hasUserRole = (user: User | null, roleName: string): boolean => {
  if (!user) return false;

  const normalizedRole = roleName.toLowerCase();
  return (
    user.role?.toLowerCase() === normalizedRole ||
    user.roles?.some((role) => role.name.toLowerCase() === normalizedRole) ===
      true
  );
};
