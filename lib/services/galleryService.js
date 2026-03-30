import "server-only";
import * as galleryRepository from "@/lib/repositories/galleryRepository";
import { deleteFromStorage, STORAGE_BUCKETS } from "@/lib/storage";

export async function createGalleryTransaction(userId, data) {
  const { bookingId, url } = data;

  if (!bookingId || !url) {
    throw new Error("Data tidak lengkap (Booking ID atau URL hilang).");
  }

  const gallery = await galleryRepository.createGalleryItem({
    bookingId,
    url,
  });

  return gallery;
}

export async function deleteGalleryTransaction(galleryId) {
  const gallery = await galleryRepository.findGalleryById(galleryId);

  if (!gallery) {
    throw new Error("Gambar tidak ditemukan.");
  }

  if (gallery.url) {
    await deleteFromStorage(gallery.url, STORAGE_BUCKETS.BOOKING_GALLERY);
  }

  return await galleryRepository.deleteGalleryItem(galleryId);
}

export async function getGallery(bookingId) {
  return await galleryRepository.findGalleryByBookingId(bookingId);
}
