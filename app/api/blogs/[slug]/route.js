import { NextResponse } from "next/server";
import { getPostBySlug } from "@/lib/services/blogService";

export async function GET(request, { params }) {
  try {
    const { slug } = params;
    const post = await getPostBySlug(slug);

    if (!post) {
      return NextResponse.json(
        { error: "Post tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error("Get blog error:", error);
    return NextResponse.json(
      { error: error.message || "Gagal mengambil data blog" },
      { status: 500 }
    );
  }
}