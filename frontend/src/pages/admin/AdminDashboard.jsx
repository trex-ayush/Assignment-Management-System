import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import Card from '../../components/common/Card';
import ProgressBar from '../../components/common/ProgressBar';
import { courseAPI } from '../../services/api';

export default function AdminDashboard() {
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

      const totalStudents = response.data.reduce((sum, c) => sum + (c.total_students || 0), 0);
      const totalAssignments = response.data.reduce((sum, c) => sum + (c.total_assignments || 0), 0);
      const avgSubmission = response.data.length > 0
        ? Math.round(response.data.reduce((sum, c) => sum + (c.submission_rate || 0), 0) / response.data.length)
        : 0;

      setStats({
        total_courses: response.data.length,
        total_students: totalStudents,
        total_assignments: totalAssignments,
        avg_submission_rate: avgSubmission,
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
          <div className="animate-pulse text-gray-600">Loading dashboard...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Professor Dashboard
        </h1>
        <p className="text-gray-600">Manage your courses and track student progress</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="border-l-4 border-purple-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Total Courses</p>
              <p className="text-3xl font-bold text-gray-900">{stats?.total_courses}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
          </div>
        </Card>

        <Card className="border-l-4 border-blue-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Total Students</p>
              <p className="text-3xl font-bold text-gray-900">{stats?.total_students}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
          </div>
        </Card>

        <Card className="border-l-4 border-indigo-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Total Assignments</p>
              <p className="text-3xl font-bold text-gray-900">{stats?.total_assignments}</p>
            </div>
            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
        </Card>

        <Card className="border-l-4 border-green-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Avg Submission Rate</p>
              <p className="text-3xl font-bold text-gray-900">{stats?.avg_submission_rate}%</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
        </Card>
      </div>

      {/* Courses Section */}
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">My Courses</h2>
        <Link to="/admin/courses/create">
          <button className="btn btn-primary flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create Course
          </button>
        </Link>
      </div>

      {courses.length === 0 ? (
        <Card className="text-center py-16 bg-gray-50">
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No courses yet</h3>
          <p className="text-gray-500 mb-6">Get started by creating your first course</p>
          <Link to="/admin/courses/create" className="btn btn-primary inline-flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create First Course
          </Link>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {courses.map((course) => (
            <Card 
              key={course.id} 
              className="hover:shadow-lg transition-all duration-200 border border-gray-200"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{course.name}</h3>
                  <p className="text-sm text-gray-500">{course.code} • {course.semester}</p>
                </div>
                <div className="bg-purple-600 text-white px-3 py-1 rounded-md text-sm font-semibold">
                  {course.total_students} Students
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4 py-4 bg-gray-50 rounded-lg px-4">
                <div>
                  <p className="text-xs font-medium text-gray-600 mb-1">Assignments</p>
                  <p className="text-2xl font-bold text-gray-900">{course.total_assignments}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-600 mb-1">Submission Rate</p>
                  <p className="text-2xl font-bold text-gray-900">{course.submission_rate}%</p>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Overall Progress</span>
                  <span className="text-sm font-semibold text-gray-900">{course.submission_rate}%</span>
                </div>
                <ProgressBar
                  percentage={course.submission_rate}
                  showLabel={false}
                />
              </div>

              <div className="flex gap-3">
                <Link 
                  to={`/admin/courses/${course.id}/students`}
                  className="btn btn-secondary text-sm flex-1 text-center flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  Students
                </Link>
                <Link 
                  to={`/admin/courses/${course.id}/assignments`}
                  className="btn btn-primary text-sm flex-1 text-center flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Assignments
                </Link>
              </div>
            </Card>
          ))}
        </div>
      )}
    </Layout>
  );
}