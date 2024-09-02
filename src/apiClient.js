// apiClient.js
import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'https://takeuforward-plus-clone.onrender.com/graphql', // Your backend proxy server URL
  headers: {
    'Content-Type': 'application/json',
  }
});

export default apiClient;
