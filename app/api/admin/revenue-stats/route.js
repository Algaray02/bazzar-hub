import { db } from "@/lib/db";
import { NextResponse } from "next/server";

function generateDateRange(period) {
  const now = new Date();
  let startDate;

  if (period === "year") {
    startDate = new Date(now.getFullYear(), 0, 1);
  } else {
    startDate = new Date(now.getFullYear(), now.getMonth(), 1);
  }

  return startDate;
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get("period") || "month";
    const startDate = generateDateRange(period);

    // Fetch booking data with booth prices
    const bookings = await db.booking.findMany({
      where: {
        status: "PAID",
        createdAt: {
          gte: startDate,
        },
      },
      select: {
        createdAt: true,
        booth: {
          select: {
            price: true,
          },
        },
      },
    });

    // Group revenue by month/week
    const grouped = {};

    bookings.forEach((booking) => {
      const date = new Date(booking.createdAt);
      let key;

      if (period === "year") {
        key = date.toLocaleString("id-ID", { month: "short" });
      } else {
        key = `${date.getDate()} ${date.toLocaleString("id-ID", { month: "short" })}`;
      }

      const revenue = (booking.booth?.price || 0) / 1000000;
      grouped[key] = (grouped[key] || 0) + revenue;
    });

    // Format data for chart
    const data = Object.entries(grouped).map(([name, revenue]) => ({
      name,
      revenue: parseFloat(revenue.toFixed(1)),
    }));

    return NextResponse.json({ data });
  } catch (error) {
    console.error("Error fetching revenue stats:", error);
    return NextResponse.json(
      { error: "Gagal mengambil statistik revenue" },
      { status: 500 }
    );
  }
}
