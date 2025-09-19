import axios from "axios";
import { BASE_URL } from "./apiPaths";

// Session management utilities
const SESSION_TIMEOUT = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds (increased session time)
const SESSION_KEY = 'session_timestamp';

const isSessionValid = () => {
    const sessionTime = localStorage.getItem(SESSION_KEY);
    if (!sessionTime) return false;
    
    const currentTime = new Date().getTime();
    const sessionTimestamp = parseInt(sessionTime);
    
    return (currentTime - sessionTimestamp) < SESSION_TIMEOUT;
};

const updateSessionTime = () => {
    localStorage.setItem(SESSION_KEY, new Date().getTime().toString());
};

const clearSession = () => {
    localStorage.removeItem('token');
    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem('hasSeenSpendWiseBot');
    // Clear any other app-specific data
    localStorage.removeItem('user_data');
    sessionStorage.clear();
};

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
});

//Request Interceptor
axiosInstance.interceptors.request.use(
    (config) => {
        const accessToken = localStorage.getItem("token");
        
        // Check session validity before making requests
        if (accessToken && isSessionValid()) {
            config.headers.Authorization = `Bearer ${accessToken}`;
            // Update session time on each request
            updateSessionTime();
        } else if (accessToken && !isSessionValid()) {
            // Session expired, clear everything
            clearSession();
            window.location.href = "/login";
            return Promise.reject(new Error('Session expired'));
        }
        
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response Interceptor
axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // Handle common errors globally
        if (error.response) {
            if (error.response.status === 401) {
                // Clear session and redirect to login
                clearSession();
                // Redirect to login
                window.location.href = "/login";
            } else if (error.response.status === 500) {
                console.error("Server error. Please try again later!");
            }
        } else if (error.code === "ECONNABORTED") {
            console.error("Request timed out. Please try again.");
        }
        return Promise.reject(error);
    }
);

// Export session utilities
export { isSessionValid, updateSessionTime, clearSession };
export default axiosInstance;