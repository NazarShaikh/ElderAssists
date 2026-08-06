import axios from "axios";

const adminApi = axios.create({
  baseURL: process.env.REACT_APP_ADMINAPI_URL,
});

console.log("ADMIN API URL:", adminApi.defaults.baseURL);

adminApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default adminApi;