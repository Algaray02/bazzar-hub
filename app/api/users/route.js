import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getAllUsers } from "@/lib/services/userService";

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const params = {
      role: searchParams.get("role") || null,
      page: parseInt(searchParams.get("page")) || 1,
      limit: parseInt(searchParams.get("limit")) || 10,
    };

    const result = await getAllUsers(params);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Get users error:", error);
    return NextResponse.json(
      { error: error.message || "Gagal mengambil data users" },
      { status: 500 }
    );
  }
}