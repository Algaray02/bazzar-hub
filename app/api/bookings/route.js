import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getBookings } from "@/lib/services/bookingService";

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);

    const { searchParams } = new URL(request.url);
    const params = {
      userId: session?.user
        ? session.user.role === "ADMIN"
          ? searchParams.get("userId") || null
          : session.user.id
        : null,
      status: searchParams.get("status") || null,
      eventId: searchParams.get("eventId") || null,
      page: parseInt(searchParams.get("page")) || 1,
      limit: parseInt(searchParams.get("limit")) || 10,
    };

    const result = await getBookings(params);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Get bookings error:", error);
    return NextResponse.json(
      { error: error.message || "Gagal mengambil data bookings" },
      { status: 500 }
    );
  }
}
