import { useQuery } from "@tanstack/react-query";

export const DASHBOARD_KEYS = {
  all: ["dashboard"],
  stats: () => ["dashboard", "stats"],
  bookingStats: () => ["dashboard", "bookingStats"],
  revenueStats: () => ["dashboard", "revenueStats"],
  activities: () => ["dashboard", "activities"],
};

export const useDashboardStats = (options = {}) => {
  return useQuery({
    queryKey: DASHBOARD_KEYS.stats(),
    queryFn: async () => {
      const response = await fetch("/api/admin/stats");
      if (!response.ok) {
        throw new Error("Gagal mengambil statistik dashboard");
      }
      return await response.json();
    },
    staleTime: 5 * 60 * 1000, // 5 menit
    ...options,
  });
};

export const useBookingStats = (period = "monthly", options = {}) => {
  return useQuery({
    queryKey: [DASHBOARD_KEYS.bookingStats(), period],
    queryFn: async () => {
      const response = await fetch(`/api/admin/booking-stats?period=${period}`);
      if (!response.ok) {
        throw new Error("Gagal mengambil statistik booking");
      }
      return await response.json();
    },
    staleTime: 10 * 60 * 1000, // 10 menit
    ...options,
  });
};

export const useRevenueStats = (period = "monthly", options = {}) => {
  return useQuery({
    queryKey: [DASHBOARD_KEYS.revenueStats(), period],
    queryFn: async () => {
      const response = await fetch(`/api/admin/revenue-stats?period=${period}`);
      if (!response.ok) {
        throw new Error("Gagal mengambil statistik revenue");
      }
      return await response.json();
    },
    staleTime: 10 * 60 * 1000, // 10 menit
    ...options,
  });
};

export const useDashboardActivities = (limit = 5, options = {}) => {
  return useQuery({
    queryKey: [DASHBOARD_KEYS.activities(), limit],
    queryFn: async () => {
      const response = await fetch(`/api/admin/activities?limit=${limit}`);
      if (!response.ok) {
        throw new Error("Gagal mengambil aktivitas");
      }
      return await response.json();
    },
    staleTime: 2 * 60 * 1000, // 2 menit
    ...options,
  });
};
