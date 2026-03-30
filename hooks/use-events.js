import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createEventAction,
  updateEventAction,
  deleteEventAction,
} from "@/app/actions/event-actions";
import { toast } from "sonner";
import { EVENT_KEYS } from "@/lib/utils/query-keys";

export const useEvents = (params = {}, initialData) => {
  return useQuery({
    queryKey: EVENT_KEYS.lists(params),
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      if (params.page) searchParams.set("page", params.page);
      if (params.limit) searchParams.set("limit", params.limit);
      if (params.type) searchParams.set("type", params.type);

      const response = await fetch(`/api/events?${searchParams.toString()}`);
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Gagal mengambil data events");
      }
      const result = await response.json();
      return result.data;
    },
    initialData: initialData,
  });
};

export const useEvent = (eventId, options = {}) => {
  return useQuery({
    queryKey: EVENT_KEYS.detail(eventId),
    queryFn: async () => {
      const response = await fetch(`/api/events/${eventId}`);
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Gagal mengambil data event");
      }
      return await response.json();
    },
    enabled: !!eventId,
    ...options,
  });
};

export const useCreateEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData) => {
      const result = await createEventAction(formData);
      if (!result.success) throw new Error(result.error);
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: EVENT_KEYS.all });
      toast.success("Event berhasil dibuat!");
    },
    onError: (error) => {
      toast.error(error.message || "Gagal membuat event");
    },
  });
};

export const useUpdateEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, formData }) => {
      const result = await updateEventAction(id, formData);
      if (!result.success) throw new Error(result.error);
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: EVENT_KEYS.all });
      toast.success("Event berhasil diupdate!");
    },
    onError: (error) => {
      toast.error(error.message || "Gagal update event");
    },
  });
};

export const useDeleteEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      const result = await deleteEventAction(id);
      if (!result.success) throw new Error(result.error);
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: EVENT_KEYS.all });
      toast.success("Event berhasil dihapus!");
    },
    onError: (error) => {
      toast.error(error.message || "Gagal menghapus event");
    },
  });
};