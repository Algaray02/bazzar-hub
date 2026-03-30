import "server-only";
import { db } from "@/lib/db";
import {
  BOOKING_SELECT_COMPLETE,
  BOOKING_INCLUDE_WITH_USER,
  BOOKING_INCLUDE_WITH_BOOTH,
  USER_SELECT,
  EVENT_SELECT,
  BOOTH_SELECT,
} from "@/lib/prisma/select-config";

export async function findBoothById(boothId) {
  return await db.booth.findFirst({
    where: { id: boothId },
    select: {
      id: true,
      code: true,
      price: true,
      eventId: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}

export async function findBoothAvailable(boothId) {
  return await db.booth.findFirst({
    where: {
      id: boothId,
      booking: null,
    },
    select: {
      id: true,
      code: true,
      price: true,
      eventId: true,
    },
  });
}

export async function findUserById(userId) {
  return await db.user.findUnique({
    where: { id: userId },
    select: USER_SELECT,
  });
}

export async function createBooking(data) {
  const { userId, boothId, ...restData } = data;
  return await db.booking.create({
    data: {
      ...restData,
      user: {
        connect: { id: userId },
      },
      booth: {
        connect: { id: boothId },
      },
    },
    select: BOOKING_SELECT_COMPLETE,
  });
}

export async function findBookingById(bookingId) {
  return await db.booking.findUnique({
    where: { id: bookingId },
    select: BOOKING_SELECT_COMPLETE,
  });
}

export async function findManyBookings(options = {}) {
  const {
    userId = null,
    status = null,
    eventId = null,
    page = 1,
    limit = 10,
  } = options;
  const skip = (page - 1) * limit;

  const where = {
    booth: {
      event: {
        date: {
          gte: new Date(),
        },
      },
    },
  };
  if (userId) where.userId = userId;
  if (status) where.status = status;
  if (eventId) where.booth = { eventId };

  const [bookings, total] = await db.$transaction([
    db.booking.findMany({
      where,
      select: {
        ...BOOKING_SELECT_COMPLETE,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
        booth: {
          select: {
            ...BOOTH_SELECT,
            event: {
              select: EVENT_SELECT,
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: limit,
      skip,
    }),
    db.booking.count({ where }),
  ]);

  return {
    data: bookings,
    metadata: {
      total,
      page,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function updateBooking(bookingId, data) {
  return await db.booking.update({
    where: { id: bookingId },
    data,
    select: BOOKING_SELECT_COMPLETE,
  });
}

export async function deleteBooking(bookingId) {
  return await db.booking.delete({
    where: { id: bookingId },
    select: BOOKING_SELECT_COMPLETE,
  });
}
