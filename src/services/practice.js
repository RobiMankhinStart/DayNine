import axios from "axios";

// Create Axios instance
export const api = axios.create({
  baseURL: "https://api.freeapi.app/api/v1",
  headers: { "Content-Type": "application/json" },
});

// ---- Token Helpers ----
const getAccessToken = () => localStorage.getItem("accessToken");
const getRefreshToken = () => localStorage.getItem("refreshToken");

// ---- Request Interceptor ----
api.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (err) => Promise.reject(err)
);

// ---- Response Interceptor (Handle Expired Token) ----
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If access token expired and request not retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = getRefreshToken();
        if (!refreshToken) throw new Error("No refresh token found");

        // Request new access token using refresh token
        const res = await axios.post(
          "https://api.freeapi.app/api/v1/auth/refresh",
          { token: refreshToken }
        );

        const newAccessToken = res.data?.accessToken;
        const newRefreshToken = res.data?.refreshToken;

        // Save new tokens
        if (newAccessToken) localStorage.setItem("accessToken", newAccessToken);
        if (newRefreshToken)
          localStorage.setItem("refreshToken", newRefreshToken);

        // Retry the original request with new access token
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
        // Optional: clear tokens and redirect to login
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
      }
    }

    return Promise.reject(error);
  }
);

// ---- API Calls ----
export const UserCreation = {
  RegisterUser: async (data) => {
    const res = await api.post("users/register", data);
    return res.data;
  },

  LoginUser: async (data) => {
    try {
      const res = await api.post("/users/login", data);

      if (res.data?.accessToken) {
        localStorage.setItem("accessToken", res.data.accessToken);
      }
      if (res.data?.refreshToken) {
        localStorage.setItem("refreshToken", res.data.refreshToken);
      }

      return res.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
};
