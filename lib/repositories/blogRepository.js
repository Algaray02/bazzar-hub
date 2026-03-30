import "server-only";
import { db } from "@/lib/db";
import { POST_SELECT } from "@/lib/prisma/select-config";

export async function createPost(data) {
  return await db.post.create({
    data,
    select: POST_SELECT,
  });
}

export async function findManyPosts(options = {}) {
  const {
    publishedOnly = true,
    category = null,
    page = 1,
    limit = 10,
  } = options;
  const skip = (page - 1) * limit;

  const where = {};
  if (publishedOnly) where.published = true;
  if (category) where.category = category;

  const [posts, total] = await db.$transaction([
    db.post.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: limit,
      skip,
      select: POST_SELECT,
    }),
    db.post.count({ where }),
  ]);

  return {
    data: posts,
    metadata: {
      total,
      page,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function findPostBySlug(slug) {
  return await db.post.findUnique({
    where: { slug },
    select: POST_SELECT,
  });
}

export async function findPostById(id) {
  return await db.post.findUnique({
    where: { id },
    select: POST_SELECT,
  });
}

export async function updatePost(id, data) {
  return await db.post.update({
    where: { id },
    data: {
      ...data,
      updatedAt: new Date(),
    },
    select: POST_SELECT,
  });
}

export async function deletePost(id) {
  return await db.post.delete({
    where: { id },
    select: POST_SELECT,
  });
}

export async function findRelatedPosts(category, limit = 5) {
  return await db.post.findMany({
    where: {
      category,
      published: true,
    },
    orderBy: { createdAt: "desc" },
    take: limit,
    select: POST_SELECT,
  });
}