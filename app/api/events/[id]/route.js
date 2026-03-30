import { NextResponse } from "next/server";
import { getEventById } from "@/lib/services/eventService";

export async function GET(request, ctx) {
  try {
    const params = await ctx.params;
    const { id } = params;

    const eventId = id;

    const event = await getEventById(eventId);

    if (!event) {
      return NextResponse.json(
        { error: "Event tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json(event);
  } catch (error) {
    console.error("Get event error:", error);
    return NextResponse.json(
      { error: error.message || "Gagal mengambil data event" },
      { status: 500 }
    );
  }
}