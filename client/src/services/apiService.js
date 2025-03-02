import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL, // e.g., http://localhost:5000/api
});

// Automatically attach token to every request if it exists
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
