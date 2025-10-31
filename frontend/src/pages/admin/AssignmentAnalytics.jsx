import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import Card from '../../components/common/Card';
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
          <div className="animate-pulse text-gray-600">Loading analytics...</div>
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

  return (
    <Layout>
      <div className="mb-6">
        <Link to={`/admin/courses/${courseId}/assignments`} className="text-blue-600 hover:underline mb-4 inline-block">
          ← Back to Assignments
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{assignment?.title}</h1>
          <p className="text-gray-600">{assignment?.description}</p>
          <div className="flex gap-4 mt-3 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-gray-600">Deadline:</span>
              <span className="font-semibold">{new Date(assignment?.deadline).toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-600">Type:</span>
              <span className={`px-2 py-1 rounded text-xs font-semibold ${
                assignment?.submission_type === 'group' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'
              }`}>
                {assignment?.submission_type}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="border-l-4 border-blue-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">
                {assignment?.submission_type === 'group' ? 'Total Groups' : 'Total Students'}
              </p>
              <p className="text-3xl font-bold text-gray-900">
                {assignment?.submission_type === 'group' ? stats.total_groups : stats.total_students}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
        </Card>

        <Card className="border-l-4 border-green-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Submitted</p>
              <p className="text-3xl font-bold text-gray-900">{stats.acknowledged_count}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </Card>

        <Card className="border-l-4 border-yellow-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Pending</p>
              <p className="text-3xl font-bold text-gray-900">{stats.pending_count}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </Card>

        <Card className="border-l-4 border-purple-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Completion Rate</p>
              <p className="text-3xl font-bold text-gray-900">{submissionRate}%</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
        </Card>
      </div>

      <Card className="mb-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Overall Progress</h3>
        <ProgressBar percentage={submissionRate} label="Completion" />
      </Card>

      <Card>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-gray-900">Submission Details</h3>
          <div className="flex gap-2">
            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
              {stats.acknowledged_count} Submitted
            </span>
            <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-semibold">
              {stats.pending_count} Pending
            </span>
          </div>
        </div>

        {acknowledgments.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className="text-gray-500">No submissions yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {acknowledgments.map((ack) => (
              <div 
                key={ack.id} 
                className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{ack.user_name}</p>
                    {ack.group_name && (
                      <p className="text-sm text-gray-600">Group: {ack.group_name}</p>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-green-700">Submitted</p>
                  <p className="text-xs text-gray-600">
                    {new Date(ack.acknowledged_at).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </Layout>
  );
}