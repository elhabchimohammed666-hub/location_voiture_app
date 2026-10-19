import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour injecter automatiquement le Token JWT s'il existe
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('luxedrive_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Intercepteur pour intercepter les erreurs d'authentification
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Déconnexion propre en cas de token invalide
      if (window.location.pathname.startsWith('/profile') || window.location.pathname.startsWith('/my-bookings') || window.location.pathname.startsWith('/admin')) {
        localStorage.removeItem('luxedrive_token');
        localStorage.removeItem('luxedrive_user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
