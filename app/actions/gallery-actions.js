"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import {
  createGalleryTransaction,
  deleteGalleryTransaction,
} from "@/lib/services/galleryService";

export async function createGalleryAction(data) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return { success: false, error: "Anda harus login terlebih dahulu" };
  }

  try {
    await createGalleryTransaction(session.user.id, {
      bookingId: data.bookingId,
      url: data.url,
    });

    revalidatePath("/seller/dashboard");
    return { success: true, message: "Foto berhasil ditambahkan ke galeri" };
  } catch (error) {
    console.error("Create gallery error:", error);
    return { success: false, error: error.message || "Gagal menyimpan foto" };
  }
}

export async function deleteGalleryAction(galleryId) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    await deleteGalleryTransaction(galleryId);
    revalidatePath("/seller/dashboard");
    return { success: true, message: "Foto berhasil dihapus" };
  } catch (error) {
    return { success: false, error: error.message || "Gagal menghapus foto" };
  }
}
