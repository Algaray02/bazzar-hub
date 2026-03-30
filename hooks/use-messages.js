import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  updateMessageStatusAction,
  deleteContactAction,
} from "@/app/actions/contact-actions";
import { toast } from "sonner";
import { MESSAGE_KEYS } from "@/lib/utils/query-keys";

export const useMessages = (params = {}, options = {}) => {
  return useQuery({
    queryKey: MESSAGE_KEYS.lists(params),
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      if (params.status) searchParams.set("status", params.status);
      if (params.page) searchParams.set("page", params.page);
      if (params.limit) searchParams.set("limit", params.limit);
      if (params.sortBy) searchParams.set("sortBy", params.sortBy);

      const response = await fetch(`/api/messages?${searchParams.toString()}`);
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Gagal mengambil data messages");
      }
      const result = await response.json();
      return result;
    },
    ...options,
  });
};

export const useMessageStats = (options = {}) => {
  return useQuery({
    queryKey: MESSAGE_KEYS.stats,
    queryFn: async () => {
      const response = await fetch(`/api/messages?stats=true`);
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Gagal mengambil stats");
      }
      return await response.json();
    },
    ...options,
  });
};

export const useUpdateMessageStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ messageId, status }) => {
      const result = await updateMessageStatusAction(messageId, status);
      if (!result.success) throw new Error(result.error);
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MESSAGE_KEYS.all });
    },
    onError: (error) => {
      toast.error(error.message || "Gagal update status");
    },
  });
};

export const useDeleteMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (messageId) => {
      const result = await deleteContactAction(messageId);
      if (!result.success) throw new Error(result.error);
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MESSAGE_KEYS.all });
      toast.success("Pesan berhasil dihapus");
    },
    onError: (error) => {
      toast.error(error.message || "Gagal menghapus pesan");
    },
  });
};