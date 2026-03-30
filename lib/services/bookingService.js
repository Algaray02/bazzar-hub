import "server-only";
import * as bookingRepository from "@/lib/repositories/bookingRepository";

export async function createBookingTransaction(userId, data) {
  const { boothId, name, category, description, banner, logo, paymentProof } =
    data;

  const booth = await bookingRepository.findBoothAvailable(boothId);

  if (!booth) {
    throw new Error(
      "Booth ini sudah tidak tersedia (baru saja diambil orang lain)."
    );
  }

  const user = await bookingRepository.findUserById(userId);

  if (!user) {
    throw new Error("User tidak ditemukan.");
  }

  const booking = await bookingRepository.createBooking({
    userId,
    boothId,
    name,
    category,
    description: description || "",
    banner: banner || null,
    logo: logo || null,
    paymentProof: paymentProof || null,
    status: "PENDING",
  });

  return booking;
}

export async function verifyBooking(bookingId, status) {
  if (!["PAID", "REJECTED"].includes(status)) {
    throw new Error("Status tidak valid. Gunakan PAID atau REJECTED.");
  }

  if (status === "REJECTED") {

    const deleted = await bookingRepository.deleteBooking(bookingId);
    return { action: "deleted", booking: deleted };
  }

  const updated = await bookingRepository.updateBooking(bookingId, {
    status: status, 
    ticketCode: crypto.randomUUID(), 
  });

  return { action: "updated", booking: updated };
}

export async function getBookingById(bookingId) {
  return await bookingRepository.findBookingById(bookingId);
}

export async function getBookings(options = {}) {
  return await bookingRepository.findManyBookings(options);
}

export async function checkInBooking(bookingId) {
  return await bookingRepository.updateBooking(bookingId, {
    isCheckedIn: true,
    checkInTime: new Date(),
  });
}