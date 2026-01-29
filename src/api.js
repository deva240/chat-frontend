import axios from "axios";

const api = axios.create({
  baseURL: "https://chat-backend-2nh2.onrender.com",
});

/* 🔐 Attach token automatically */
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
