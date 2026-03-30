import { z } from "zod";
import { StoreCategoryEnum } from "./enums";

export const bookingSchema = z.object({
  name: z.string().min(2, "Nama toko wajib diisi"),
  category: StoreCategoryEnum,
  description: z.string().min(10, "Deskripsi minimal 10 karakter"),
  logo: z
    .union([
      z.string().url("URL tidak valid").optional().or(z.literal("")),
      z.any(),
    ])
    .optional(),
  banner: z
    .union([
      z.string().url("URL tidak valid").optional().or(z.literal("")),
      z.any(),
    ])
    .optional(),
  paymentProof: z
    .union([
      z.string().url("URL tidak valid").optional().or(z.literal("")),
      z.any(),
    ])
    .optional(),
});

export const createBookingSchema = z.object({
  boothId: z.string().uuid("ID Booth tidak valid"),
  name: z.string().min(3, "Nama toko minimal 3 karakter"),
  category: StoreCategoryEnum,
  description: z.string().min(10, "Deskripsi minimal 10 karakter"),
  logo: z
    .union([
      z.string().url("URL tidak valid").optional().or(z.literal("")),
      z.any(),
    ])
    .optional(),
  banner: z
    .union([
      z.string().url("URL tidak valid").optional().or(z.literal("")),
      z.any(),
    ])
    .optional(),
  paymentProof: z
    .union([
      z.string().url("URL tidak valid").optional().or(z.literal("")),
      z.any(),
    ])
    .optional(),
});
