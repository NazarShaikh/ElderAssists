import axios from "axios";

const adminApi = axios.create({
  baseURL: "http://localhost:5000/api/admin",
});

// const adminApi = axios.create({
//   baseURL: "https://elderassists-backend.onrender.com/api/admin",
// });

adminApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default adminApi;