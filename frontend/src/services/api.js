import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const getDocuments = () => api.get('/documents/');
export const uploadDocument = (formData) => api.post('/documents/', formData, {
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});
export const deleteDocument = (id) => api.delete(`/documents/${id}/`);
export const shareDocument = (id, email) => api.post(`/documents/${id}/share/`, { recipient_email: email });
export const getSharedDocument = (token) => api.get(`/shared/${token}/`);
export const getComments = (documentId) => api.get(`/documents/${documentId}/comments/`);
export const createComment = (documentId, commentData) => api.post(`/documents/${documentId}/comments/`, commentData);