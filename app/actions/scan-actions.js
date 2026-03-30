"use server";

import { db } from "@/lib/db";
import { headers } from "next/headers";

export async function recordScanAction(ticketCode) {
  try {
    const headersList = await headers();
    const ip = headersList.get("x-forwarded-for") || "unknown";
    const userAgent = headersList.get("user-agent") || "unknown";

    const booking = await db.booking.findUnique({
      where: { ticketCode },
      include: {
        booth: {
          select: {
            id: true,
            code: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!booking) return { success: false, error: "Tiket tidak ditemukan" };

    const recentScan = await db.bookingScan.findFirst({
      where: {
        bookingId: booking.id,
        ipAddress: ip,
        createdAt: {
          gte: new Date(Date.now() - 5 * 60 * 1000),
        },
      },
    });

    if (recentScan) {
      return {
        success: true,
        booking: {
          id: booking.id,
          name: booking.name,
          booth: booking.booth,
        },
        ignored: true,
        message: "Scan terdeteksi duplikat (5 menit terakhir)",
      };
    }

    await db.bookingScan.create({
      data: {
        bookingId: booking.id,
        ipAddress: ip,
        userAgent: userAgent,
      },
    });

    return {
      success: true,
      booking: {
        id: booking.id,
        name: booking.name,
        booth: booking.booth,
      },
    };
  } catch (error) {
    return { success: false, error: "Gagal merekam scan" };
  }
}

export async function checkInTicket(boothCode, currentEventId) {
  try {
    const booth = await db.booth.findUnique({
      where: {
        eventId_code: {
          eventId: currentEventId,
          code: boothCode,
        },
      },
      include: {
        event: true,
        booking: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!booth) {
      return {
        success: false,
        error: "Kode Booth tidak valid atau tidak ditemukan pada event ini.",
      };
    }

    if (!booth.booking) {
      return {
        success: false,
        error: `Booth ${booth.code} belum dibooking/kosong.`,
      };
    }

    const booking = booth.booking;

    if (booth.eventId !== currentEventId) {
      return {
        success: false,
        error: `Salah Event! Booth ini terdaftar di event: "${booth.event.title}"`,
      };
    }

    if (booking.status !== "PAID") {
      return {
        success: false,
        error: `Booking untuk booth ini belum lunas (Status: ${booking.status}).`,
      };
    }

    if (booking.isCheckedIn) {
      const time = new Date(booking.checkInTime).toLocaleTimeString("id-ID");
      return {
        success: false,
        error: `Booth ini sudah Check-in sebelumnya pada pukul ${time}.`,
      };
    }

    await db.booking.update({
      where: { id: booking.id },
      data: {
        isCheckedIn: true,
        checkInTime: new Date(),
      },
    });

    return {
      success: true,
      data: {
        sellerName: booking.name || booking.user.name,
        boothCode: booth.code,
        storeName: booking.name,
        checkInTime: new Date(),
      },
    };
  } catch (error) {
    console.error("Scan Error:", error);
    return {
      success: false,
      error: "Terjadi kesalahan sistem saat memproses data.",
    };
  }
}
