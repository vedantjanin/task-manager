import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
  withCredentials: true
});

export const authAPI = {
  login: (data) => API.post('/auth/login', data),
  register: (data) => API.post('/auth/register', data),
  logout: () => API.post('/auth/logout'),
  getCurrentUser: () => API.get('/auth/me')
};

export const tasksAPI = {
  getAll: () => API.get('/tasks'),
  create: (data) => API.post('/tasks', data),
  update: (id, data) => API.put(`/tasks/${id}`, data),        // edit task
  delete: (id) => API.delete(`/tasks/${id}`),
  updateStatus: (id, status) => API.put(`/tasks/${id}/status`, { status }) // mark complete
};
