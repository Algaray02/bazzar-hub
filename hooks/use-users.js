import {
  createUserAction,
  deleteUserAction,
  updateUserAction,
} from "@/app/actions/user-actions";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { USER_KEYS } from "@/lib/utils/query-keys";

export const useUsers = (params = {}, options = {}) => {
  return useQuery({
    queryKey: USER_KEYS.lists(params),
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      if (params.role) searchParams.set("role", params.role);
      if (params.page) searchParams.set("page", params.page);
      if (params.limit) searchParams.set("limit", params.limit);

      const response = await fetch(`/api/users?${searchParams.toString()}`);
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Gagal mengambil data users");
      }
      const result = await response.json();
      return result;
    },
    ...options,
  });
};

export const useUser = (userId, options = {}) => {
  return useQuery({
    queryKey: USER_KEYS.detail(userId),
    queryFn: async () => {
      const response = await fetch(`/api/users/${userId}`);
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Gagal mengambil data user");
      }
      return await response.json();
    },
    enabled: !!userId,
    ...options,
  });
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData) => {
      const result = await createUserAction(formData);
      if (!result.success) throw new Error(result.error);
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USER_KEYS.all });
      toast.success("User berhasil dibuat");
    },
    onError: (error) => {
      toast.error(error.message || "Gagal membuat user");
    },
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, formData }) => {
      const result = await updateUserAction(userId, formData);
      if (!result.success) throw new Error(result.error);
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USER_KEYS.all });
      toast.success("User berhasil diupdate");
    },
    onError: (error) => {
      toast.error(error.message || "Gagal update user");
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId) => {
      const result = await deleteUserAction(userId);
      if (!result.success) throw new Error(result.error);
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USER_KEYS.all });
      toast.success("User berhasil dihapus");
    },
    onError: (error) => {
      toast.error(error.message || "Gagal menghapus user");
    },
  });
};
