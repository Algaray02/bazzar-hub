import { z } from "zod";
import { EventTypeEnum, HighlightsEnum } from "./enums";

export const rundownItemSchema = z.object({
  time: z.string().min(1, "Jam wajib diisi"),
  activity: z.string().min(1, "Aktivitas wajib diisi"),
});

export const faqItemSchema = z.object({
  q: z.string().min(1, "Pertanyaan wajib diisi"),
  a: z.string().min(1, "Jawaban wajib diisi"),
});

export const eventSchema = z.object({
  title: z.string().min(3, "Judul event minimal 3 karakter"),
  description: z.string().min(10, "Deskripsi minimal 10 karakter"),
  location: z.string().min(3, "Lokasi wajib diisi"),
  city: z.string().min(1, "Kota wajib dipilih"),
  date: z.coerce.date(),
  time: z.string().min(1, "Waktu wajib diisi"),
  type: EventTypeEnum,
  image: z
    .union([
      z.string().url("URL tidak valid").optional().or(z.literal("")),
      z.any(),
      // .refine((file) => file instanceof File, "Format harus berupa file gambar")
      // .refine((file) => file?.size <= MAX_FILE_SIZE, `Max file size is 5MB.`)
      // .refine(
      //   (file) => ACCEPTED_IMAGE_TYPES.includes(file?.type),
      //   "Hanya format .jpg, .jpeg, .png and .webp yang didukung."
      // )
    ])
    .optional(),
  organizer: z.string().optional().nullable(),
  highlights: z
    .union([z.string(), z.array(HighlightsEnum)])
    .optional()
    .nullable(),
  rundown: z.array(rundownItemSchema).optional().default([]),
  faq: z.array(faqItemSchema).optional().default([]),
});

export const createEventSchema = eventSchema;

export const updateEventSchema = eventSchema.partial();

export const eventFormSchema = z.object({
  title: z.string().min(3, "Judul event minimal 3 karakter"),
  description: z.string().min(10, "Deskripsi minimal 10 karakter"),
  location: z.string().min(3, "Lokasi wajib diisi"),
  city: z.string().min(1, "Kota wajib dipilih"),
  date: z.date({ required_error: "Tanggal wajib dipilih" }),
  time: z.string().min(1, "Waktu wajib diisi"),
  type: z.enum(["WEEKLY", "SPECIAL"]),
  image: z
    .union([z.string(), z.instanceof(File)])
    .optional()
    .nullable(),
  organizer: z.string().min(1, "Nama penyelenggara wajib diisi"),
  highlights: z.array(z.string()).optional().default([]),
  rundown: z.array(rundownItemSchema).optional().default([]),
  faq: z.array(faqItemSchema).optional().default([]),
});
