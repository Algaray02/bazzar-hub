import "server-only";
import * as contactRepository from "@/lib/repositories/contactRepository";

export async function createContactMessage(data) {
  const { name, email, subject, message } = data;

  return await contactRepository.createContactMessage({
    name,
    email,
    subject,
    message,
    status: "UNREAD",
  });
}

export async function getAllContactMessages(options = {}) {
  return await contactRepository.findManyContactMessages(options);
}

export async function getContactMessageById(messageId) {
  return await contactRepository.findContactMessageById(messageId);
}

export async function updateMessageStatus(messageId, status) {
  if (!["UNREAD", "READ", "ARCHIVED"].includes(status)) {
    throw new Error("Status tidak valid. Gunakan UNREAD, READ, atau ARCHIVED.");
  }

  return await contactRepository.updateContactMessage(messageId, { status });
}

export async function deleteContactMessage(messageId) {
  return await contactRepository.deleteContactMessage(messageId);
}

export async function getMessageStats() {
  const [total, unread, read, archived] = await Promise.all([
    contactRepository.countContactMessages(),
    contactRepository.countContactMessages({ status: "UNREAD" }),
    contactRepository.countContactMessages({ status: "READ" }),
    contactRepository.countContactMessages({ status: "ARCHIVED" }),
  ]);

  return {
    total,
    unread,
    read,
    archived,
  };
}

export async function markMultipleAsRead(messageIds) {
  const result = await contactRepository.updateManyContactMessages(
    { id: { in: messageIds } },
    { status: "READ" }
  );

  return { count: result.count };
}

export async function deleteMultipleMessages(messageIds) {
  const result = await contactRepository.deleteManyContactMessages({
    id: { in: messageIds },
  });

  return { count: result.count };
}

export async function searchContactMessages(keyword, options = {}) {
  return await contactRepository.searchContactMessages(keyword, options);
}