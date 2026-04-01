/**
 * Prisma select configurations for efficient queries
 * These configurations help optimize database queries by selecting only needed fields
 */

export const USER_SELECT = {
  id: true,
  name: true,
  email: true,
  phone: true,
  avatar: true,
  role: true,
  createdAt: true,
  updatedAt: true,
};

export const EVENT_SELECT = {
  id: true,
  title: true,
  description: true,
  location: true,
  city: true,
  date: true,
  time: true,
  type: true,
  image: true,
  organizer: true,
  highlights: true,
  createdAt: true,
  updatedAt: true,
};

export const BOOTH_SELECT = {
  id: true,
  code: true,
  price: true,
  eventId: true,
};

export const BOOKING_SELECT = {
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
};

export const POST_SELECT = {
  id: true,
  title: true,
  slug: true,
  content: true,
  category: true,
  image: true,
  published: true,
  author: true,
  avatar: true,
  excerpt: true,
  createdAt: true,
  updatedAt: true,
};

export const CONTACT_MESSAGE_SELECT = {
  id: true,
  name: true,
  email: true,
  subject: true,
  message: true,
  status: true,
  createdAt: true,
};

// Include configurations for related data
export const BOOKING_INCLUDE_WITH_USER = {
  user: {
    select: USER_SELECT,
  },
};

export const BOOKING_INCLUDE_WITH_BOOTH = {
  booth: {
    select: {
      ...BOOTH_SELECT,
      event: {
        select: EVENT_SELECT,
      },
    },
  },
};

export const EVENT_INCLUDE_WITH_BOOTHS = {
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
};

export const USER_INCLUDE_WITH_BOOKINGS = {
  _count: {
    select: {
      bookings: true,
      accounts: true,
    },
  },
};

// Complete configurations including related data
export const BOOKING_SELECT_COMPLETE = {
  ...BOOKING_SELECT,
  user: {
    select: USER_SELECT,
  },
  booth: {
    select: {
      ...BOOTH_SELECT,
      event: {
        select: EVENT_SELECT,
      },
    },
  },
  reviews: {
    select: {
      id: true,
      rating: true,
      comment: true,
      createdAt: true,
    },
  },
  gallery: {
    select: {
      id: true,
      url: true,
      createdAt: true,
    },
  },
};

export const USER_SELECT_COMPLETE = {
  ...USER_SELECT,
  _count: {
    select: {
      bookings: true,
      accounts: true,
    },
  },
};

export const EVENT_SELECT_COMPLETE = {
  ...EVENT_SELECT,
  booths: {
    select: {
      ...BOOTH_SELECT,
      booking: {
        select: {
          ...BOOKING_SELECT,
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
            },
          },
        },
      },
    },
    orderBy: { code: "asc" },
  },
};
