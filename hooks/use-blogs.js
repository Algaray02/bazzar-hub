import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  upsertPostAction,
  deletePostAction,
  publishPostAction,
} from "@/app/actions/blog-actions";
import { toast } from "sonner";

import { BLOG_KEYS, BLOG_KEYS_DETAIL } from "@/lib/utils/query-keys";

export const useBlogs = (params = {}, options = {}) => {
  return useQuery({
    queryKey: BLOG_KEYS.lists(params),
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      if (params.publishedOnly !== undefined)
        searchParams.set("publishedOnly", params.publishedOnly);
      if (params.category) searchParams.set("category", params.category);
      if (params.page) searchParams.set("page", params.page);
      if (params.limit) searchParams.set("limit", params.limit);

      const response = await fetch(`/api/blogs?${searchParams.toString()}`);
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Gagal mengambil data blogs");
      }
      const result = await response.json();
      return result;
    },
    ...options,
  });
};

export const useBlog = (slug, options = {}) => {
  return useQuery({
    queryKey: BLOG_KEYS_DETAIL(slug),
    queryFn: async () => {
      const response = await fetch(`/api/blogs/${slug}`);
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Gagal mengambil data blog");
      }
      return await response.json();
    },
    enabled: !!slug,
    ...options,
  });
};

export const useUpsertBlog = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData) => {
      const result = await upsertPostAction(formData);
      if (!result.success) throw new Error(result.error);
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BLOG_KEYS.all });
      toast.success("Blog berhasil disimpan");
    },
    onError: (error) => {
      toast.error(error.message || "Gagal menyimpan blog");
    },
  });
};

export const useDeleteBlog = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      const result = await deletePostAction(id);
      if (!result.success) throw new Error(result.error);
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BLOG_KEYS.all });
      toast.success("Blog berhasil dihapus");
    },
    onError: (error) => {
      toast.error(error.message || "Gagal menghapus blog");
    },
  });
};

export const usePublishBlog = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, published }) => {
      const result = await publishPostAction(id, published);
      if (!result.success) throw new Error(result.error);
      return result;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: BLOG_KEYS.all });
      toast.success(
        variables.published
          ? "Blog berhasil dipublish"
          : "Blog berhasil di-unpublish"
      );
    },
    onError: (error) => {
      toast.error(error.message || "Gagal update status blog");
    },
  });
};
