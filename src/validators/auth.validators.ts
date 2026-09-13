import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string({ error: "El email es requerido" })
    .email("El email debe ser válido"),
  password: z
    .string({ error: "La contraseña es requerida" })
    .min(8, "La contraseña debe tener al menos 8 caracteres")
    .max(20, "La contraseña no puede exceder 20 caracteres"),
});

export const changePasswordSchema = z.object({
  password: z
    .string({ error: "La contraseña es requerida" })
    .min(8, "La contraseña debe tener al menos 8 caracteres")
    .max(20, "La contraseña no puede exceder 20 caracteres"),
  confirmPassword: z
    .string({ error: "La contraseña es requerida" })
    .min(8, "La contraseña debe tener al menos 8 caracteres")
    .max(20, "La contraseña no puede exceder 20 caracteres"),
});

export const registerSchema = z
  .object({
    email: z
      .string({ error: "El email es requerido" })
      .email("El email debe ser válido"),
    password: z
      .string({ error: "La contraseña es requerida" })
      .min(8, "La contraseña debe tener al menos 8 caracteres")
      .max(20, "La contraseña no puede exceder 20 caracteres"),
    confirmPassword: z.string({
      error: "Confirmar contraseña es requerido",
    }),
    firstName: z
      .string({ error: "El nombre es requerido" })
      .min(2, "El nombre debe tener al menos 2 caracteres"),
    lastName: z
      .string({ error: "El apellido es requerido" })
      .min(2, "El apellido debe tener al menos 2 caracteres"),
    address: z
      .string({ error: "La dirección es requerida" })
      .min(10, "La dirección debe tener al menos 10 caracteres"),
    phone: z
      .string({ error: "El teléfono es requerido" })
      .min(8, "El teléfono debe tener al menos 8 caracteres")
      .max(15, "El teléfono no puede exceder 15 caracteres"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

export const updateUserSchema = z.object({
  email: z
    .string({ error: "El email es requerido" })
    .email("El email debe ser válido"),
  firstName: z
    .string({ error: "El nombre es requerido" })
    .min(2, "El nombre debe tener al menos 2 caracteres"),
  lastName: z
    .string({ error: "El apellido es requerido" })
    .min(2, "El apellido debe tener al menos 2 caracteres"),
  address: z
    .string({ error: "La dirección es requerida" })
    .min(10, "La dirección debe tener al menos 10 caracteres"),
  phone: z
    .string({ error: "El teléfono es requerido" })
    .min(8, "El teléfono debe tener al menos 8 caracteres")
    .max(15, "El teléfono no puede exceder 15 caracteres"),
});

export const adminRegisterSchema = registerSchema.extend({
  roleId: z.string().min(1, "El rol es requerido"),
});

export const adminUpdateUserSchema = updateUserSchema.extend({
  roleId: z.string().min(1, "El rol es requerido"),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type ChangePassowrdFormData = z.infer<typeof changePasswordSchema>;
export type UpdateUserFormData = z.infer<typeof updateUserSchema>;
export type AdminRegisterFormData = z.infer<typeof adminRegisterSchema>;
export type AdminUpdateUserFormData = z.infer<typeof adminUpdateUserSchema>;
