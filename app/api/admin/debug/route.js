import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    // Test each query individually
    const users = await db.user.count();
    const events = await db.event.count();
    const bookings = await db.booking.count();
    
    const paidBookings = await db.booking.findMany({
      where: {
        status: "PAID",
      },
      include: {
        booth: true,
      },
    });

    const debug = {
      users,
      events,
      bookings,
      paidBookings: paidBookings.map((b) => ({
        id: b.id,
        status: b.status,
        boothPrice: b.booth?.price,
      })),
      totalPaidBookings: paidBookings.length,
      totalRevenue: paidBookings.reduce((sum, b) => sum + (b.booth?.price || 0), 0),
    };

    return NextResponse.json(debug);
  } catch (error) {
    console.error("Debug error:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
