import axios from 'axios';

const api = axios.create({
    // Sesuaikan dengan URL Backend Laravel kamu
    baseURL: 'http://localhost:8000/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;