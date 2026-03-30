import "server-only";
import * as eventRepository from "@/lib/repositories/eventRepository";

export async function createEvent(data) {
  return await eventRepository.createEvent(data);
}

export async function updateEvent(eventId, data) {
  return await eventRepository.updateEvent(eventId, data);
}

export async function deleteEvent(eventId) {
  return await eventRepository.deleteEvent(eventId);
}

export async function getAllEvents(options = {}) {
  return await eventRepository.findManyEvents(options);
}

export async function getEventById(eventId) {
  return await eventRepository.findEventById(eventId);
}