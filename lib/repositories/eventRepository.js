import "server-only";
import { db } from "@/lib/db";
import { serializeEvent } from "@/lib/utils/serialization";
import {
  EVENT_SELECT,
  EVENT_INCLUDE_WITH_BOOTHS,
  EVENT_SELECT_COMPLETE,
  BOOTH_SELECT,
  BOOKING_SELECT,
  USER_SELECT,
} from "@/lib/prisma/select-config";

export async function createEvent(data) {
  const event = await db.event.create({
    data,
    select: EVENT_SELECT,
  });
  return serializeEvent(event);
}

export async function updateEvent(eventId, data) {
  const event = await db.event.update({
    where: { id: eventId },
    data,
    select: EVENT_SELECT,
  });
  return serializeEvent(event);
}

export async function deleteEvent(eventId) {
  const event = await db.event.delete({
    where: { id: eventId },
    select: EVENT_SELECT,
  });
  return serializeEvent(event);
}

export async function findManyEvents(options = {}) {
  const { page = 1, limit = 10, type = null } = options;
  const skip = (page - 1) * limit;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const where = {
    ...(type ? { type } : {}),
    date: {
      gte: today,
    },
  };

  const [events, total] = await db.$transaction([
    db.event.findMany({
      where,
      select: {
        ...EVENT_SELECT,
        booths: {
          select: {
            ...BOOTH_SELECT,
            booking: {
              select: {
                ...BOOKING_SELECT,
                user: {
                  select: USER_SELECT,
                },
              },
            },
          },
          orderBy: { code: "asc" },
        },
      },
      take: limit,
      skip,
    }),
    db.event.count({ where }),
  ]);

  return {
    data: events.map(serializeEvent),
    metadata: {
      total,
      page,
      totalPages: Math.ceil(total / limit) || 1,
    },
  };
}

export async function findEventById(eventId) {
  const event = await db.event.findUnique({
    where: { id: eventId },
    select: EVENT_SELECT_COMPLETE,
  });
  return serializeEvent(event);
}
