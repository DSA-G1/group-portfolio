import axios from 'axios';

// Use relative base URL; Vite dev proxy forwards to Flask backend
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;