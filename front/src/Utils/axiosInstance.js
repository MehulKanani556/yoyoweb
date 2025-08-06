import axios from "axios";
import { BASE_URL } from "./baseUrl";
import { logoutUser } from "../Redux/Slice/auth.slice";
import { getCSRFToken, clearCSRFTokenCache } from "./csrfUtils";

const userId = localStorage.getItem("ottuserId");

// Create axios instance with default config
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

// Track if we're currently refreshing CSRF token
let isRefreshingCSRF = false;
let csrfRefreshQueue = [];

const processCSRFQueue = (error, token = null) => {
  csrfRefreshQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  csrfRefreshQueue = [];
};

axiosInstance.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem("ottToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Skip CSRF for GET requests and specific endpoints
    if (
      config.method === "get" ||
      config.url === "/api/csrf-token" ||
      config.url.startsWith("/uploads/") ||
      config.url.startsWith("/api/userLogin") ||
      config.url.startsWith("/api/register") ||
      config.url.startsWith("/api/forgotPassword") ||
      config.url.startsWith("/api/generateNewTokens")
    ) {
      return config;
    }

    // Add CSRF token to all other requests
    try {
      if (isRefreshingCSRF) {
        // If CSRF refresh is in progress, queue the request
        return new Promise((resolve, reject) => {
          csrfRefreshQueue.push({
            resolve: (csrfToken) => {
              config.headers["X-CSRF-Token"] = csrfToken;
              resolve(config);
            },
            reject: (error) => {
              reject(error);
            },
          });
        });
      }

      const csrfToken = await getCSRFToken();
      config.headers["X-CSRF-Token"] = csrfToken;
      console.log("trrrrrrrrrrrrrr");
      
    } catch (error) {
      console.error("Failed to get CSRF token:", error);
      // Don't block the request if CSRF token fails
    }

    console.log(config);
    

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle CSRF token errors
    if (
      error.response?.status === 403 &&
      error.response?.data?.error === "Invalid CSRF token"
    ) {
      console.error("CSRF token validation failed, refreshing...");

      if (isRefreshingCSRF) {
        // If CSRF refresh is in progress, queue the request
        return new Promise((resolve, reject) => {
          csrfRefreshQueue.push({
            resolve: (csrfToken) => {
              originalRequest.headers["X-CSRF-Token"] = csrfToken;
              resolve(axiosInstance(originalRequest));
            },
            reject: (error) => {
              reject(error);
            },
          });
        });
      }

      isRefreshingCSRF = true;

      try {
        // Clear CSRF cache and get new token
        clearCSRFTokenCache();
        const newCsrfToken = await getCSRFToken();

        processCSRFQueue(null, newCsrfToken);
        originalRequest.headers["X-CSRF-Token"] = newCsrfToken;

        return axiosInstance(originalRequest);
      } catch (csrfError) {
        console.error("Failed to refresh CSRF token:", csrfError);
        processCSRFQueue(csrfError, null);
        return Promise.reject(error);
      } finally {
        isRefreshingCSRF = false;
      }
    }

    // Handle 401 errors and token refresh
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/generateNewTokens")
    ) {
      if (isRefreshing) {
        // If refresh is in progress, queue the request
        return new Promise(function (resolve, reject) {
          failedQueue.push({
            resolve: (token) => {
              originalRequest.headers.Authorization = "Bearer " + token;
              resolve(axiosInstance(originalRequest));
            },
            reject: (err) => {
              reject(err);
            },
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = localStorage.getItem("refreshToken");
      try {
        const response = await axios.post(
          `${BASE_URL}/generateNewTokens`,
          {},
          {
            headers: { Authorization: `Bearer ${refreshToken}` },
            withCredentials: true,
          }
        );

        if (response.data.success && response.data.accessToken) {
          localStorage.setItem("ottToken", response.data.accessToken);
          sessionStorage.setItem("token", response.data.accessToken);
          localStorage.setItem("refreshToken", response.data.refreshToken);

          processQueue(null, response.data.accessToken);

          originalRequest.headers.Authorization = `Bearer ${response.data.accessToken}`;

          // Get new CSRF token for the retry
          try {
            clearCSRFTokenCache();
            const newCsrfToken = await getCSRFToken();
            originalRequest.headers["X-CSRF-Token"] = newCsrfToken;
          } catch (csrfError) {
            console.error("Failed to get CSRF token for retry:", csrfError);
          }

          return axiosInstance(originalRequest);
        }
      } catch (refreshError) {
        processQueue(refreshError, null);

        const { store } = require("../Redux/Store").configureStore();
        store.dispatch(logoutUser(userId));
        localStorage.removeItem("ottToken");
        localStorage.removeItem("ottuserId");
        localStorage.removeItem("refreshToken");
        window.location.href = "/";
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
