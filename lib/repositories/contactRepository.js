import "server-only";
import { db } from "@/lib/db";
import { serializeMessage } from "@/lib/utils/serialization";
import { CONTACT_MESSAGE_SELECT } from "@/lib/prisma/select-config";

export async function createContactMessage(data) {
  const contactMessage = await db.contactMessage.create({
    data,
    select: CONTACT_MESSAGE_SELECT,
  });
  return serializeMessage(contactMessage);
}

export async function findManyContactMessages(options = {}) {
  const { status = null, page = 1, limit = 10, sortBy = "createdAt" } = options;
  const skip = (page - 1) * limit;

  const where = {};
  if (status && status !== "ALL") {
    where.status = status;
  }

  const [messages, total] = await db.$transaction([
    db.contactMessage.findMany({
      where,
      orderBy: { [sortBy]: "desc" },
      take: limit,
      skip,
      select: CONTACT_MESSAGE_SELECT,
    }),
    db.contactMessage.count({ where }),
  ]);

  return {
    data: messages.map(serializeMessage),
    metadata: {
      total,
      page,
      totalPages: Math.ceil(total / limit) || 1,
    },
  };
}

export async function findContactMessageById(messageId) {
  const message = await db.contactMessage.findUnique({
    where: { id: messageId },
    select: CONTACT_MESSAGE_SELECT,
  });
  return serializeMessage(message);
}

export async function updateContactMessage(messageId, data) {
  const message = await db.contactMessage.update({
    where: { id: messageId },
    data,
    select: CONTACT_MESSAGE_SELECT,
  });
  return serializeMessage(message);
}

export async function deleteContactMessage(messageId) {
  const message = await db.contactMessage.delete({
    where: { id: messageId },
    select: CONTACT_MESSAGE_SELECT,
  });
  return serializeMessage(message);
}

export async function countContactMessages(where = {}) {
  return await db.contactMessage.count({ where });
}

export async function updateManyContactMessages(where, data) {
  return await db.contactMessage.updateMany({
    where,
    data,
  });
}

export async function deleteManyContactMessages(where) {
  return await db.contactMessage.deleteMany({
    where,
  });
}

export async function searchContactMessages(keyword, options = {}) {
  const { page = 1, limit = 10 } = options;
  const skip = (page - 1) * limit;

  const where = {
    OR: [
      { name: { contains: keyword, mode: "insensitive" } },
      { email: { contains: keyword, mode: "insensitive" } },
      { subject: { contains: keyword, mode: "insensitive" } },
      { message: { contains: keyword, mode: "insensitive" } },
    ],
  };

  const [messages, total] = await db.$transaction([
    db.contactMessage.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: limit,
      skip,
      select: CONTACT_MESSAGE_SELECT,
    }),
    db.contactMessage.count({ where }),
  ]);

  return {
    data: messages.map(serializeMessage),
    metadata: {
      total,
      page,
      totalPages: Math.ceil(total / limit) || 1,
    },
  };
}