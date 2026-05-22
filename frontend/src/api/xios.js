import axios from 'axios';

const api = axios.create({
    // Sesuaikan dengan URL Backend Laravel kamu
    baseURL: 'http://localhost:8000/api', 
    withCredentials: true, // Penting agar Session/Sanctum jalan
});

export default api;