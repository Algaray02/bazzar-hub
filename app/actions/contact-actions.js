"use server";

import {
  createContactMessage,
  updateMessageStatus,
  deleteContactMessage,
} from "@/lib/services/contactService";
import { revalidatePath } from "next/cache";
import { authOptions } from "@/lib/auth";
import { contactFormSchema } from "@/lib/validators/contact";
import { z } from "zod";
import { getServerSession } from "next-auth";

export async function createContactAction(formData) {
  try {
    const rawData = Object.fromEntries(formData.entries());
    const validated = contactFormSchema.parse(rawData);

    await createContactMessage(validated);

    revalidatePath("/contact");
    revalidatePath("/admin/messages");

    return {
      success: true,
      message: "Pesan berhasil dikirim! Admin akan meresponnya segera.",
    };
  } catch (error) {
    console.error("Create contact message error:", error);
    return {
      success: false,
      error:
        error instanceof z.ZodError
          ? error.errors[0]?.message
          : error.message || "Gagal mengirim pesan",
    };
  }
}

export async function updateMessageStatusAction(messageId, status) {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "ADMIN") {
    return {
      success: false,
      error: "Unauthorized",
    };
  }

  try {
    await updateMessageStatus(messageId, status);

    revalidatePath("/admin/messages");

    return {
      success: true,
      message: `Pesan berhasil diperbarui ke status ${status}`,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message || "Gagal update status pesan",
    };
  }
}

export async function deleteContactAction(messageId) {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "ADMIN") {
    return {
      success: false,
      error: "Unauthorized",
    };
  }

  try {
    await deleteContactMessage(messageId);

    revalidatePath("/admin/messages");

    return {
      success: true,
      message: "Pesan berhasil dihapus",
    };
  } catch (error) {
    return {
      success: false,
      error: error.message || "Gagal menghapus pesan",
    };
  }
}