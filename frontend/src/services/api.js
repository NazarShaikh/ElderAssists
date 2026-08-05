// src/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

// const api = axios.create({
//   baseURL: "https://elderassists-backend.onrender.com/api",
// });
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

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      alert("Session expired. Please login again.");
      localStorage.clear();
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);

export default api;


