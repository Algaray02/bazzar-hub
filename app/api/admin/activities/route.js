import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit")) || 5;

    // Fetch recent bookings with user info
    const bookings = await db.booking.findMany({
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        user: {
          select: {
            name: true,
          },
        },
      },
    });

    // Fetch recent users
    const users = await db.user.findMany({
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        name: true,
        role: true,
        createdAt: true,
      },
    });

    // Combine and format activities
    const activities = [];

    bookings.forEach((booking) => {
      let action, type;
      if (booking.isCheckedIn) {
        action = `check-in di event`;
        type = "checkin";
      } else if (booking.status === "PAID") {
        action = `mengupload bukti transfer`;
        type = "payment";
      } else {
        action = `melakukan booking booth`;
        type = "booking";
      }

      activities.push({
        user: booking.user?.name || "Unknown",
        action,
        time: formatTimeAgo(booking.createdAt),
        type,
      });
    });

    users.forEach((user) => {
      activities.push({
        user: user.name,
        action: `mendaftar sebagai ${user.role.toLowerCase()}`,
        time: formatTimeAgo(user.createdAt),
        type: "register",
      });
    });

    // Sort by time and limit
    activities.sort((a, b) => {
      const timeA = extractMinutes(a.time);
      const timeB = extractMinutes(b.time);
      return timeA - timeB;
    });

    const data = activities.slice(0, limit);

    return NextResponse.json({ data });
  } catch (error) {
    console.error("Error fetching activities:", error);
    return NextResponse.json(
      { error: "Gagal mengambil aktivitas" },
      { status: 500 }
    );
  }
}

function formatTimeAgo(date) {
  const now = new Date();
  const diffMs = now - new Date(date);
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Baru saja";
  if (diffMins < 60) return `${diffMins} menit lalu`;
  if (diffHours < 24) return `${diffHours} jam lalu`;
  if (diffDays < 7) return `${diffDays} hari lalu`;
  return new Date(date).toLocaleDateString("id-ID");
}

function extractMinutes(timeStr) {
  const match = timeStr.match(/(\d+)/);
  return match ? parseInt(match[1]) : 0;
}
