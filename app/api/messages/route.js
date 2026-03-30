import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import {
  getAllContactMessages,
  getMessageStats,
} from "@/lib/services/contactService";

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);

    if (searchParams.get("stats") === "true") {
      const stats = await getMessageStats();
      return NextResponse.json(stats);
    }

    const params = {
      status: searchParams.get("status") || null,
      page: parseInt(searchParams.get("page")) || 1,
      limit: parseInt(searchParams.get("limit")) || 10,
      sortBy: searchParams.get("sortBy") || "createdAt",
    };

    const result = await getAllContactMessages(params);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Get messages error:", error);
    return NextResponse.json(
      { error: error.message || "Gagal mengambil data messages" },
      { status: 500 }
    );
  }
}