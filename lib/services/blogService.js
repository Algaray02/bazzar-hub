import "server-only";
import * as blogRepository from "@/lib/repositories/blogRepository";

function generateSlug(title) {
  const baseSlug = title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "") 
    .trim()
    .replace(/\s+/g, "-"); 

  return `${baseSlug}-${Date.now().toString().slice(-6)}`;
}

export async function createPost(data) {
  const slug = generateSlug(data.title);

  return await blogRepository.createPost({
    title: data.title,
    slug,
    content: data.content,
    category: data.category || "NEWS",
    image: data.image || null,
    published: data.published ?? true,
    author: data.author || "Admin",
    avatar: data.avatar || null,
    excerpt: data.excerpt || data.content.substring(0, 150) + "...",
  });
}

export async function getAllPosts(options = {}) {
  return await blogRepository.findManyPosts(options);
}

export async function getPostBySlug(slug) {
  return await blogRepository.findPostBySlug(slug);
}

export async function getPostById(id) {
  return await blogRepository.findPostById(id);
}

export async function updatePost(id, data) {
  return await blogRepository.updatePost(id, {
    title: data.title,
    content: data.content,
    category: data.category,
    image: data.image,
    published: data.published,
    excerpt: data.excerpt || data.content?.substring(0, 150) + "...",
  });
}

export async function deletePost(id) {
  return await blogRepository.deletePost(id);
}

export async function getRelatedPosts(category, limit = 5) {
  return await blogRepository.findRelatedPosts(category, limit);
}

export async function publishPost(id) {
  return await blogRepository.updatePost(id, {
    published: true,
  });
}

export async function unpublishPost(id) {
  return await blogRepository.updatePost(id, {
    published: false,
  });
}