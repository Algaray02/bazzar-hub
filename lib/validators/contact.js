import { z } from "zod";

export const contactFormSchema = z.object({
  name: z.string().min(2, "Nama minimal 2 karakter"),
  email: z.string().email("Email tidak valid"),
  subject: z.string().min(5, "Subjek minimal 5 karakter"),
  message: z.string().min(10, "Pesan minimal 10 karakter"),
});

export const messageStatusSchema = z.object({
  status: z.enum(["READ", "UNREAD", "ARCHIVED"]),
});