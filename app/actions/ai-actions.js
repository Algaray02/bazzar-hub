"use server";

import { db } from "@/lib/db";
import {
  verifyPaymentReceipt,
  generateStoreDescription,
  analyzeReviewSummary,
  generateEventDescription,
} from "@/lib/services/aiService";

export async function verifyBookingPaymentAction(bookingId) {
  try {
    const booking = await db.booking.findUnique({
      where: { id: bookingId },
      include: {
        booth: {
          select: { price: true },
        },
      },
    });

    if (!booking || !booking.paymentProof) {
      return { success: false, error: "Booking or payment proof not found" };
    }

    const result = await verifyPaymentReceipt(
      booking.paymentProof,
      booking.booth.price
    );

    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: "Verification failed" };
  }
}

export async function generateShopDescriptionAction(formData) {
  const name = formData.get("name");
  const category = formData.get("category");

  if (!name || !category) {
    return { success: false, error: "Nama dan Kategori wajib diisi." };
  }

  try {
    const description = await generateStoreDescription(name, category);
    return { success: true, description };
  } catch (error) {
    return { success: false, error: "Gagal memproses permintaan AI." };
  }
}

export async function generateEventDescriptionAction(formData) {
  const title = formData.get("title");
  const city = formData.get("city");
  const type = formData.get("type");

  if (!title || !city) {
    return { success: false, error: "Judul dan Kota wajib diisi." };
  }

  try {
    const description = await generateEventDescription(title, city, type);
    return { success: true, description };
  } catch (error) {
    return { success: false, error: "Gagal memproses permintaan AI." };
  }
}

export async function getTenantInsightsAction(userId) {
  try {
    const reviews = await db.review.findMany({
      where: {
        booking: {
          userId: userId,
        },
      },
      select: {
        comment: true,
        rating: true,
      },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    if (reviews.length === 0) {
      return { success: false, error: "Not enough data" };
    }

    const insights = await analyzeReviewSummary(reviews);

    if (!insights) {
      return { success: false, error: "Analysis failed" };
    }

    return { success: true, data: insights };
  } catch (error) {
    return { success: false, error: "Server error" };
  }
}
