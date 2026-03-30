import { Booking, Event, User, ContactMessage } from "@prisma/client";

/**
 * Generic serialization helper function
 * Converts date fields to ISO strings in an object
 */
export function serializeDates(obj, dateFields = []) {
  if (!obj) return null;
  
  const result = { ...obj };
  
  for (const field of dateFields) {
    if (result[field]) {
      result[field] = result[field].toISOString();
    }
  }
  
  return result;
}

/**
 * Serialize user data, converting dates to ISO strings
 */
export function serializeUser(user) {
  if (!user) return null;
  return serializeDates(user, ['createdAt', 'updatedAt']);
}

/**
 * Serialize booking data with nested relations
 */
export function serializeBooking(booking) {
  if (!booking) return null;
  
  return {
    ...booking,
    ...serializeDates(booking, ['createdAt', 'updatedAt', 'checkInTime']),
    booth: booking.booth
      ? {
          ...booking.booth,
          ...serializeDates(booking.booth, ['createdAt', 'updatedAt']),
          event: booking.booth.event
            ? {
                ...booking.booth.event,
                ...serializeDates(booking.booth.event, ['date', 'createdAt', 'updatedAt']),
              }
            : null,
        }
      : null,
  };
}

/**
 * Serialize event data with nested relations
 */
export function serializeEvent(event) {
  if (!event) return null;
  
  return {
    ...event,
    ...serializeDates(event, ['date', 'createdAt', 'updatedAt']),
    booths: event.booths?.map((booth) => ({
      ...booth,
      ...serializeDates(booth, ['createdAt', 'updatedAt']),
      booking: booth.booking
        ? {
            ...booth.booking,
            ...serializeDates(booth.booking, ['createdAt', 'updatedAt']),
          }
        : null,
    })) || [],
  };
}

/**
 * Serialize contact message data
 */
export function serializeMessage(message) {
  if (!message) return null;
  return serializeDates(message, ['createdAt']);
}

/**
 * Generic serializer that can handle different types of objects
 */
export function serializeEntity(entity, type) {
  switch (type) {
    case 'user':
      return serializeUser(entity);
    case 'booking':
      return serializeBooking(entity);
    case 'event':
      return serializeEvent(entity);
    case 'message':
      return serializeMessage(entity);
    default:
      return entity;
  }
}