import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteGalleryAction } from "@/app/actions/gallery-actions";
import { uploadGalleryImageAction } from "@/app/actions/upload-file-actions";
import { toast } from "sonner";

export const useGallery = (bookingId) => {
  return useQuery({
    queryKey: ["gallery", bookingId],
    queryFn: async () => {
      if (!bookingId) return [];
      const response = await fetch(`/api/galleries?bookingId=${bookingId}`);
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Gagal mengambil data gallery");
      }
      return await response.json();
    },
    enabled: !!bookingId,
  });
};

export const useUploadGallery = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData) => {
      const result = await uploadGalleryImageAction(formData);
      if (!result.success) throw new Error(result.error);
      return result;
    },
    onSuccess: (_, variables) => {
      const bookingId = variables.get("bookingId");
      queryClient.invalidateQueries({ queryKey: ["gallery", bookingId] });
    },
    onError: (error) => {
      console.error("Upload error:", error);
    },
  });
};

export const useDeleteGallery = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ galleryId, imageUrl, bookingId }) => {
      const result = await deleteGalleryAction(galleryId, imageUrl);
      if (!result.success) throw new Error(result.error);
      return { ...result, bookingId };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["gallery", data.bookingId] });
      toast.success("Gambar berhasil dihapus");
    },
    onError: (error) => {
      toast.error(error.message || "Gagal menghapus gambar");
    },
  });
};
