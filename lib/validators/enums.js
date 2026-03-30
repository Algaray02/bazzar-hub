import { z } from "zod";

export const RoleEnum = z.enum(["ADMIN", "SELLER"]);

export const EventTypeEnum = z.enum(["WEEKLY", "SPECIAL"]);

export const StoreCategoryEnum = z.enum([
  "FOOD_BEVERAGE",
  "FASHION",
  "CRAFT",
  "BEAUTY_CARE",
  "ELECTRONICS",
  "SERVICES",
  "HOME_LIVING",
  "ART_DESIGN",
  "TOYS_HOBBY",
  "BOOKS_STATIONERY",
  "PET_SUPPLIES",
  "SPORTS_OUTDOOR",
  "AUTOMOTIVE",
  "HEALTH_WELLNESS",
  "DIGITAL_PRODUCTS",
  "ACCESSORIES",
  "GADGETS",
  "JEWELRY",
  "PLANTS_GARDEN",
  "KIDS_BABY",
  "LOCAL_BRANDS",
  "OTHERS",
]);

export const BlogCategoryEnum = z.enum(["NEWS", "TIPS", "HIGHLIGHT", "STORY"]);

export const BookingStatusEnum = z.enum([
  "PENDING",
  "PAID",
  "REJECTED",
  "COMPLETED",
]);

export const MessageStatusEnum = z.enum(["UNREAD", "READ", "ARCHIVED"]);

export const HighlightsEnum = z.enum([
  "LIVE_MUSIC",
  "WORKSHOP",
  "FOOD_STALLS",
  "FASHION_MARKET",
  "HANDICRAFT",
  "TALKSHOW",
  "COMMUNITY_EVENT",
  "PHOTOBOOTH",
  "GIVEAWAY",
  "DISCOUNT",
  "KIDS_AREA",
  "MERCH_SALE",
  "ART_EXHIBITION",
  "CULINARY_FEST",
  "SPORT_ACTIVITY",
  "COOKING_DEMO",
  "MEET_CREATOR",
  "PETS_AREA",
  "CAR_FREE_DAY",
  "MARKETPLACE",
]);