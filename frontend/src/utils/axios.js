import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.MODE === "development" ? import.meta.env.VITE_API_BASE_URL_DEV : import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});