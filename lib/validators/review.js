import { z } from "zod";

export const reviewSchema = z.object({
  rating: z.number().min(1, { message: "Harap berikan bintang minimal 1" }),
  comment: z.string().min(5, { message: "Ulasan minimal 5 karakter" }),
});
