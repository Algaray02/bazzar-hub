"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { toast } from "sonner";

export async function createEventWithDetailsAction(payload) {
  try {
    // Validate required fields
    if (!payload.title || !payload.location || !payload.date || !payload.time) {
      return {
        success: false,
        error: "Field wajib: title, location, date, time",
      };
    }

    // Create event in database
    const event = await db.event.create({
      data: {
        title: payload.title,
        description: payload.description || "",
        location: payload.location,
        city: payload.city || "",
        date: new Date(payload.date),
        time: payload.time,
        type: payload.category || "WEEKLY",
        organizer: payload.organizer || null,
        image: payload.image || null,
        highlights: payload.highlights || [],
        rundown: payload.rundown || [],
        faq: payload.faq || [],
      },
    });

    revalidatePath("/admin");
    return {
      success: true,
      data: event,
      message: "Event berhasil dibuat",
    };
  } catch (error) {
    console.error("Error creating event:", error);
    return {
      success: false,
      error: error.message || "Gagal membuat event",
    };
  }
}

export async function updateEventAction(eventId, payload) {
  try {
    if (!eventId) {
      return {
        success: false,
        error: "Event ID diperlukan",
      };
    }

    const event = await db.event.update({
      where: { id: eventId },
      data: {
        title: payload.title,
        description: payload.description,
        location: payload.location,
        city: payload.city,
        date: payload.date ? new Date(payload.date) : undefined,
        time: payload.time,
        type: payload.category,
        organizer: payload.organizer,
        image: payload.image,
        highlights: payload.highlights,
        rundown: payload.rundown,
        faq: payload.faq,
      },
    });

    revalidatePath("/admin");
    return {
      success: true,
      data: event,
      message: "Event berhasil diperbarui",
    };
  } catch (error) {
    console.error("Error updating event:", error);
    return {
      success: false,
      error: error.message || "Gagal memperbarui event",
    };
  }
}

export async function deleteEventAction(eventId) {
  try {
    if (!eventId) {
      return {
        success: false,
        error: "Event ID diperlukan",
      };
    }

    await db.event.delete({
      where: { id: eventId },
    });

    revalidatePath("/admin");
    return {
      success: true,
      message: "Event berhasil dihapus",
    };
  } catch (error) {
    console.error("Error deleting event:", error);
    return {
      success: false,
      error: error.message || "Gagal menghapus event",
    };
  }
}

export async function addFaqToEventAction(eventId, faqItem) {
  try {
    if (!eventId) {
      return {
        success: false,
        error: "Event ID diperlukan",
      };
    }

    const event = await db.event.findUnique({
      where: { id: eventId },
    });

    if (!event) {
      return {
        success: false,
        error: "Event tidak ditemukan",
      };
    }

    const faqArray = Array.isArray(event.faq) ? event.faq : [];
    faqArray.push({
      id: crypto.randomUUID(),
      q: faqItem.q,
      a: faqItem.a,
    });

    const updated = await db.event.update({
      where: { id: eventId },
      data: { faq: faqArray },
    });

    revalidatePath("/admin");
    return {
      success: true,
      data: updated,
      message: "FAQ berhasil ditambahkan",
    };
  } catch (error) {
    console.error("Error adding FAQ:", error);
    return {
      success: false,
      error: error.message || "Gagal menambahkan FAQ",
    };
  }
}

export async function removeFaqFromEventAction(eventId, faqId) {
  try {
    if (!eventId) {
      return {
        success: false,
        error: "Event ID diperlukan",
      };
    }

    const event = await db.event.findUnique({
      where: { id: eventId },
    });

    if (!event) {
      return {
        success: false,
        error: "Event tidak ditemukan",
      };
    }

    const faqArray = Array.isArray(event.faq) ? event.faq : [];
    const filteredFaq = faqArray.filter((item) => item.id !== faqId);

    const updated = await db.event.update({
      where: { id: eventId },
      data: { faq: filteredFaq },
    });

    revalidatePath("/admin");
    return {
      success: true,
      data: updated,
      message: "FAQ berhasil dihapus",
    };
  } catch (error) {
    console.error("Error removing FAQ:", error);
    return {
      success: false,
      error: error.message || "Gagal menghapus FAQ",
    };
  }
}

export async function addRundownToEventAction(eventId, rundownItem) {
  try {
    if (!eventId) {
      return {
        success: false,
        error: "Event ID diperlukan",
      };
    }

    const event = await db.event.findUnique({
      where: { id: eventId },
    });

    if (!event) {
      return {
        success: false,
        error: "Event tidak ditemukan",
      };
    }

    const rundownArray = Array.isArray(event.rundown) ? event.rundown : [];
    rundownArray.push({
      id: crypto.randomUUID(),
      time: rundownItem.time,
      activity: rundownItem.activity,
    });

    const updated = await db.event.update({
      where: { id: eventId },
      data: { rundown: rundownArray },
    });

    revalidatePath("/admin");
    return {
      success: true,
      data: updated,
      message: "Rundown berhasil ditambahkan",
    };
  } catch (error) {
    console.error("Error adding rundown:", error);
    return {
      success: false,
      error: error.message || "Gagal menambahkan rundown",
    };
  }
}

export async function removeRundownFromEventAction(eventId, rundownId) {
  try {
    if (!eventId) {
      return {
        success: false,
        error: "Event ID diperlukan",
      };
    }

    const event = await db.event.findUnique({
      where: { id: eventId },
    });

    if (!event) {
      return {
        success: false,
        error: "Event tidak ditemukan",
      };
    }

    const rundownArray = Array.isArray(event.rundown) ? event.rundown : [];
    const filteredRundown = rundownArray.filter((item) => item.id !== rundownId);

    const updated = await db.event.update({
      where: { id: eventId },
      data: { rundown: filteredRundown },
    });

    revalidatePath("/admin");
    return {
      success: true,
      data: updated,
      message: "Rundown berhasil dihapus",
    };
  } catch (error) {
    console.error("Error removing rundown:", error);
    return {
      success: false,
      error: error.message || "Gagal menghapus rundown",
    };
  }
}
