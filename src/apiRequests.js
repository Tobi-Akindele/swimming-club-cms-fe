import axios from 'axios';

const BASE_URL = 'http://localhost:6040';

export const openRequest = axios.create({
  baseURL: BASE_URL,
});