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

    // Get last 7 days
    const today = new Date();
    const sevenDaysAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

    // Get all bookings for this user
    const bookings = await db.booking.findMany({
      where: {
        userId,
      },
      select: {
        id: true,
      },
    });

    const bookingIds = bookings.map((b) => b.id);

    // Get all scans for these bookings in last 7 days
    const scans = await db.bookingScan.findMany({
      where: {
        bookingId: {
          in: bookingIds,
        },
        createdAt: {
          gte: sevenDaysAgo,
          lte: today,
        },
      },
      select: {
        createdAt: true,
      },
    });

    // Group scans by day of week
    const dayNames = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
    const scansByDay = {
      0: 0, // Sunday
      1: 0, // Monday
      2: 0, // Tuesday
      3: 0, // Wednesday
      4: 0, // Thursday
      5: 0, // Friday
      6: 0, // Saturday
    };

    scans.forEach((scan) => {
      const date = new Date(scan.createdAt);
      const dayOfWeek = date.getDay();
      scansByDay[dayOfWeek] += 1;
    });

    // Format response - last 7 days
    const chartData = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dayOfWeek = date.getDay();
      const dayName = dayNames[dayOfWeek];

      chartData.push({
        day: dayName,
        scans: scansByDay[dayOfWeek],
        visitors: Math.floor(scansByDay[dayOfWeek] * 1.5), // Rough estimate: visitors = scans * 1.5
      });
    }

    // Calculate total scans
    const totalScans = scans.length;

    return Response.json({
      chartData,
      totalScans,
    });
  } catch (error) {
    console.error("Error fetching weekly scan data:", error);
    return Response.json(
      { error: "Failed to fetch scan data" },
      { status: 500 }
    );
  }
}
