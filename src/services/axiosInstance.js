import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, 
});

// This intercepts the request BEFORE it goes to Django
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

export default axiosInstance;