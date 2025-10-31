import { useState, useEffect } from 'react';
import Layout from '../../components/layout/Layout';
import CourseCard from '../../components/student/CourseCard';
import ProgressBar from '../../components/common/ProgressBar';
import { useAuth } from '../../context/AuthContext';
import { courseAPI } from '../../services/api';

export default function StudentDashboard() {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const response = await courseAPI.getMyCourses();
      setCourses(response.data);

      const totalAssignments = response.data.reduce((sum, c) => sum + (c.total_assignments || 0), 0);
      const acknowledgedCount = response.data.reduce((sum, c) => sum + (c.acknowledged_count || 0), 0);
      const pendingCount = totalAssignments - acknowledgedCount;

      setStats({
        total_courses: response.data.length,
        total_assignments: totalAssignments,
        acknowledged: acknowledgedCount,
        pending: pendingCount,
        overall_progress: totalAssignments > 0 ? Math.round((acknowledgedCount / totalAssignments) * 100) : 0,
      });
    } catch (err) {
      console.error('Failed to load dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-pulse text-gray-600">Loading your dashboard...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="mb-8 animate-fadeIn">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
          Welcome back, {user?.name}! 👋
        </h1>
        <p className="text-gray-600">Here's your academic overview for this semester</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="card text-center animate-slideIn" style={{ animationDelay: '0.1s' }}>
          <div className="text-3xl mb-2">📚</div>
          <p className="text-2xl font-bold text-blue-600">{stats?.total_courses}</p>
          <p className="text-sm text-gray-600">Enrolled Courses</p>
        </div>
        <div className="card text-center animate-slideIn" style={{ animationDelay: '0.2s' }}>
          <div className="text-3xl mb-2">📝</div>
          <p className="text-2xl font-bold text-indigo-600">{stats?.total_assignments}</p>
          <p className="text-sm text-gray-600">Total Assignments</p>
        </div>
        <div className="card text-center animate-slideIn" style={{ animationDelay: '0.3s' }}>
          <div className="text-3xl mb-2">✅</div>
          <p className="text-2xl font-bold text-green-600">{stats?.acknowledged}</p>
          <p className="text-sm text-gray-600">Acknowledged</p>
        </div>
        <div className="card text-center animate-slideIn" style={{ animationDelay: '0.4s' }}>
          <div className="text-3xl mb-2">⏳</div>
          <p className="text-2xl font-bold text-yellow-600">{stats?.pending}</p>
          <p className="text-sm text-gray-600">Pending</p>
        </div>
      </div>

      <div className="card mb-8 animate-slideIn" style={{ animationDelay: '0.5s' }}>
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
          <span>📊</span> Overall Progress
        </h2>
        <ProgressBar 
          percentage={stats?.overall_progress || 0} 
          label="Semester Completion"
        />
      </div>

      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">My Courses</h2>
      </div>

      {courses.length === 0 ? (
        <div className="card text-center py-12">
          <div className="text-6xl mb-4">📚</div>
          <p className="text-gray-500 text-lg">No courses enrolled yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course, index) => (
            <div key={course.id} style={{ animationDelay: `${0.6 + index * 0.1}s` }}>
              <CourseCard course={course} />
            </div>
          ))}
        </div>
      )}
    </Layout>
  );
}