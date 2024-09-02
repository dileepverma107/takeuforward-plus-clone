// apiClient.js
import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'https://leetcode-clone-a0ts.onrender.com/graphql', // Your backend proxy server URL
  headers: {
    'Content-Type': 'application/json',
  }
});

export default apiClient;
