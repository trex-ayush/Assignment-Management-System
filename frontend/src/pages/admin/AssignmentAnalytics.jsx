import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import ProgressBar from '../../components/common/ProgressBar';
import { assignmentAPI } from '../../services/api';

export default function AssignmentAnalytics() {
  const { courseId, assignmentId } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, [assignmentId]);

  const loadAnalytics = async () => {
    try {
      const response = await assignmentAPI.getById(assignmentId);
      setData(response.data);
    } catch (err) {
      console.error('Failed to load analytics:', err);
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

  const stats = data?.stats || { total_students: 0, acknowledged_count: 0, pending_count: 0, total_groups: 0 };
  const acknowledgments = data?.acknowledgments || [];
  const assignment = data?.assignment;
  
  const submissionRate = stats.total_students > 0 || stats.total_groups > 0
    ? Math.round(((stats.acknowledged_count) / (stats.total_students || stats.total_groups)) * 100)
    : 0;

  const isOverdue = new Date(assignment?.deadline) < new Date();

  return (
    <Layout>
      <div className="mb-8">
        <Link 
          to={`/admin/courses/${courseId}/assignments`} 
          className="flex items-center text-gray-600 hover:text-gray-900 mb-4 transition-colors group"
        >
          <svg className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Assignments
        </Link>

        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <h1 className="text-3xl font-bold text-gray-900">{assignment?.title}</h1>
                <span className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                  assignment?.submission_type === 'group' 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {assignment?.submission_type === 'group' ? 'Group Work' : 'Individual'}
                </span>
                {isOverdue && (
                  <span className="px-3 py-1 bg-red-100 text-red-700 rounded-lg text-xs font-semibold flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Overdue
                  </span>
                )}
              </div>
              <p className="text-gray-600 mb-4">{assignment?.description}</p>
              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg">
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-gray-600">Deadline:</span>
                  <span className="font-semibold text-gray-900">
                    {new Date(assignment?.deadline).toLocaleDateString()}
                  </span>
                  <span className="text-gray-500">
                    {new Date(assignment?.deadline).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            </div>

            {assignment?.onedrive_link && (
              <a
                href={assignment.onedrive_link}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary flex items-center gap-2 shadow-md hover:shadow-lg transition-shadow"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                </svg>
                View Files
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-600">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
          <p className="text-sm font-medium text-gray-600 mb-1">
            {assignment?.submission_type === 'group' ? 'Total Groups' : 'Total Students'}
          </p>
          <p className="text-3xl font-bold text-gray-900">
            {assignment?.submission_type === 'group' ? stats.total_groups : stats.total_students}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-600">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <svg className="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <p className="text-sm font-medium text-gray-600 mb-1">Submitted</p>
          <p className="text-3xl font-bold text-gray-900">{stats.acknowledged_count}</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-yellow-600">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <svg className="w-7 h-7 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <p className="text-sm font-medium text-gray-600 mb-1">Pending</p>
          <p className="text-3xl font-bold text-gray-900">{stats.pending_count}</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-600">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <svg className="w-7 h-7 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
          <p className="text-sm font-medium text-gray-600 mb-1">Completion Rate</p>
          <p className="text-3xl font-bold text-gray-900">{submissionRate}%</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
            <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900">Overall Progress</h3>
        </div>
        <ProgressBar percentage={submissionRate} label="Completion" />
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Submission Details
          </h3>
          <div className="flex flex-wrap gap-2">
            <span className="px-4 py-1.5 bg-green-100 text-green-700 rounded-full text-sm font-semibold flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              {stats.acknowledged_count} Submitted
            </span>
            <span className="px-4 py-1.5 bg-yellow-100 text-yellow-700 rounded-full text-sm font-semibold flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {stats.pending_count} Pending
            </span>
          </div>
        </div>

        {acknowledgments.length === 0 ? (
          <div className="text-center py-16 bg-gray-50 rounded-lg">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">No submissions yet</h4>
            <p className="text-gray-500">Students haven't started submitting this assignment</p>
          </div>
        ) : (
          <div className="space-y-3">
            {acknowledgments.map((ack) => (
              <div 
                key={ack.id} 
                className="flex flex-col sm:flex-row sm:items-center justify-between p-5 bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-500 rounded-lg hover:shadow-md transition-shadow duration-200"
              >
                <div className="flex items-center gap-4 mb-3 sm:mb-0">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center shadow-md flex-shrink-0">
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-lg">{ack.user_name}</p>
                    {ack.group_name && (
                      <div className="flex items-center gap-2 mt-1">
                        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <p className="text-sm text-gray-600 font-medium">Group: {ack.group_name}</p>
                      </div>
                    )}
                  </div>
                </div>
                <div className="text-left sm:text-right pl-16 sm:pl-0">
                  <p className="text-sm font-bold text-green-700 mb-1">✓ Submitted</p>
                  <div className="flex items-center gap-1 text-xs text-gray-600">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {new Date(ack.acknowledged_at).toLocaleDateString()} at {new Date(ack.acknowledged_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}