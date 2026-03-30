import { NextResponse } from "next/server";
import { getGallery } from "@/lib/services/galleryService";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const bookingId = searchParams.get("bookingId");

    if (!bookingId) {
      return NextResponse.json([], { status: 200 });
    }

    const result = await getGallery(bookingId);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Gagal mengambil data gallery" },
      { status: 500 }
    );
  }
}
