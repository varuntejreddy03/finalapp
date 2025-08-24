import axios from 'axios';

// Use environment variable, fallback to localhost for local dev
const baseURL = import.meta.env.VITE_API_BASE_URL || "https://spenttracker-backend.onrender.com";

// Create axios instance
const api = axios.create({
  baseURL: baseURL,
});

// Interceptor to add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); 
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
