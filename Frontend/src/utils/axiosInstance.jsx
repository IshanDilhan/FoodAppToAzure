import axios from "axios";

const API_URL = import.meta.env.VITE_ORDER_API_URL || "http://localhost:5001/api";

const axiosInstance = axios.create({ baseURL: API_URL });

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      delete config.headers.Authorization;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
