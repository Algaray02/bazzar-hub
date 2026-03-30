import { db } from "@/lib/db";

export async function GET(request) {
  try {
    const userId = request.nextUrl.searchParams.get("userId");

    if (!userId) {
      return Response.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // Get all PAID bookings for this user
    const paidBookings = await db.booking.findMany({
      where: {
        userId,
        status: "PAID",
      },
      include: {
        booth: {
          select: {
            price: true,
          },
        },
      },
    });

    // Group by month and calculate total expense
    const monthlyExpense = {};
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "Mei",
      "Jun",
      "Jul",
      "Agu",
      "Sep",
      "Okt",
      "Nov",
      "Des",
    ];

    paidBookings.forEach((booking) => {
      const date = new Date(booking.createdAt);
      const monthIndex = date.getMonth();
      const monthKey = monthNames[monthIndex];

      if (!monthlyExpense[monthKey]) {
        monthlyExpense[monthKey] = 0;
      }

      if (booking.booth?.price) {
        // Convert to juta (millions)
        monthlyExpense[monthKey] += booking.booth.price / 1000000;
      }
    });

    // Format response
    const chartData = monthNames.map((month) => ({
      month,
      expense: monthlyExpense[month] ? parseFloat(monthlyExpense[month].toFixed(2)) : 0,
    }));

    return Response.json({ chartData });
  } catch (error) {
    console.error("Error fetching monthly expense:", error);
    return Response.json(
      { error: "Failed to fetch expense data" },
      { status: 500 }
    );
  }
}
