import { LOCAL_AUTH_KEYS } from '@/config/keys.config';
import { getCookie } from '@/lib/secureCookies';
import axios from 'axios';
import { toast } from 'sonner';
const BASE_URL = import.meta.env.VITE_BASE_URL;
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 🔐 Attach Bearer token
axiosInstance.interceptors.request.use((config) => {
  const token = getCookie({ key: LOCAL_AUTH_KEYS.AUTH_TOKEN });
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 🔁 Global 401 logout handler
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      toast.warning('Unauthorized - Logging out...');
      window.location.href = '/register';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
