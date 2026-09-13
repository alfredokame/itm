import { z } from "zod";

export const createUserSchema = z.object({
  name: z
    .string({ error: "El nombre es requerido" })
    .min(2, "El nombre debe tener al menos 2 caracteres"),
  lastName: z
    .string({ error: "El apellido es requerido" })
    .min(2, "El apellido debe tener al menos 2 caracteres"),
  email: z
    .string({ error: "El email es requerido" })
    .email("El email debe ser valido"),
  password: z
    .string({ error: "La contrasena es requerida" })
    .min(8, "La contrasena debe tener al menos 8 caracteres")
    .max(20, "La contrasena no puede exceder 20 caracteres"),
  roleId: z.string().min(1, "El rol es requerido"),
});

export const updateUserSchema = createUserSchema.omit({ password: true });

export type CreateUserFormData = z.infer<typeof createUserSchema>;
export type UpdateUserFormData = z.infer<typeof updateUserSchema>;
