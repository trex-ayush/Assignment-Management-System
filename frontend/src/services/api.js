import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export const authAPI = {
  register: (data) => api.post("/auth/register", data),
  login: (data) => api.post("/auth/login", data),
  logout: () => api.post("/auth/logout"),
  getProfile: () => api.get("/auth/profile"),
};

export const assignmentAPI = {
  getAll: () => api.get("/assignments"),
  getById: (id) => api.get(`/assignments/${id}`),
  create: (data) => api.post("/assignments", data),
  update: (id, data) => api.put(`/assignments/${id}`, data),
  delete: (id) => api.delete(`/assignments/${id}`),
  getAnalytics: (id) => api.get(`/assignments/${id}/analytics`),
};

export const groupAPI = {
  getMyGroups: () => api.get("/groups/my-groups"),
  getAll: () => api.get("/groups"),
  getById: (id) => api.get(`/groups/${id}`),
  create: (data) => api.post("/groups", data),
  addMember: (groupId, email) =>
    api.post(`/groups/${groupId}/members`, { email }),
  removeMember: (groupId, memberId) =>
    api.delete(`/groups/${groupId}/members/${memberId}`),
};

export const submissionAPI = {
  submit: (data) => api.post("/submissions", data),
  getMySubmissions: () => api.get("/submissions/my-submissions"),
  getGroupSubmissions: (groupId) => api.get(`/submissions/group/${groupId}`),
  checkStatus: (assignmentId, groupId) =>
    api.get(`/submissions/status/${assignmentId}/${groupId}`),
  delete: (id) => api.delete(`/submissions/${id}`),
};

export const statsAPI = {
  getAdminStats: () => api.get("/stats/admin"),
  getStudentStats: () => api.get("/stats/student"),
};

export default api;
