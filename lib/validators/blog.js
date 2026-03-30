import { z } from "zod";
import { BlogCategoryEnum } from "./enums";

export const blogSchema = z.object({
  title: z.string().min(5, "Judul minimal 5 karakter"),
  slug: z
    .string()
    .min(3, "Slug wajib diisi")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug harus lowercase dan pakai dash")
    .optional(), 
  category: BlogCategoryEnum,
  excerpt: z.string().min(10, "Ringkasan wajib diisi"),
  content: z.string().min(50, "Konten terlalu pendek"),
  image: z.string().url("URL gambar tidak valid").optional().or(z.literal("")),
  published: z.coerce.boolean().default(false),
});

export const upsertBlogSchema = blogSchema.extend({
  id: z.string().cuid().optional(),
});