import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import {
  getAllContactMessages,
  getMessageStats,
  createContactMessage,
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

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;

    // Validasi input
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "Semua field harus diisi" },
        { status: 400 }
      );
    }

    // Validasi email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Format email tidak valid" },
        { status: 400 }
      );
    }

    // Validasi panjang (trim dan cek)
    if (name.trim().length < 3) {
      return NextResponse.json(
        { error: "Nama harus minimal 3 karakter" },
        { status: 400 }
      );
    }

    if (message.trim().length < 10) {
      return NextResponse.json(
        { error: "Pesan harus minimal 10 karakter" },
        { status: 400 }
      );
    }

    // Simpan ke database
    const result = await createContactMessage({
      name: name.trim(),
      email: email.trim(),
      subject: subject.trim(),
      message: message.trim(),
    });

    return NextResponse.json(
      {
        success: true,
        message: "Pesan berhasil dikirim! Tim kami akan segera menghubungi Anda.",
        data: result,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Send message error:", error);
    return NextResponse.json(
      { error: error.message || "Gagal mengirim pesan" },
      { status: 500 }
    );
  }
}