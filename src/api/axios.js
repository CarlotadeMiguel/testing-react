import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
});

// Interceptor de peticiones: añade token si existe
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

// Interceptor de respuestas: maneja 401 y redirige al login con mensaje
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.setItem('authError', 'No autorizado');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
