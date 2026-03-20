// lib/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'
});

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    // Utiliser le token admin si on est sur une page admin
    const isAdmin = window.location.pathname.startsWith('/admin');
    const token = isAdmin
      ? localStorage.getItem('adminToken')
      : localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      if (typeof window !== 'undefined') {
        const isAdmin = window.location.pathname.startsWith('/admin');
        if (isAdmin) {
          localStorage.removeItem('adminToken');
          localStorage.removeItem('admin');
          window.location.href = '/admin/login';
        } else {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;