import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, 
});

// ==========================================
// 1. REQUEST INTERCEPTOR
// Intercepts outbound requests and attaches the Access Token
// ==========================================
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access") || sessionStorage.getItem("access");

    if (token) {
      // Django usually expects "Bearer". (Some setups expect "Token" instead!)
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ==========================================
// 2. RESPONSE INTERCEPTOR (⚡ THE FIX FOR 401 CRASHES)
// Intercepts incoming 401 errors and silently refreshes the token
// ==========================================
axiosInstance.interceptors.response.use(
  (response) => {
    // If the request succeeds (200 OK), just pass the data through
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Check if Django rejected the request with a 401 AND we haven't already retried this exact request
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Mark as retried to prevent infinite refresh loops

      // Grab the long-lived refresh token from whichever storage the user chose at login
      const refreshToken = localStorage.getItem("refresh") || sessionStorage.getItem("refresh");

      if (refreshToken) {
        try {
          // Ask Django's token refresh endpoint for a brand new access token
          // Note: We use clean 'axios.post' here, NOT 'axiosInstance', to avoid triggering interceptors again!
          const res = await axios.post(
            `${import.meta.env.VITE_API_BASE_URL}token/refresh/`, 
            { refresh: refreshToken }
          );

          const newAccessToken = res.data.access;

          // Save the fresh token back into the correct storage
          if (localStorage.getItem("access")) {
            localStorage.setItem("access", newAccessToken);
          } else {
            sessionStorage.setItem("access", newAccessToken);
          }

          // Update the failed request's header with the new token and resend it silently
          originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
          return axiosInstance(originalRequest);

        } catch (refreshError) {
          // ⚡ FALLBACK: If the refresh token is ALSO expired (e.g., user inactive for 7+ days)
          // Wipe broken tokens from memory and redirect to login page cleanly
          console.error("Session expired. Logging out...", refreshError);
          localStorage.clear();
          sessionStorage.clear();
          window.location.href = "/";
          return Promise.reject(refreshError);
        }
      } else {
        // If there was no refresh token in storage at all, log the user out
        localStorage.clear();
        sessionStorage.clear();
        window.location.href = "/";
      }
    }

    // For any other errors (like 400 Bad Request, 404 Not Found, or 500 Server Error), pass them to React
    return Promise.reject(error);
  }
);

export default axiosInstance;