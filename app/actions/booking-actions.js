"use server";

import {
  createBookingTransaction,
  verifyBooking,
} from "@/lib/services/bookingService";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { bookingSchema, createBookingSchema } from "@/lib/validators/booking";
import { authOptions } from "@/lib/auth";

export async function createBookingAction(formData) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return {
      success: false,
      error: "Anda harus login terlebih dahulu",
    };
  }

  try {
    const rawData = Object.fromEntries(formData.entries());
    const validated = createBookingSchema.parse(rawData);

    const booking = await createBookingTransaction(session.user.id, {
      boothId: validated.boothId,
      name: validated.name,
      category: validated.category,
      description: validated.description,
      banner: validated.banner || null,
      logo: validated.logo || null,
      paymentProof: validated.paymentProof || null,
    });

    revalidatePath("/seller");
    revalidatePath("/admin/bookings");

    return {
      success: true,
      message: "Booking berhasil! Menunggu verifikasi admin.",
      bookingId: booking.id,
    };
  } catch (error) {
    console.error("Create booking error:", error);
    let errorMessage = "Terjadi kesalahan saat memproses booking.";

    if (error.name === "ZodError") {
      errorMessage = error.errors[0]?.message || "Data formulir tidak valid.";
    } else if (error.message.includes("Booth ini sudah tidak tersedia")) {
      errorMessage = "Maaf, Booth ini baru saja diambil orang lain.";
    } else if (error.code === "P2002") {
      errorMessage = "Anda sudah melakukan booking untuk booth ini.";
    }
    return {
      success: false,
      error: errorMessage || "Gagal membuat booking",
    };
  }
}

export async function verifyBookingAction(bookingId, status) {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "ADMIN") {
    return {
      success: false,
      error: "Hanya admin yang dapat memverifikasi booking",
    };
  }

  try {
    if (!["PAID", "REJECTED"].includes(status)) {
      throw new Error("Status tidak valid");
    }

    const result = await verifyBooking(bookingId, status);

    revalidatePath("/admin/bookings");
    revalidatePath("/seller");

    return {
      success: true,
      message: `Booking berhasil di-${
        status === "PAID" ? "approve" : "reject"
      }`,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message || "Gagal memverifikasi booking",
    };
  }
}
