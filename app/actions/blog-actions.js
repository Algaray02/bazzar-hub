"use server";

import {
  createPost,
  updatePost,
  deletePost,
  getPostById,
} from "@/lib/services/blogService";
import { generateStoreDescription } from "@/lib/services/aiService";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { upsertBlogSchema } from "@/lib/validators/blog";
import { deleteFromStorage, STORAGE_BUCKETS } from "@/lib/storage";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function upsertPostAction(formData) {

  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "ADMIN") {
    return {
      success: false,
      error: "Hanya admin yang dapat mengelola posts",
    };
  }

  try {
    const rawData = Object.fromEntries(formData.entries());
    const validated = upsertBlogSchema.parse({
      ...rawData,
      published: rawData.published === "true" || rawData.published === "on",
    });

    const postId = validated.id;
    delete validated.id;

    const postData = {
      ...validated,
      author: session.user.name || "Admin",
      avatar: session.user.image || null,
    };

    let result;
    if (postId) {
      if (
        rawData.oldImage &&
        validated.image &&
        rawData.oldImage !== validated.image
      ) {
        await deleteFromStorage(rawData.oldImage, STORAGE_BUCKETS.POST_IMAGE);
      }
      result = await updatePost(postId, postData);
    } else {
      result = await createPost(postData);
    }

    revalidatePath("/blog");
    revalidatePath("/admin/blogs");

    return {
      success: true,
      message: postId ? "Post berhasil diperbarui" : "Post berhasil dibuat",
      postId: result.id,
    };
  } catch (error) {
    console.error("Upsert post error:", error);
    return {
      success: false,
      error:
        error instanceof z.ZodError ? error.errors[0]?.message : error.message,
    };
  }
}

export async function deletePostAction(id) {

  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "ADMIN") {
    return {
      success: false,
      error: "Hanya admin yang dapat menghapus posts",
    };
  }

  try {
    const post = await getPostById(id);
    if (post?.image) {
      await deleteFromStorage(post.image, STORAGE_BUCKETS.POST_IMAGE);
    }

    await deletePost(id);

    revalidatePath("/blog");
    revalidatePath("/admin/blogs");

    return {
      success: true,
      message: "Post berhasil dihapus",
    };
  } catch (error) {
    return {
      success: false,
      error: error.message || "Gagal menghapus postingan",
    };
  }
}

export async function generateStoreDescriptionAction(storeName, category) {
  try {
    const description = await generateStoreDescription(storeName, category);
    return {
      success: true,
      description,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
}

export async function publishPostAction(id, published) {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "ADMIN") {
    return {
      success: false,
      error: "Hanya admin yang dapat manage status post",
    };
  }

  try {
    await updatePost(id, { published });

    revalidatePath("/blog");
    revalidatePath("/admin/blogs");

    return {
      success: true,
      message: `Post berhasil di-${published ? "publish" : "unpublish"}`,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
}