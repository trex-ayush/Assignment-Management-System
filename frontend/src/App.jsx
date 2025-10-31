import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

import StudentDashboard from './pages/student/StudentDashboard';
import CourseAssignments from './pages/student/CourseAssignments';
import CourseGroups from './pages/student/CourseGroups';

import AdminDashboard from './pages/admin/AdminDashboard';
import ManageCourseAssignments from './pages/admin/ManageCourseAssignments';
import ManageStudents from './pages/admin/ManageStudents';
import CreateCourse from './pages/admin/CreateCourse';
import AssignmentAnalytics from './pages/admin/AssignmentAnalytics';

function ProtectedRoute({ children, role }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (role && user.role !== role) {
    return <Navigate to={user.role === 'admin' ? '/admin' : '/dashboard'} />;
  }

  return children;
}

function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to={user.role === 'admin' ? '/admin' : '/dashboard'} /> : <Login />} />
      <Route path="/register" element={user ? <Navigate to={user.role === 'admin' ? '/admin' : '/dashboard'} /> : <Register />} />

      <Route path="/dashboard" element={<ProtectedRoute role="student"><StudentDashboard /></ProtectedRoute>} />
      <Route path="/courses/:courseId/assignments" element={<ProtectedRoute role="student"><CourseAssignments /></ProtectedRoute>} />
      <Route path="/courses/:courseId/groups" element={<ProtectedRoute role="student"><CourseGroups /></ProtectedRoute>} />

      <Route path="/admin" element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />
      <Route path="/admin/courses/create" element={<ProtectedRoute role="admin"><CreateCourse /></ProtectedRoute>} />
      <Route path="/admin/courses/:courseId/assignments" element={<ProtectedRoute role="admin"><ManageCourseAssignments /></ProtectedRoute>} />
      <Route path="/admin/courses/:courseId/assignments/:assignmentId/analytics" element={<ProtectedRoute role="admin"><AssignmentAnalytics /></ProtectedRoute>} />
      <Route path="/admin/courses/:courseId/students" element={<ProtectedRoute role="admin"><ManageStudents /></ProtectedRoute>} />

      <Route path="/" element={<Navigate to={user ? (user.role === 'admin' ? '/admin' : '/dashboard') : '/login'} />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}