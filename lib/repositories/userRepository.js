import "server-only";
import { db } from "@/lib/db";
import { serializeUser, serializeBooking } from "@/lib/utils/serialization";
import { USER_SELECT, USER_SELECT_COMPLETE } from "@/lib/prisma/select-config";

export async function findUserById(userId) {
  const user = await db.user.findUnique({
    where: { id: userId },
    select: USER_SELECT,
  });
  return serializeUser(user);
}

export async function findUserByEmail(email) {
  const user = await db.user.findUnique({
    where: { email },
    select: USER_SELECT,
  });
  return serializeUser(user);
}

export async function createUser(data) {
  const user = await db.user.create({
    data,
    select: USER_SELECT,
  });
  return serializeUser(user);
}

export async function updateUser(userId, data) {
  const user = await db.user.update({
    where: { id: userId },
    data,
    select: USER_SELECT,
  });
  return serializeUser(user);
}

export async function deleteUser(userId) {
  const user = await db.user.delete({
    where: { id: userId },
    select: USER_SELECT,
  });
  return serializeUser(user);
}

export async function findManyUsers(options = {}) {
  const { role = null, page = 1, limit = 10 } = options;
  const skip = (page - 1) * limit;
  const where = role && role !== "ALL" ? { role } : {};

  const [users, total] = await db.$transaction([
    db.user.findMany({
      where,
      orderBy: { createdAt: "desc" },
      select: {
        ...USER_SELECT,
        _count: {
          select: { bookings: true },
        },
      },
      take: limit,
      skip,
    }),
    db.user.count({ where }),
  ]);

  return {
    data: users.map(serializeUser),
    metadata: {
      total,
      page,
      totalPages: Math.ceil(total / limit) || 1,
    },
  };
}

export async function findUserWithStats(userId) {
  const user = await db.user.findUnique({
    where: { id: userId },
    select: USER_SELECT_COMPLETE,
  });
  return serializeUser(user);
}

export async function findUserBookings(userId, status = null) {
  const where = {
    userId,
    ...(status && { status }),
  };

  const bookings = await db.booking.findMany({
    where,
    select: {
      id: true,
      userId: true,
      boothId: true,
      name: true,
      category: true,
      description: true,
      banner: true,
      logo: true,
      paymentProof: true,
      status: true,
      ticketCode: true,
      isCheckedIn: true,
      checkInTime: true,
      createdAt: true,
      updatedAt: true,
      booth: {
        select: {
          id: true,
          code: true,
          price: true,
          eventId: true,
          createdAt: true,
          updatedAt: true,
          event: {
            select: {
              id: true,
              title: true,
              date: true,
              location: true,
              image: true,
            },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return bookings.map(serializeBooking);
}
