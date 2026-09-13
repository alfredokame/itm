import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { usersService } from "../../api/services/users.service";
import type { User } from "../../types/auth.types";
import {
  createUserSchema,
  updateUserSchema,
  type CreateUserFormData,
  type UpdateUserFormData,
} from "../../validators/user.validators";
import Alert from "../common/Alert";
import Button from "../common/Button";
import Input from "../common/Input";
import Select from "../common/Select";
import { useRoles } from "../../hooks/useRoles";

interface UserFormProps {
  user?: User | null;
  onSuccess?: () => void;
}

type UserFormData = CreateUserFormData | UpdateUserFormData;

const UserForm = ({ user, onSuccess }: UserFormProps) => {
  const isEditing = !!user;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const {
    roles,
    isLoading: areRolesLoading,
    error: rolesError,
    fetchRoles,
  } = useRoles();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UserFormData>({
    resolver: zodResolver(isEditing ? updateUserSchema : createUserSchema),
    defaultValues: user
      ? {
          name: user.firstName,
          lastName: user.lastName,
          email: user.email,
          roleId: user.roles?.[0]?.id ?? "",
        }
      : undefined,
  });

  useEffect(() => {
    void fetchRoles();
  }, [fetchRoles]);

  useEffect(() => {
    if (user) {
      reset({
        name: user.firstName,
        lastName: user.lastName,
        email: user.email,
        roleId: user.roles?.[0]?.id ?? "",
      });
    }
  }, [reset, user]);

  const onSubmit = async (data: UserFormData) => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      if (isEditing && user) {
        const updateData = data as UpdateUserFormData;
        await usersService.update(user.id, {
          firstName: updateData.name,
          lastName: updateData.lastName,
          email: updateData.email,
          address: "",
          phone: "",
          roles: [{ id: updateData.roleId }],
        });
      } else {
        const createData = data as CreateUserFormData;
        await usersService.create({
          firstName: createData.name,
          lastName: createData.lastName,
          email: createData.email,
          password: createData.password,
          address: "",
          phone: "",
          roles: [{ id: createData.roleId }],
        });
        reset();
      }

      onSuccess?.();
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : "No se pudo guardar el usuario",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {submitError && (
        <Alert variant="destructive" onClose={() => setSubmitError(null)}>
          {submitError}
        </Alert>
      )}

      <Input
        label="Nombre"
        placeholder="Juan"
        {...register("name")}
        error={errors.name?.message}
      />

      <Input
        label="Apellido"
        placeholder="Perez"
        {...register("lastName")}
        error={errors.lastName?.message}
      />

      <Input
        label="Email"
        placeholder="usuario@email.com"
        type="email"
        {...register("email")}
        error={errors.email?.message}
      />

      {!isEditing && (
        <Input
          label="Contrasena"
          placeholder="********"
          type="password"
          {...register("password")}
          error={"password" in errors ? errors.password?.message : undefined}
        />
      )}

      <Select
        label="Rol"
        options={[
          {
            value: "",
            label: areRolesLoading ? "Cargando roles..." : "Selecciona un rol",
          },
          ...roles.map((role) => ({ value: role.id, label: role.name })),
        ]}
        disabled={areRolesLoading}
        {...register("roleId")}
        error={errors.roleId?.message}
      />

      {rolesError && <Alert variant="destructive">{rolesError}</Alert>}

      <div className="flex justify-end">
        <Button type="submit" isLoading={isSubmitting}>
          {isEditing ? "Actualizar usuario" : "Crear usuario"}
        </Button>
      </div>
    </form>
  );
};

export default UserForm;
