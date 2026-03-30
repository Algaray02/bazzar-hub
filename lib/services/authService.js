import api from "@/lib/axios";

export const authService = {
  register: async (payload) => {
    const response = await api.post("/auth/register", payload);
    return response.data;
  },

  forgot_password: async (payload) => {
    const response = await api.post("/auth/forgot-password", payload);
    return response.data;
  },

  reset_password: async (payload) => {
    const response = await api.post("/auth/reset-password", payload);
    return response.data;
  },
};