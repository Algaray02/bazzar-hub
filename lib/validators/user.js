import { z } from "zod";
import { RoleEnum } from "./enums";

export const profileSchema = z.object({
  name: z.string().min(2, "Nama minimal 2 karakter"),
  phone: z.string().optional().or(z.literal("")),
  avatar: z.string().url().optional().or(z.literal("")),
});

export const updateUserSchema = profileSchema.extend({
  email: z.string().email("Email tidak valid").optional(),
  role: RoleEnum.optional(),
});

export const createUserSchema = z.object({
  name: z.string().min(2, "Nama minimal 2 karakter"),
  email: z.string().email("Email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
  phone: z.string().optional().or(z.literal("")),
  avatar: z.string().url().optional().or(z.literal("")),
  role: RoleEnum,
});