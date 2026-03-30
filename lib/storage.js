import { supabase } from "@/lib/supabase";

export const STORAGE_BUCKETS = {
  USER_AVATAR: "avatar-user",
  POST_IMAGE: "image-post",
  POST_AVATAR: "avatar-post",
  EVENT_IMAGE: "image-event",
  BOOKING_PAYMENT_PROOF: "payment-proof-booking",
  BOOKING_LOGO: "logo-booking",
  BOOKING_BANNER: "banner-booking",
  BOOKING_GALLERY: "gallery-booking",
};

export async function uploadToStorage(file, bucket, folder = "") {
  try {
    if (!file || !(file instanceof File)) {
      return { success: false, error: "No file provided" };
    }

    const maxSize = 2 * 1024 * 1024;
    if (file.size > maxSize) {
      return { success: false, error: "File terlalu besar. Maksimal 2MB" };
    }

    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      return {
        success: false,
        error: "Format file tidak didukung. Gunakan JPG, PNG, atau WebP",
      };
    }

    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random()
      .toString(36)
      .substring(2)}.${fileExt}`;
    const filePath = folder ? `${folder}/${fileName}` : fileName;

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (error) {
      console.error("Supabase upload error:", error);
      return { success: false, error: error.message };
    }

    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);

    return {
      success: true,
      url: urlData.publicUrl,
      path: filePath,
    };
  } catch (error) {
    console.error("Upload error:", error);
    return { success: false, error: error.message || "Gagal upload file" };
  }
}

export async function deleteFromStorage(fileUrl, bucket) {
  try {
    if (!fileUrl) {
      return { success: true }; 
    }

    const url = new URL(fileUrl);
    const pathParts = url.pathname.split(
      `/storage/v1/object/public/${bucket}/`
    );

    if (pathParts.length < 2) {

      const altParts = url.pathname.split(`/${bucket}/`);
      if (altParts.length < 2) {
        console.warn("Could not extract file path from URL:", fileUrl);
        return { success: true }; 
      }
      const filePath = decodeURIComponent(altParts[1]);
      const { error } = await supabase.storage.from(bucket).remove([filePath]);
      if (error) {
        console.error("Supabase delete error:", error);
        return { success: false, error: error.message };
      }
      return { success: true };
    }

    const filePath = decodeURIComponent(pathParts[1]);

    const { error } = await supabase.storage.from(bucket).remove([filePath]);

    if (error) {
      console.error("Supabase delete error:", error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error("Delete error:", error);
    return { success: false, error: error.message || "Gagal hapus file" };
  }
}