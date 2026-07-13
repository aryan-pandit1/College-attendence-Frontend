import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, 
});

// ==========================================
// ⚡ CONCURRENCY LOCK & QUEUE SETUP
// Prevents race conditions when multiple API calls fail at once
// ==========================================
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// ==========================================
// 1. REQUEST INTERCEPTOR
// ==========================================
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access") || sessionStorage.getItem("access");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ==========================================
// 2. RESPONSE INTERCEPTOR (With Concurrency Queue)
// ==========================================
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Ignore 401s from the login or refresh endpoints themselves to avoid infinite loops
    if (originalRequest.url?.includes("login") || originalRequest.url?.includes("token/refresh")) {
      return Promise.reject(error);
    }

    // Check if error is 401 and we haven't already retried this request
    if (error.response?.status === 401 && !originalRequest._retry) {
      
      // ⚡ IF REFRESH IS ALREADY IN PROGRESS: Put this request in the waiting line
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers["Authorization"] = `Bearer ${token}`;
            return axiosInstance(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      // ⚡ START THE REFRESH PROCESS
      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = localStorage.getItem("refresh") || sessionStorage.getItem("refresh");

      if (!refreshToken) {
        isRefreshing = false;
        handleSessionExpired();
        return Promise.reject(error);
      }

      try {
        // Request brand new token from Django
        const res = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}token/refresh/`, 
          { refresh: refreshToken }
        );

        const newAccessToken = res.data.access;

        // Save into whoever held it originally
        if (localStorage.getItem("access")) {
          localStorage.setItem("access", newAccessToken);
        } else {
          sessionStorage.setItem("access", newAccessToken);
        }

        // Update default header for future requests
        axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${newAccessToken}`;
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;

        // ⚡ RELEASE THE QUEUE: Tell all waiting requests to proceed with the new token!
        processQueue(null, newAccessToken);
        isRefreshing = false;

        return axiosInstance(originalRequest);

      } catch (refreshError) {
        // ⚡ REFRESH FAILED: Reject all waiting requests and log user out
        processQueue(refreshError, null);
        isRefreshing = false;
        handleSessionExpired();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Helper to cleanly wipe storage and redirect without hard-reload looping
const handleSessionExpired = () => {
  localStorage.clear();
  sessionStorage.clear();
  // Prevent redirect loop if we are already on the login page
  if (window.location.pathname !== "/" && window.location.pathname !== "/login") {
    window.location.href = "/";
  }
};

export default axiosInstance;