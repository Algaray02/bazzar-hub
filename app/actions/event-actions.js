"use server";

import { revalidatePath } from "next/cache";
import { eventSchema } from "@/lib/validators/event";
import {
  createEvent,
  updateEvent,
  deleteEvent,
} from "@/lib/services/eventService";
import {
  parseFormDataWithJson,
  parseOrganizer,
  parseHighlights,
  safeJsonParse
} from "@/lib/utils/form-data";

export async function createEventAction(formData) {
  try {
    const rawData = parseFormDataWithJson(formData);

    const validated = eventSchema.parse(rawData);

    const eventPayload = {
      title: validated.title,
      description: validated.description,
      location: validated.location,
      city: validated.city,
      date: validated.date,
      time: validated.time,
      type: validated.type,
      image: validated.image || null,
      organizer: parseOrganizer(validated.organizer),
      highlights: parseHighlights(validated.highlights),
      rundown: validated.rundown || [],
      faq: validated.faq || [],
    };

    const newEvent = await createEvent(eventPayload);
    revalidatePath("/admin/events");
    revalidatePath("/events");
    revalidatePath("/");

    return {
      success: true,
      message: "Event berhasil dibuat",
      data: newEvent,
    };
  } catch (error) {
    console.error("Create event error:", error);
    return { success: false, error: error.message };
  }
}

export async function updateEventAction(eventId, formData) {
  try {
    const rawData = parseFormDataWithJson(formData);

    const validated = eventSchema.parse(rawData);

    const updatePayload = {
      title: validated.title,
      description: validated.description,
      location: validated.location,
      city: validated.city,
      date: validated.date,
      time: validated.time,
      type: validated.type,
      image: validated.image || null,
      organizer: parseOrganizer(validated.organizer),
      highlights: parseHighlights(validated.highlights),
      rundown: validated.rundown || [],
      faq: validated.faq || [],
    };

    const updatedEvent = await updateEvent(eventId, updatePayload);
    revalidatePath("/admin/events");
    revalidatePath(`/admin/events/${eventId}`);
    revalidatePath("/events");
    revalidatePath(`/event/${eventId}`);
    revalidatePath("/");

    return {
      success: true,
      message: "Event berhasil diupdate",
      data: updatedEvent,
    };
  } catch (error) {
    console.error("Update event error:", error);
    return { success: false, error: error.message };
  }
}

export async function deleteEventAction(eventId) {
  try {
    await deleteEvent(eventId);
    revalidatePath("/admin/events");
    revalidatePath("/events");
    revalidatePath("/");

    return { success: true, message: "Event berhasil dihapus" };
  } catch (error) {
    console.error("Delete event error:", error);
    return { success: false, error: error.message };
  }
}