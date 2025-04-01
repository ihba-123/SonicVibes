import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.MODE === "development" ? "http://localhost:5001/api" : "/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Ensure cookies are sent for Clerk session
});

axiosInstance.interceptors.request.use(
  (config) => {
    console.log("Relying on Clerk middleware for auth");
    return config;
  },
  (error) => Promise.reject(error)
);

export { axiosInstance };