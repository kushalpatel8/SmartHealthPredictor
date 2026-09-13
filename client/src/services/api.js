import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
});


api.interceptors.request.use(async (config) => {
  try {
    // Attempt to get Clerk token if window.Clerk is available
    if (window.Clerk && window.Clerk.session) {
      const token = await window.Clerk.session.getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } else {
      // Fallback for older localStorage implementation just in case
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
  } catch (error) {
    console.error("Error fetching Clerk token", error);
  }
  return config;
});

export const authAPI = {
  login: (username, password) => {
    const formData = new URLSearchParams();
    formData.append('username', username);
    formData.append('password', password);
    return api.post('/auth/login', formData, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });
  },
  register: (data) => api.post('/auth/register', data),
  getMe: () => api.get('/auth/me')
};

export const patientAPI = {
  getAll: () => api.get('/patients'),
  getById: (id) => api.get(`/patients/${id}`),
  create: (data) => api.post('/patients/', data),
  delete: (id) => api.delete(`/patients/${id}`)
};

export const predictionAPI = {
  predict: (patientId, data) => {
    if (patientId && patientId !== 'anonymous') {
      return api.post(`/predictions/${patientId}`, data);
    }
    return api.post('/predictions/', data);
  },
  getHistory: (patientId) => api.get(`/predictions/${patientId}/history`)
};

export const analyticsAPI = {
  getDashboard: () => api.get('/analytics/dashboard')
};

export const imageAnalysisAPI = {
  analyze: (formData) => api.post('/cv/analyze', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
};

export const symptomAPI = {
  predict: (data) => api.post('/symptoms/predict', data)
};

export default api;
