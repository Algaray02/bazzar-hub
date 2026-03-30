"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { createBulkBooths, deleteBooth } from "@/lib/services/boothService";

const generateBoothSchema = z.object({
  eventId: z.string(),
  quantity: z.coerce.number().min(1),
  price: z.coerce.number().min(0),
});

export async function generateBoothsAction(data) {
  try {
    const validated = generateBoothSchema.parse(data);

    await createBulkBooths(
      validated.eventId,
      validated.quantity,
      validated.price
    );

    revalidatePath(`/admin/events/${validated.eventId}`);
    return { success: true, message: "Booths generated successfully" };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function deleteBoothAction(boothId, eventId) {
  try {
    await deleteBooth(boothId);
    revalidatePath(`/admin/events/${eventId}`);
    return { success: true, message: "Booth deleted successfully" };
  } catch (error) {
    return { success: false, error: error.message };
  }
}