import "server-only";
import { db } from "@/lib/db";

export async function createGalleryItem(data) {
  return await db.gallery.create({
    data,
  });
}

export async function deleteGalleryItem(id) {
  return await db.gallery.delete({
    where: { id },
  });
}

export async function findGalleryByBookingId(bookingId) {
  return await db.gallery.findMany({
    where: { bookingId },
    orderBy: { createdAt: "desc" },
  });
}

export async function findGalleryById(id) {
  return await db.gallery.findUnique({
    where: { id },
  });
}
