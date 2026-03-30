"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import {
  uploadToStorage,
  deleteFromStorage,
  STORAGE_BUCKETS,
} from "@/lib/storage";

const BUCKET_TYPES = {
  USER_AVATAR: STORAGE_BUCKETS.USER_AVATAR,
  POST_IMAGE: STORAGE_BUCKETS.POST_IMAGE,
  POST_AVATAR: STORAGE_BUCKETS.POST_AVATAR,
  EVENT_IMAGE: STORAGE_BUCKETS.EVENT_IMAGE,
  BOOKING_PAYMENT_PROOF: STORAGE_BUCKETS.BOOKING_PAYMENT_PROOF,
  BOOKING_LOGO: STORAGE_BUCKETS.BOOKING_LOGO,
  BOOKING_BANNER: STORAGE_BUCKETS.BOOKING_BANNER,
  BOOKING_GALLERY: STORAGE_BUCKETS.BOOKING_GALLERY,
};

export async function uploadFileAction(formData) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const file = formData.get("file");
    const bucketType = formData.get("bucketType");
    const folder = formData.get("folder") || "";

    if (!file || !(file instanceof File)) {
      return { success: false, error: "No file provided" };
    }

    if (!bucketType || !BUCKET_TYPES[bucketType]) {
      return { success: false, error: "Invalid bucket type" };
    }

    const bucket = BUCKET_TYPES[bucketType];

    if (bucketType.startsWith("BOOKING_")) {
      const bookingUserId = formData.get("userId");
      if (session.user.role !== "ADMIN" && session.user.id !== bookingUserId) {
        return { success: false, error: "Unauthorized" };
      }
    }

    if (bucketType.startsWith("POST_") || bucketType === "EVENT_IMAGE") {
      if (session.user.role !== "ADMIN") {
        return { success: false, error: "Unauthorized - Admin only" };
      }
    }

    const result = await uploadToStorage(file, bucket, folder);
    return result;
  } catch (error) {
    console.error("Upload file error:", error);
    return { success: false, error: error.message || "Gagal upload file" };
  }
}

export async function deleteFileAction(fileUrl, bucketType) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    if (!bucketType || !BUCKET_TYPES[bucketType]) {
      return { success: false, error: "Invalid bucket type" };
    }

    const bucket = BUCKET_TYPES[bucketType];

    if (bucketType.startsWith("POST_") || bucketType === "EVENT_IMAGE") {
      if (session.user.role !== "ADMIN") {
        return { success: false, error: "Unauthorized - Admin only" };
      }
    }

    const result = await deleteFromStorage(fileUrl, bucket);
    return result;
  } catch (error) {
    console.error("Delete file error:", error);
    return { success: false, error: error.message || "Gagal hapus file" };
  }
}

export async function uploadAvatarAction(formData) {
  const newFormData = new FormData();
  newFormData.set("file", formData.get("file"));
  newFormData.set("bucketType", "USER_AVATAR");
  newFormData.set("folder", `user-${formData.get("userId") || "unknown"}`);
  return uploadFileAction(newFormData);
}

export async function deleteAvatarAction(avatarUrl) {
  return deleteFileAction(avatarUrl, "USER_AVATAR");
}

export async function uploadEventImageAction(formData) {
  const newFormData = new FormData();
  newFormData.set("file", formData.get("file"));
  newFormData.set("bucketType", "EVENT_IMAGE");
  newFormData.set("folder", "events");
  return uploadFileAction(newFormData);
}

export async function deleteEventImageAction(imageUrl) {
  return deleteFileAction(imageUrl, "EVENT_IMAGE");
}

export async function uploadPostImageAction(formData) {
  const newFormData = new FormData();
  newFormData.set("file", formData.get("file"));
  newFormData.set("bucketType", "POST_IMAGE");
  newFormData.set("folder", "posts");
  return uploadFileAction(newFormData);
}

export async function deletePostImageAction(imageUrl) {
  return deleteFileAction(imageUrl, "POST_IMAGE");
}

export async function uploadPostAvatarAction(formData) {
  const newFormData = new FormData();
  newFormData.set("file", formData.get("file"));
  newFormData.set("bucketType", "POST_AVATAR");
  newFormData.set("folder", "authors");
  return uploadFileAction(newFormData);
}

export async function deletePostAvatarAction(avatarUrl) {
  return deleteFileAction(avatarUrl, "POST_AVATAR");
}

export async function uploadBookingLogoAction(formData) {
  const newFormData = new FormData();
  newFormData.set("file", formData.get("file"));
  newFormData.set("bucketType", "BOOKING_LOGO");
  newFormData.set("folder", "logos");
  newFormData.set("userId", formData.get("userId"));
  return uploadFileAction(newFormData);
}

export async function deleteBookingLogoAction(logoUrl) {
  return deleteFileAction(logoUrl, "BOOKING_LOGO");
}

export async function uploadBookingBannerAction(formData) {
  const newFormData = new FormData();
  newFormData.set("file", formData.get("file"));
  newFormData.set("bucketType", "BOOKING_BANNER");
  newFormData.set("folder", "banners");
  newFormData.set("userId", formData.get("userId"));
  return uploadFileAction(newFormData);
}

export async function deleteBookingBannerAction(bannerUrl) {
  return deleteFileAction(bannerUrl, "BOOKING_BANNER");
}

export async function uploadPaymentProofAction(formData) {
  const newFormData = new FormData();
  newFormData.set("file", formData.get("file"));
  newFormData.set("bucketType", "BOOKING_PAYMENT_PROOF");
  newFormData.set("folder", "proofs");
  newFormData.set("userId", formData.get("userId"));
  return uploadFileAction(newFormData);
}

export async function deletePaymentProofAction(proofUrl) {
  return deleteFileAction(proofUrl, "BOOKING_PAYMENT_PROOF");
}

export async function uploadGalleryImageAction(formData) {
  const newFormData = new FormData();
  newFormData.set("file", formData.get("file"));
  newFormData.set("bucketType", "BOOKING_GALLERY");
  newFormData.set("folder", "gallery");
  newFormData.set("userId", formData.get("userId"));
  return uploadFileAction(newFormData);
}

export async function deleteGalleryImageAction(imageUrl) {
  return deleteFileAction(imageUrl, "BOOKING_GALLERY");
}
