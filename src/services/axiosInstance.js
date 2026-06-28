import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach access token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Refresh expired access token automatically
api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        const refresh =
          localStorage.getItem("refresh");

        if (!refresh) {
          throw new Error("No refresh token");
        }

        const response = await axios.post(
          "http://127.0.0.1:8000/api/auth/token/refresh/",
          {
            refresh,
          }
        );

        const newAccess =
          response.data.access;

        localStorage.setItem(
          "access",
          newAccess
        );

        originalRequest.headers.Authorization =
          `Bearer ${newAccess}`;

        return api(originalRequest);
      } catch (err) {
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        localStorage.removeItem("loggedIn");
        localStorage.removeItem("student");

        window.location.href = "/";

        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default api;