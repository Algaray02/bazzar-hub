import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  timeout: 1000 * 60,
});

api.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error)
);

api.interceptors.request.use(
  (request) => request,
  (error) => Promise.reject(error)
);

export default api;
