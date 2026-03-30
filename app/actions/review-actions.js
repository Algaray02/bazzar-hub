"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function createReviewAction(data) {
  try {
    const { bookingId, rating, comment } = data;

    if (!bookingId || !rating || !comment) {
      return { success: false, error: "Data tidak lengkap" };
    }

    await db.review.create({
      data: {
        bookingId,
        rating,
        comment,
        name: "Anonymous Visitor",
      },
    });

    revalidatePath("/");

    return { success: true };
  } catch (error) {
    return { success: false, error: "Gagal menyimpan ulasan" };
  }
}
