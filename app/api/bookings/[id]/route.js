import { NextResponse } from "next/server";
import { getBookingById } from "@/lib/services/bookingService";

export async function GET(request, ctx) {
  try {
    const params = await ctx.params;
    const { id } = params;
    const booking = await getBookingById(id);

    if (!booking) {
      return NextResponse.json(
        { error: "Booking tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json(booking);
  } catch (error) {
    console.error("Get booking error:", error);
    return NextResponse.json(
      { error: error.message || "Gagal mengambil data booking" },
      { status: 500 }
    );
  }
}
