import axios from "axios";

const API_URL = "https://chat-backend-2nh2.onrender.com";

// create axios instance
const api = axios.create({
  baseURL: API_URL,
});

// attach token automatically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
