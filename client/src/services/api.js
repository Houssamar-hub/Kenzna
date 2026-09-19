import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT token to requests automatically if present
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('kenzna_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Unified error handler response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || error.message || 'حدث خطأ غير متوقع';
    return Promise.reject(new Error(message));
  }
);

export default api;
