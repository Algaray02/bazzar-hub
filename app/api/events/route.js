import { NextResponse } from "next/server";
import { getAllEvents } from "@/lib/services/eventService";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const params = {
      page: parseInt(searchParams.get("page")) || 1,
      limit: parseInt(searchParams.get("limit")) || 10,
      type: searchParams.get("type") || null,
    };

    const result = await getAllEvents(params);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Get events error:", error);
    return NextResponse.json(
      { error: error.message || "Gagal mengambil data events" },
      { status: 500 }
    );
  }
}