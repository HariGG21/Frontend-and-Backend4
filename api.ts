// In a file like src/api.ts or within your components
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Replace with your backend URL if it's different
  withCredentials: true, // If your backend uses cookies for authentication
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api; // You had 'API' here, corrected to 'api'