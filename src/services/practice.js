// src/services/api.js
import axios from "axios";

export const api = axios.create({
  baseURL: "https://api.freeapi.app/api/v1",
  headers: { "Content-Type": "application/json" },
});

// Helper functions to get tokens
const getAccessToken = () => localStorage.getItem("accessToken");
const getRefreshToken = () => localStorage.getItem("refreshToken");

// Request Interceptor → adds token before every request
api.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor → handles expired token (401)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = getRefreshToken();
      if (refreshToken) {
        try {
          const res = await axios.post(
            "https://api.freeapi.app/api/v1/auth/refresh",
            { refreshToken }
          );
          const newAccessToken = res.data.data.accessToken;
          localStorage.setItem("accessToken", newAccessToken);

          // Update header and retry request
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return api(originalRequest);
        } catch (refreshError) {
          console.error("Token refresh failed:", refreshError);
          localStorage.clear(); // logout if refresh also fails
          window.location.href = "/login";
        }
      }
    }
    return Promise.reject(error);
  }
);

export const UserCreation = {
  RegisterUser: async (data) => {
    const res = await api.post("/users/register", data);
    return res.data;
  },
  LoginUser: async (data) => {
    const res = await api.post("/users/login", data);
    return res.data;
  },
};
