/**
 * Centralized Query Key Factory
 * Standardizes query keys across all React Query hooks
 */

// Generic query key factory
export const createQueryKeys = (entity) => ({
  all: [entity],
  lists: (params) => [entity, 'list', params],
  detail: (id) => [entity, id],
  detailBy: (field, value) => [entity, field, value],
});

// Specific entity query keys
export const USER_KEYS = createQueryKeys('users');
export const EVENT_KEYS = {
  ...createQueryKeys('events'),
  detail: (id) => ['events', id],
};
export const BOOKING_KEYS = {
  ...createQueryKeys('bookings'),
  detail: (id) => ['bookings', id],
};
export const BLOG_KEYS = createQueryKeys('blogs');
export const MESSAGE_KEYS = {
  ...createQueryKeys('messages'),
  stats: ['messages', 'stats'],
};
export const REVIEW_KEYS = createQueryKeys('reviews');

// Specific query keys that had custom patterns
export const BLOG_KEYS_DETAIL = (slug) => ['blogs', slug];

export const USER_PROFILE_KEYS = (userId) => ['user', 'profile', userId];
export const USER_BOOKINGS_KEYS = (userId) => ['user', 'bookings', userId];

export const BOOKING_BY_EVENT_KEYS = (eventId) => ['bookings', 'event', eventId];
export const BOOKING_BY_USER_KEYS = (userId) => ['bookings', 'user', userId];

export const EVENT_BOOTH_AVAILABILITY_KEYS = (eventId) => ['event', 'booths', 'availability', eventId];

// Admin specific query keys
export const ADMIN_KEYS = {
  all: ['admin'],
  dashboard: ['admin', 'dashboard'],
  stats: ['admin', 'stats'],
};

// Seller specific query keys
export const SELLER_KEYS = {
  all: ['seller'],
  dashboard: ['seller', 'dashboard'],
  bookings: ['seller', 'bookings'],
  events: ['seller', 'events'],
};

// Tenant specific query keys
export const TENANT_KEYS = {
  all: ['tenant'],
  byId: (id) => ['tenant', id],
  reviews: (bookingId) => ['tenant', 'reviews', bookingId],
};