"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UpsertEventDialog } from "@/components/shared/dialog/upsert-dialog-event";
import { DeleteEventDialog } from "@/components/shared/dialog/delete-dialog-event";
import {
  useEvents,
  useCreateEvent,
  useUpdateEvent,
  useDeleteEvent,
} from "@/hooks/use-events";
import { uploadEventImageAction } from "@/app/actions/upload-file-actions";
import { AdminEventCard } from "@/components/shared/card/event-card";

const AdminEventsDisplay = ({ initialEvents }) => {
  const [isUpsertOpen, setIsUpsertOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const { data: events } = useEvents({ page: 1, limit: 50 });
  const createMutation = useCreateEvent();
  const updateMutation = useUpdateEvent();
  const deleteMutation = useDeleteEvent();

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  const handleOpenUpsert = (event = null) => {
    setSelectedEvent(event);
    setIsUpsertOpen(true);
  };

  const handleOpenDelete = (event) => {
    setSelectedEvent(event);
    setIsDeleteOpen(true);
  };

  const handleFormSubmit = async (data) => {
    try {
      let imageUrl = data.image;

      if (data.image instanceof File) {
        toast.info("Sedang mengunggah gambar...");
        const formData = new FormData();
        formData.append("file", data.image);
        const result = await uploadEventImageAction(formData);
        imageUrl = result.success ? result.data.url : "";
      }

      const formData = new FormData();
      Object.entries({
        title: data.title,
        description: data.description,
        location: data.location,
        city: data.city,
        date: data.date.toISOString(),
        time: data.time,
        type: data.type,
        image: imageUrl || "",
        organizer: JSON.stringify({ name: data.organizer }),
        highlights: data.highlights?.join(",") || "",
        rundown: JSON.stringify(data.rundown || []),
        faq: JSON.stringify(data.faq || []),
      }).forEach(([key, value]) => formData.append(key, value));

      const mutationOptions = {
        onSuccess: () => setIsUpsertOpen(false),
      };

      if (selectedEvent) {
        updateMutation.mutate(
          { id: selectedEvent.id, formData },
          mutationOptions
        );
      } else {
        createMutation.mutate(formData, mutationOptions);
      }
    } catch (error) {
      toast.error(error.message || "Terjadi kesalahan saat menyimpan");
    }
  };

  const handleDeleteConfirm = () => {
    if (!selectedEvent) return;
    deleteMutation.mutate(selectedEvent.id, {
      onSuccess: () => setIsDeleteOpen(false),
    });
  };

  return (
    <>
      <div className="flex justify-end mb-6">
        <Button
          onClick={() => handleOpenUpsert()}
          className="bg-linear-to-r from-fuchsia-600 to-pink-600 hover:shadow-[0_0_20px_rgba(217,70,239,0.3)] text-white border-none h-12 px-6 rounded-xl"
        >
          <Plus className="w-5 h-5 mr-2" /> Buat Event Baru
        </Button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event, index) => (
          <AdminEventCard
            key={event.id}
            event={event}
            index={index}
            onEdit={handleOpenUpsert}
            onDelete={handleOpenDelete}
          />
        ))}
      </div>

      {events?.data?.length === 0 && (
        <div className="text-center py-20 bg-white/5 rounded-3xl border border-white/10">
          <h3 className="text-xl font-bold text-white mb-2">No events yet</h3>
          <p className="text-zinc-500 mb-4">
            Create your first event to get started
          </p>
          <Button
            onClick={() => handleOpenUpsert()}
            className="bg-linear-to-r from-fuchsia-600 to-pink-600 text-white border-none"
          >
            <Plus className="w-5 h-5 mr-2" /> Create Event
          </Button>
        </div>
      )}

      <UpsertEventDialog
        key={selectedEvent?.id || "create"}
        open={isUpsertOpen}
        onOpenChange={setIsUpsertOpen}
        onSubmit={handleFormSubmit}
        defaultValues={selectedEvent}
        isSubmitting={isSubmitting}
      />

      <DeleteEventDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        onConfirm={handleDeleteConfirm}
        eventTitle={selectedEvent?.title}
        isPending={deleteMutation.isPending}
      />
    </>
  );
};

export default AdminEventsDisplay;
