import { useEffect, useState } from "react";
import { usersService } from "@/api/services/users.service";
import type { User } from "@/types/user.types";

const REPORT_USER_ROLES = new Set(["seller", "admin"]);

const isReportUser = (user: User) =>
  user.roles?.some((role) =>
    REPORT_USER_ROLES.has(role.name.trim().toLowerCase()),
  ) ?? false;

export const useReportUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadUsers = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await usersService.getAll({ page: 1, limit: 100 });
        if (isMounted) {
          setUsers(response.data.filter(isReportUser));
        }
      } catch (loadError) {
        if (isMounted) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "No se pudieron cargar los usuarios",
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void loadUsers();

    return () => {
      isMounted = false;
    };
  }, []);

  return { users, isLoading, error };
};
