import axios from "axios";

const getBaseURL = () => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  const isProd = import.meta.env.PROD;
  return isProd
    ? "https://task-manager-backend-ten-eta.vercel.app/api"
    : "http://localhost:3000/api";
};

const axiosClient = axios.create({
  baseURL: getBaseURL(),
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

// Request interceptor — attach JWT token
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("auth_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — unwrap errors & handle 401
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      "Something went wrong";

    // If unauthorized and not on auth routes, redirect to login
    if (error.response?.status === 401) {
      const url = error.config?.url || "";
      const isAuthRoute = url.includes("/auth/");
      if (!isAuthRoute) {
        localStorage.removeItem("auth_token");
        window.location.href = "/login";
      }
    }

    return Promise.reject(new Error(message));
  }
);

export default axiosClient;
