import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import Card from '../../components/common/Card';
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

      const totalStudents = response.data.reduce(
        (sum, c) => sum + Number(c.total_students || 0),
        0
      );
      const totalAssignments = response.data.reduce(
        (sum, c) => sum + Number(c.total_assignments || 0),
        0
      );

      setStats({
        total_courses: response.data.length,
        total_students: totalStudents,
        total_assignments: totalAssignments,
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
      label: 'Total Courses',
      bgColor: 'bg-purple-100',
      textColor: 'text-purple-600',
      borderColor: 'border-purple-600',
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
      value: stats?.total_students,
      label: 'Total Students',
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
  ];

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Professor Dashboard
        </h1>
        <p className="text-gray-600">Manage your courses and track student progress</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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

      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-900">My Courses</h2>
        <Link to="/admin/courses/create">
          <button className="btn btn-primary flex items-center gap-2 shadow-md hover:shadow-lg transition-shadow">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create Course
          </button>
        </Link>
      </div>

      {courses.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-16 text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No courses yet</h3>
          <p className="text-gray-500 mb-6">Get started by creating your first course</p>
          <Link to="/admin/courses/create" className="btn btn-primary inline-flex items-center gap-2 shadow-md hover:shadow-lg transition-shadow">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create First Course
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {courses.map((course) => (
            <div
              key={course.id}
              className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 p-6 border border-gray-200"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{course.name}</h3>
                  <p className="text-sm text-gray-500">{course.code} • {course.semester}</p>
                </div>
                <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-3 py-1.5 rounded-lg text-xs font-semibold shadow-sm">
                  {course.total_students} Students
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-100">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                  </div>
                  <p className="text-xs font-medium text-gray-600 mb-1">Assignments</p>
                  <p className="text-2xl font-bold text-gray-900">{course.total_assignments}</p>
                </div>

                <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                  </div>
                  <p className="text-xs font-medium text-gray-600 mb-1">Enrolled</p>
                  <p className="text-2xl font-bold text-gray-900">{course.total_students}</p>
                </div>
              </div>

              <div className="flex gap-3">
                <Link 
                  to={`/admin/courses/${course.id}/students`}
                  className="btn btn-secondary text-sm flex-1 text-center flex items-center justify-center gap-2 transition-all hover:scale-105"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  Students
                </Link>
                <Link 
                  to={`/admin/courses/${course.id}/assignments`}
                  className="btn btn-primary text-sm flex-1 text-center flex items-center justify-center gap-2 transition-all hover:scale-105"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Assignments
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </Layout>
  );
}