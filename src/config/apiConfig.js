/**
 * Centralized API Configuration
 * All API base URLs and client initialization should use this file
 */

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "https://final-project-backend-production-214a.up.railway.app";

/**
 * Get authorization headers with Bearer token
 * Searches both standard 'token' and Supabase auth tokens from localStorage
 */
export const getAuthHeaders = () => {
  let token = null;

  // Try Supabase auth tokens first
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith("sb-") && key.endsWith("-auth-token")) {
      try {
        const rawData = localStorage.getItem(key);
        if (rawData) {
          const sessionData = JSON.parse(rawData);
          token = sessionData?.access_token;
          break;
        }
      } catch (e) {
        console.error("Error parsing Supabase session token:", e);
      }
    }
  }

  // Fallback to standard token
  if (!token) {
    token = localStorage.getItem("token");
  }

  return token
    ? {
        Authorization: `Bearer ${token}`,
      }
    : {};
};

/**
 * Get token from localStorage (supports both standard and Supabase tokens)
 */
export const getToken = () => {
  let token = null;

  // Try Supabase auth tokens first
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith("sb-") && key.endsWith("-auth-token")) {
      try {
        const rawData = localStorage.getItem(key);
        if (rawData) {
          const sessionData = JSON.parse(rawData);
          token = sessionData?.access_token;
          break;
        }
      } catch (e) {
        console.error("Error parsing Supabase session token:", e);
      }
    }
  }

  // Fallback to standard token
  if (!token) {
    token = localStorage.getItem("token");
  }

  return token;
};

/**
 * Default axios client configuration
 * Import and use in api clients instead of hardcoding URLs
 */
export const axiosConfig = {
  baseURL: API_BASE_URL,
};
