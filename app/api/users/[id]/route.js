import { NextResponse } from "next/server";
import { getUserProfile } from "@/lib/services/userService";

export async function GET(request, ctx) {
  try {
    const params = await ctx.params;
    const { id } = params;

    const userId = id;

    const user = await getUserProfile(userId);

    if (!user) {
      return NextResponse.json(
        { error: "User tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("Get user error:", error);
    return NextResponse.json(
      { error: error.message || "Gagal mengambil data user" },
      { status: 500 }
    );
  }
}
