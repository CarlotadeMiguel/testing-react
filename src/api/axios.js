import axios from 'axios';

const api = axios.create({
  baseURL: '/api' // Puedes cambiar esto si usas una URL real
});

// 👉 Interceptor de Request
api.interceptors.request.use(
  (config) => {
    // Simula que tienes un token (puedes reemplazar esto con uno real)
    const token = localStorage.getItem('token');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    console.error('Error en el request:', error);
    return Promise.reject(error);
  }
);

// 👉 Interceptor de Response
api.interceptors.response.use(
  (response) => {
    // Puedes modificar la respuesta si necesitas
    return response;
  },
  (error) => {
    console.error('Error en la respuesta:', error);

    // Por ejemplo, si no estás autorizado
    if (error.response && error.response.status === 401) {
      alert("No estás autorizado. Redirigiendo a login...");
      // window.location.href = '/login'; // opcional
    }

    return Promise.reject(error);
  }
);

export default api;