import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const bookingId = searchParams.get("bookingId");
    const page = Number.parseInt(searchParams.get("page")) || 1;
    const limit = Number.parseInt(searchParams.get("limit")) || 50;

    const where = {};
    if (bookingId) {
      where.bookingId = bookingId;
    }

    const [reviews, total] = await Promise.all([
      db.review.findMany({
        where,
        include: {
          booking: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      db.review.count({ where }),
    ]);

    return NextResponse.json({
      data: reviews,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Get reviews error:", error);
    return NextResponse.json(
      { error: error.message || "Gagal mengambil data reviews" },
      { status: 500 }
    );
  }
}