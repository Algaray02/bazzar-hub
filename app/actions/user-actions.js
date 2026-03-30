"use server";

import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { authOptions } from "@/lib/auth";
import {
  deleteUser,
  updateUser,
  updateProfile,
  createUser,
} from "@/lib/services/userService";
import {
  profileSchema,
  updateUserSchema,
  createUserSchema,
} from "@/lib/validators/user";
import { deleteFromStorage, STORAGE_BUCKETS } from "@/lib/storage";
import { z } from "zod";

function normalizeFormData(data) {
  if (data instanceof FormData) {
    return Object.fromEntries(data.entries());
  }
  return data;
}

export async function updateUserAction(userId, formData) {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "ADMIN") {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const rawData = normalizeFormData(formData);

    const validated = updateUserSchema.parse({
      name: rawData.name,
      email: rawData.email,
      phone: rawData.phone,
      role: rawData.role,
      avatar: rawData.avatar,
    });

    const cleanData = Object.fromEntries(
      Object.entries(validated).filter(
        ([_, v]) => v !== "" && v !== undefined && v !== null
      )
    );

    if (
      rawData.oldAvatar &&
      rawData.avatar &&
      rawData.oldAvatar !== rawData.avatar
    ) {
      await deleteFromStorage(rawData.oldAvatar, STORAGE_BUCKETS.USER_AVATAR);
    }

    await updateUser(userId, cleanData);

    revalidatePath("/admin/users");

    return { success: true, message: "User berhasil diupdate" };
  } catch (error) {
    console.error("Update user error:", error);
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0]?.message };
    }
    return { success: false, error: error.message || "Gagal update user" };
  }
}

export async function createUserAction(formData) {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "ADMIN") {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const rawData = normalizeFormData(formData);

    const validated = createUserSchema.parse({
      name: rawData.name,
      email: rawData.email,
      password: rawData.password,
      phone: rawData.phone,
      role: rawData.role,
      avatar: rawData.avatar,
    });

    const cleanData = Object.fromEntries(
      Object.entries(validated).filter(
        ([_, v]) => v !== "" && v !== undefined && v !== null
      )
    );

    await createUser(cleanData);

    revalidatePath("/admin/users");

    return { success: true, message: "User berhasil dibuat" };
  } catch (error) {
    console.error("Create user error:", error);
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0]?.message };
    }
    if (error.code === "P2002") {
      return { success: false, error: "Email sudah terdaftar" };
    }
    return { success: false, error: error.message || "Gagal membuat user" };
  }
}

export async function updateProfileAction(formData) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const rawData = normalizeFormData(formData);

    const validated = profileSchema.parse({
      name: rawData.name,
      phone: rawData.phone,
      avatar: rawData.avatar,
    });

    const cleanData = Object.fromEntries(
      Object.entries(validated).filter(
        ([_, v]) => v !== "" && v !== null && v !== undefined
      )
    );

    if (
      rawData.oldAvatar &&
      rawData.avatar &&
      rawData.oldAvatar !== rawData.avatar
    ) {
      await deleteFromStorage(rawData.oldAvatar, STORAGE_BUCKETS.USER_AVATAR);
    }

    await updateProfile(session.user.id, cleanData);

    revalidatePath("/seller");

    return { success: true, message: "Profile berhasil diupdate" };
  } catch (error) {
    console.error("Update profile error:", error);
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0]?.message };
    }
    return { success: false, error: error.message || "Gagal update profile" };
  }
}

export async function deleteUserAction(userId) {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "ADMIN") {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const { findUserById } = await import("@/lib/repositories/userRepository");
    const user = await findUserById(userId);

    if (user?.avatar) {
      await deleteFromStorage(user.avatar, STORAGE_BUCKETS.USER_AVATAR);
    }

    await deleteUser(userId);
    revalidatePath("/admin/users");
    return { success: true, message: "User berhasil dihapus" };
  } catch (error) {
    console.error("Delete user error:", error);
    return { success: false, error: error.message || "Gagal menghapus user" };
  }
}