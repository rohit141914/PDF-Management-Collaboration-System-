import axios from "axios";

const API_BASE_URL = "http://localhost:8000/api/auth";

export const register = (userData) =>
  axios.post(`${API_BASE_URL}/register/`, userData);
export const login = (credentials) =>
  axios.post(`${API_BASE_URL}/login/`, credentials);

export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem("access_token", token);
    // Set token expiration time to 1 hour from now
    const expiryTime = Date.now() + 3600000; // 3600000 ms = 1 hour
    localStorage.setItem("token_expiry", expiryTime);
  } else {
    localStorage.removeItem("access_token");
    localStorage.removeItem("token_expiry");
  }
};

export const isAuthenticated = () => {
  const token = localStorage.getItem("access_token");
  const expiry = localStorage.getItem("token_expiry");

  if (token && expiry) {
    if (Date.now() > parseInt(expiry)) {
      // Token expired, clean up
      localStorage.removeItem("access_token");
      localStorage.removeItem("token_expiry");
      return false;
    }
    return true;
  }
  return false;
};

export const logout = () => {
  localStorage.removeItem("access_token");
};
