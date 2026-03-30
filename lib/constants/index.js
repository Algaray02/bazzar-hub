/**
 * User roles enum
 */
export const USER_ROLES = {
  ADMIN: 'ADMIN',
  SELLER: 'SELLER',
  USER: 'USER',
  ALL: 'ALL'
};

/**
 * Booking statuses enum
 */
export const BOOKING_STATUSES = {
  PENDING: 'PENDING',
  PAID: 'PAID',
  REJECTED: 'REJECTED',
  CANCELLED: 'CANCELLED',
  COMPLETED: 'COMPLETED',
};

/**
 * Event types enum
 */
export const EVENT_TYPES = {
  WEEKLY: 'WEEKLY',
  SPECIAL: 'SPECIAL',
};

/**
 * Blog categories enum
 */
export const BLOG_CATEGORIES = {
  NEWS: 'NEWS',
  TUTORIAL: 'TUTORIAL',
  PROMOTION: 'PROMOTION',
  GUIDE: 'GUIDE',
};

/**
 * Contact message statuses enum
 */
export const MESSAGE_STATUSES = {
  READ: 'READ',
  UNREAD: 'UNREAD',
  ALL: 'ALL',
};

/**
 * Booth statuses enum
 */
export const BOOTH_STATUSES = {
  AVAILABLE: 'AVAILABLE',
  BOOKED: 'BOOKED',
  RESERVED: 'RESERVED',
};

/**
 * App constants
 */
export const APP_CONSTANTS = {
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,
  MIN_PAGE_SIZE: 1,
  DEFAULT_CACHE_REVALIDATION: 3600, // 1 hour in seconds
};

/**
 * Route constants
 */
export const ROUTES = {
  HOME: '/',
  EVENTS: '/events',
  BLOGS: '/blogs',
  CONTACT: '/contact',
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    FORGOT_PASSWORD: '/auth/forgot-password',
  },
  ADMIN: {
    DASHBOARD: '/admin',
    EVENTS: '/admin/events',
    BOOKINGS: '/admin/bookings',
    USERS: '/admin/users',
    BLOGS: '/admin/blogs',
    MESSAGES: '/admin/messages',
    SETTINGS: '/admin/settings',
  },
  SELLER: {
    DASHBOARD: '/seller',
  },
};

/**
 * Response messages
 */
export const RESPONSE_MESSAGES = {
  SUCCESS: {
    CREATE: 'Data berhasil dibuat',
    UPDATE: 'Data berhasil diupdate',
    DELETE: 'Data berhasil dihapus',
    VERIFY: 'Data berhasil diverifikasi',
    PUBLISH: 'Data berhasil dipublish',
  },
  ERROR: {
    UNAUTHORIZED: 'Akses ditolak. Anda tidak memiliki izin.',
    NOT_FOUND: 'Data tidak ditemukan.',
    INVALID_INPUT: 'Input tidak valid. Silakan cek kembali.',
    SERVER_ERROR: 'Terjadi kesalahan server.',
    DUPLICATE: 'Data sudah ada.',
  }
};

/**
 * Form validation constants
 */
export const VALIDATION_RULES = {
  PASSWORD: {
    MIN_LENGTH: 8,
    MAX_LENGTH: 128,
    REQUIREMENTS: {
      LOWERCASE: /[a-z]/,
      UPPERCASE: /[A-Z]/,
      NUMBER: /\d/,
      SPECIAL_CHAR: /[!@#$%^&*(),.?":{}|<>]/,
    }
  },
  EMAIL: {
    MAX_LENGTH: 254,
    PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
  PHONE: {
    PATTERN: /^(\+62|62|0)8[1-9][0-9]{6,10}$/,
  }
};

/**
 * File upload constants
 */
export const FILE_UPLOAD_CONSTANTS = {
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB in bytes
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
  MAX_IMAGE_WIDTH: 1920,
  MAX_IMAGE_HEIGHT: 1080,
};

/**
 * Storage buckets
 */
export const STORAGE_BUCKETS = {
  EVENT_IMAGE: 'event-images',
  POST_IMAGE: 'post-images',
  USER_AVATAR: 'user-avatars',
  BOOTH_LOGO: 'booth-logos',
  BOOTH_BANNER: 'booth-banners',
  PAYMENT_PROOF: 'payment-proofs',
};

/**
 * Cache tags for Next.js
 */
export const CACHE_TAGS = {
  EVENTS: 'events',
  BLOGS: 'blogs',
  BOOKINGS: 'bookings',
  USERS: 'users',
  MESSAGES: 'messages',
};

/**
 * Date format constants
 */
export const DATE_FORMATS = {
  DISPLAY: 'dd MMMM yyyy',
  API: 'yyyy-MM-dd',
  DATETIME: 'yyyy-MM-dd HH:mm:ss',
  TIME: 'HH:mm',
};