import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, 
});

// ⚡ THE BANCER PASS: This interceptor runs before EVERY request
axiosInstance.interceptors.request.use(
  (config) => {
    // 1. Grab the token from localStorage (where your login saves it)
    const token = localStorage.getItem("access") || sessionStorage.getItem("access");

    // 2. If the token exists, attach it to the Authorization header
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;