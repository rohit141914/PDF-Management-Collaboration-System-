import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api/auth';

export const register = (userData) => axios.post(`${API_BASE_URL}/register/`, userData);
export const login = (credentials) => axios.post(`${API_BASE_URL}/login/`, credentials);

export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem('access_token', token);
  } else {
    localStorage.removeItem('access_token');
  }
};

export const isAuthenticated = () => {
  return localStorage.getItem('access_token') !== null;
};

export const logout = () => {
  localStorage.removeItem('access_token');
};