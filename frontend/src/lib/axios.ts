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
    const manualToken = localStorage.getItem("token");
    const isManualAuth = localStorage.getItem("signinResponse") && manualToken;

    console.log("Request URL:", config.url);
    console.log("Request Method:", config.method);
    console.log("LocalStorage - token:", localStorage.getItem("token"));
    console.log("LocalStorage - signinResponse:", localStorage.getItem("signinResponse"));
    console.log("LocalStorage - username:", localStorage.getItem("username"));
    console.log("isManualAuth:", isManualAuth);

    if (isManualAuth) {
      config.headers.Authorization = `Bearer ${manualToken}`;
      console.log("Using manualToken for request:", manualToken);
    } else {
      console.log("No manual token available, relying on Clerk middleware for auth");
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export { axiosInstance };