import { NextResponse } from "next/server";
import { getAllPosts } from "@/lib/services/blogService";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const params = {
      publishedOnly: searchParams.get("publishedOnly") !== "false",
      category: searchParams.get("category") || null,
      page: parseInt(searchParams.get("page")) || 1,
      limit: parseInt(searchParams.get("limit")) || 10,
    };

    const result = await getAllPosts(params);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Get blogs error:", error);
    return NextResponse.json(
      { error: error.message || "Gagal mengambil data blogs" },
      { status: 500 }
    );
  }
}