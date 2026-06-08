import axios from 'axios';

const adminApi = axios.create({
  baseURL: 'https://final-project-backend-production-214a.up.railway.app', 
});

adminApi.interceptors.request.use(
  (config) => {
    let token = null;

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      
      if (key && key.startsWith('sb-') && key.endsWith('-auth-token')) {
        try {
          const rawData = localStorage.getItem(key);
          if (rawData) {
            const sessionData = JSON.parse(rawData);
            token = sessionData?.access_token; 
          }
        } catch (e) {
          console.error("Error parsing Supabase session token:", e);
        }
        break;
      }
    }

    if (!token) {
      token = localStorage.getItem('token');
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.warn("No token found in localStorage for adminApi!");
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default adminApi;