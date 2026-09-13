import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import {
  registerSchema,
  type RegisterFormData,
  updateUserSchema,
  type UpdateUserFormData,
  adminRegisterSchema,
  adminUpdateUserSchema,
  type AdminRegisterFormData,
  type AdminUpdateUserFormData,
} from "../../validators/auth.validators";
import { useAuth } from "../../hooks/useAuth";
import InputComponent from "../common/InputComponent";
import { Button } from "@/components/ui/button";
import Alert from "../common/Alert";
import { User } from "@/types/user.types";
import { usersService } from "@/api/services/users.service";
import { showError, showSuccess } from "@/utils/toast";
import Select from "../common/Select";
import { useRoles } from "../../hooks/useRoles";

interface RegisterFormProps {
  user?: User | null;
  onSuccess?: () => void;
  showRole?: boolean;
}

type UserFormData =
  | RegisterFormData
  | UpdateUserFormData
  | AdminRegisterFormData
  | AdminUpdateUserFormData;

const RegisterForm = ({
  onSuccess,
  user,
  showRole = false,
}: RegisterFormProps) => {
  const navigate = useNavigate();
  const isEditing = !!user;
  const {
    register: authRegister,
    isLoading,
    error,
    clearError,
    isAuthenticated,
  } = useAuth();
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
    resolver: zodResolver(
      isEditing
        ? showRole
          ? adminUpdateUserSchema
          : updateUserSchema
        : showRole
          ? adminRegisterSchema
          : registerSchema,
    ),
    defaultValues: user
      ? {
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
          address: user.address,
          ...(showRole ? { roleId: user.roles?.[0]?.id ?? "" } : {}),
        }
      : undefined,
  });

  useEffect(() => {
    if (showRole) {
      void fetchRoles();
    }
  }, [fetchRoles, showRole]);

  useEffect(() => {
    if (user) {
      reset({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        address: user.address,
        ...(showRole ? { roleId: user.roles?.[0]?.id ?? "" } : {}),
      });
    }
  }, [reset, showRole, user]);

  const onSubmit = async (data: UserFormData) => {
    try {
      setSubmitError(null);
      clearError();
      if (user && isEditing) {
        const updateUser = data as UpdateUserFormData & { roleId?: string };
        await usersService.update(user.id, {
          address: updateUser.address,
          firstName: updateUser.firstName,
          email: updateUser.email,
          lastName: updateUser.lastName,
          phone: updateUser.phone,
          roles:
            showRole && updateUser.roleId
              ? [{ id: updateUser.roleId }]
              : undefined,
        });
        showSuccess(
          "Usuario actualizado",
          "Los cambios del usuario se guardaron correctamente.",
        );
      } else {
        const createUser = data as RegisterFormData & { roleId?: string };
        if (showRole) {
          await usersService.create({
            email: createUser.email,
            password: createUser.password,
            firstName: createUser.firstName,
            lastName: createUser.lastName,
            address: createUser.address,
            phone: createUser.phone,
            roles: [{ id: createUser.roleId ?? "" }],
          });
          showSuccess("Usuario creado", "El usuario se creó correctamente.");
        } else {
          await authRegister(
            createUser.email,
            createUser.password,
            createUser.firstName,
            createUser.lastName,
            createUser.address,
            createUser.phone,
          );
          if (!isAuthenticated) {
            navigate("/login");
          }
        }
      }
      onSuccess?.();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      setSubmitError(message || "Error al registrarse");
      showError(
        isEditing
          ? "No se pudo actualizar el usuario"
          : "No se pudo crear el usuario",
        message,
      );
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 w-full max-w-md"
    >
      {(error || submitError) && (
        <Alert variant="destructive" onClose={clearError}>
          {error || submitError}
        </Alert>
      )}

      <InputComponent
        htmlForm="input-field-name"
        label="Nombre"
        placeholder="Juan"
        type="text"
        {...register("firstName")}
        error={errors.firstName?.message}
      />

      <InputComponent
        htmlForm="input-field-lastName"
        label="Apellidos"
        placeholder="Perez"
        type="text"
        {...register("lastName")}
        error={errors.lastName?.message}
      />

      <InputComponent
        htmlForm="input-field-email"
        label="Correo electrónico"
        placeholder="tu@email.com"
        type="email"
        {...register("email")}
        error={errors.email?.message}
      />

      <InputComponent
        htmlForm="input-field-address"
        label="Dirección"
        placeholder="Av. Principal 123, Ciudad"
        type="text"
        {...register("address")}
        error={errors.address?.message}
      />

      <InputComponent
        htmlForm="input-field-phone"
        label="Teléfono"
        placeholder="+1 234 567 890"
        type="text"
        {...register("phone")}
        error={errors.phone?.message}
      />

      {!isEditing && (
        <>
          <InputComponent
            htmlForm="input-field-password"
            label="Contraseña"
            placeholder="**********"
            type="password"
            {...register("password")}
            error={"password" in errors ? errors.password?.message : undefined}
          />

          <InputComponent
            htmlForm="input-field-confirmPassword"
            label="Confirmar Contraseña"
            placeholder="**********"
            type="password"
            {...register("confirmPassword")}
            error={
              "confirmPassword" in errors
                ? errors.confirmPassword?.message
                : undefined
            }
          />
        </>
      )}

      {showRole && (
        <>
          <Select
            label="Rol"
            options={[
              {
                value: "",
                label: areRolesLoading
                  ? "Cargando roles..."
                  : "Selecciona un rol",
              },
              ...roles.map((role) => ({ value: role.id, label: role.name })),
            ]}
            disabled={areRolesLoading}
            {...register("roleId")}
            error={"roleId" in errors ? errors.roleId?.message : undefined}
          />
          {rolesError && <Alert variant="destructive">{rolesError}</Alert>}
        </>
      )}

      <Button type="submit" disabled={isLoading} className="w-full bg-blue-950">
        {isLoading
          ? isEditing
            ? "Actualizando..."
            : "Registrando..."
          : isEditing
            ? "Actualizar"
            : "Crear"}
      </Button>

      {!isAuthenticated && (
        <p className="text-sm text-center text-muted-foreground">
          ¿Ya tienes cuenta?{" "}
          <a href="/login" className="text-primary hover:underline">
            Iniciar sesión
          </a>
        </p>
      )}
    </form>
  );
};

export default RegisterForm;
