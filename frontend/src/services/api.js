import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  getProfile: () => api.get('/auth/profile'),
};

export const courseAPI = {
  getMyCourses: () => api.get('/courses/my-courses'),
  getById: (id) => api.get(`/courses/${id}`),
  create: (data) => api.post('/courses', data),
  enrollStudent: (courseId, studentId) => api.post(`/courses/${courseId}/enroll`, { studentId }),
};

export const assignmentAPI = {
  getByCourse: (courseId) => api.get(`/assignments/course/${courseId}`),
  getById: (id) => api.get(`/assignments/${id}`),
  create: (data) => api.post('/assignments', data),
  update: (id, data) => api.put(`/assignments/${id}`, data),
  delete: (id) => api.delete(`/assignments/${id}`),
};

export const groupAPI = {
  getMyGroups: () => api.get('/groups/my-groups'),
  getAll: () => api.get('/groups'),
  getById: (id) => api.get(`/groups/${id}`),
  create: (data) => api.post('/groups', data),
  addMember: (groupId, email) => api.post(`/groups/${groupId}/members`, { email }),
  removeMember: (groupId, memberId) => api.delete(`/groups/${groupId}/members/${memberId}`),
};

export const acknowledgmentAPI = {
  acknowledge: (data) => api.post('/acknowledgments', data),
};

export const statsAPI = {
  getAdminStats: () => api.get('/stats/admin'),
  getStudentStats: () => api.get('/stats/student'),
};

export default api;