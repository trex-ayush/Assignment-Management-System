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

      const totalAssignments = response.data.reduce(
        (sum, c) => sum + Number(c.total_assignments || 0),
        0
      );
      const acknowledgedCount = response.data.reduce(
        (sum, c) => sum + Number(c.acknowledged_count || 0),
        0
      );
      const pendingCount = totalAssignments - acknowledgedCount;

      setStats({
        total_courses: response.data.length,
        total_assignments: totalAssignments,
        acknowledged: acknowledgedCount,
        pending: pendingCount,
        overall_progress:
          totalAssignments > 0
            ? Math.round((acknowledgedCount / totalAssignments) * 100)
            : 0,
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </Layout>
    );
  }

  const statCards = [
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
      value: stats?.total_courses,
      label: 'Enrolled Courses',
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-600',
      borderColor: 'border-blue-600',
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      value: stats?.total_assignments,
      label: 'Total Assignments',
      bgColor: 'bg-indigo-100',
      textColor: 'text-indigo-600',
      borderColor: 'border-indigo-600',
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      value: stats?.acknowledged,
      label: 'Acknowledged',
      bgColor: 'bg-green-100',
      textColor: 'text-green-600',
      borderColor: 'border-green-600',
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      value: stats?.pending,
      label: 'Pending',
      bgColor: 'bg-yellow-100',
      textColor: 'text-yellow-600',
      borderColor: 'border-yellow-600',
    },
  ];

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {user?.name}! 👋
        </h1>
        <p className="text-gray-600">Here's your academic overview for this semester</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => (
          <div
            key={index}
            className={`bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 p-6 border-l-4 ${stat.borderColor}`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`${stat.bgColor} ${stat.textColor} p-3 rounded-lg`}>
                {stat.icon}
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</p>
            <p className="text-sm font-medium text-gray-600">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8 border-l-4 border-purple-600">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-purple-100 text-purple-600 p-3 rounded-lg">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900">Overall Progress</h2>
        </div>
        <ProgressBar
          percentage={stats?.overall_progress || 0}
          label="Semester Completion"
        />
      </div>

      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">My Courses</h2>
      </div>

      {courses.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-16 text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No courses enrolled yet</h3>
          <p className="text-gray-500">You haven't enrolled in any courses for this semester</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      )}
    </Layout>
  );
}