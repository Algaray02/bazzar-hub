import { db } from "@/lib/db";
import { formatRupiahShort } from "@/lib/utils";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const startOfMonth = new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      1
    );

    // Fetch all required stats
    const [totalUsers, activeEvents, totalBookings, bookingsWithBooths] =
      await Promise.all([
        db.user.count(),
        db.event.count({
          where: {
            date: {
              gte: startOfMonth,
            },
          },
        }),
        db.booking.count({
          where: {
            createdAt: {
              gte: startOfMonth,
            },
          },
        }),
        db.booking.findMany({
          where: {
            status: "PAID",
            createdAt: {
              gte: startOfMonth,
            },
          },
          select: {
            booth: {
              select: {
                price: true,
              },
            },
          },
        }),
      ]);

    // Calculate total revenue
    const totalRevenue = bookingsWithBooths.reduce((sum, booking) => {
      return sum + (booking.booth?.price || 0);
    }, 0);

    // Format stats data - icons tidak dikirim, dimap di frontend
    const stats = [
      {
        label: "Total User",
        value: totalUsers.toLocaleString("id-ID"),
        subtext: "Pengguna aktif",
        icon: "Users",
        color: "text-blue-400",
      },
      {
        label: "Event Aktif",
        value: activeEvents.toString(),
        subtext: "Bulan ini",
        icon: "Calendar",
        color: "text-fuchsia-400",
      },
      {
        label: "Total Booking",
        value: totalBookings.toString(),
        subtext: "Bulan ini",
        icon: "CheckSquare",
        color: "text-emerald-400",
      },
      {
        label: "Revenue",
        value: `Rp ${formatRupiahShort(totalRevenue)}`,
        subtext: "Total pendapatan",
        icon: "DollarSign",
        color: "text-amber-400",
      },
    ];

    return NextResponse.json(stats);
  } catch (error) {
    console.error("Error fetching stats:", error);
    return NextResponse.json(
      { error: "Gagal mengambil statistik" },
      { status: 500 }
    );
  }
}
