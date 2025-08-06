import axios from "axios";
import { BASE_URL } from "./baseUrl";
// Add token caching to avoid multiple requests
let csrfTokenCache = null;
let csrfTokenExpiry = null;

export const getCSRFToken = async () => {
  // Check if we have a valid cached token
  if (csrfTokenCache && csrfTokenExpiry && Date.now() < csrfTokenExpiry) {
    return csrfTokenCache;
  }
  try {
    const response = await axios.get(`${BASE_URL}/csrf-token`, {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.status === 200) {
      const data =  response.data;
      csrfTokenCache = data.csrfToken;
      // Cache for 1 hour
      csrfTokenExpiry = Date.now() + 60 * 60 * 1000;
      return data.csrfToken;
    }
    throw new Error("Failed to get CSRF token");
  } catch (error) {
    console.error("Error fetching CSRF token:", error);
    throw error;
  }
};

// Add function to clear cache when needed
export const clearCSRFTokenCache = () => {
  csrfTokenCache = null;
  csrfTokenExpiry = null;
};

// Function to get headers with CSRF token
export const getHeadersWithCSRF = (csrfToken) => {
  return {
    "Content-Type": "application/json",
    "X-CSRF-Token": csrfToken,
  };
};

// Function to make authenticated request with CSRF token
export const makeAuthenticatedRequest = async (url, options = {}) => {
  try {
    const csrfToken = await getCSRFToken();

    const requestOptions = {
      ...options,
      credentials: "include",
      headers: {
        ...getHeadersWithCSRF(csrfToken),
        ...options.headers,
      },
    };

    const response = await fetch(url, requestOptions);
    return response;
  } catch (error) {
    console.error("Error making authenticated request:", error);
    throw error;
  }
};
