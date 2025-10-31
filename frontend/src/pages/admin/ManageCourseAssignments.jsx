import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import Toast from '../../components/common/Toast';
import ProgressBar from '../../components/common/ProgressBar';
import { courseAPI, assignmentAPI } from '../../services/api';

export default function ManageCourseAssignments() {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    deadline: '',
    onedrive_link: '',
    submission_type: 'individual',
  });
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [toast, setToast] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    loadCourseData();
  }, [courseId]);

  const loadCourseData = async () => {
    try {
      const [courseRes, assignmentsRes] = await Promise.all([
        courseAPI.getById(courseId),
        assignmentAPI.getByCourse(courseId),
      ]);

      setCourse(courseRes.data.course);
      setAssignments(assignmentsRes.data);
    } catch (err) {
      console.error('Failed to load course data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setError('');
    setCreating(true);

    try {
      await assignmentAPI.create({
        course_id: parseInt(courseId),
        ...formData,
      });

      setFormData({
        title: '',
        description: '',
        deadline: '',
        onedrive_link: '',
        submission_type: 'individual',
      });
      setShowCreateModal(false);
      setToast({ message: 'Assignment created successfully!', type: 'success' });
      loadCourseData();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create assignment');
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this assignment? This action cannot be undone.')) return;

    try {
      await assignmentAPI.delete(id);
      setToast({ message: 'Assignment deleted successfully', type: 'success' });
      loadCourseData();
    } catch (err) {
      setToast({ message: 'Failed to delete assignment', type: 'error' });
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

  return (
    <Layout>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="mb-8">
        <Link 
          to="/admin" 
          className="flex items-center text-gray-600 hover:text-gray-900 mb-4 transition-colors group"
        >
          <svg className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Dashboard
        </Link>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-1">{course?.name}</h1>
            <p className="text-gray-600">{course?.code} • {course?.semester}</p>
          </div>
          <button 
            onClick={() => setShowCreateModal(true)}
            className="btn btn-primary flex items-center gap-2 shadow-md hover:shadow-lg transition-shadow"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create Assignment
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg shadow-md p-5 border-l-4 border-indigo-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Total Assignments</p>
                <p className="text-3xl font-bold text-gray-900">{assignments.length}</p>
              </div>
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                <svg className="w-7 h-7 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-5 border-l-4 border-green-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Active</p>
                <p className="text-3xl font-bold text-gray-900">
                  {assignments.filter(a => new Date(a.deadline) >= new Date()).length}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-5 border-l-4 border-red-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Overdue</p>
                <p className="text-3xl font-bold text-gray-900">
                  {assignments.filter(a => new Date(a.deadline) < new Date()).length}
                </p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <svg className="w-7 h-7 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Assignments</h2>

        {assignments.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-16 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No assignments yet</h3>
            <p className="text-gray-500 mb-6">Create your first assignment to get started</p>
            <button 
              onClick={() => setShowCreateModal(true)}
              className="btn btn-primary inline-flex items-center gap-2 shadow-md hover:shadow-lg transition-shadow"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create First Assignment
            </button>
          </div>
        ) : (
          <div className="space-y-5">
            {assignments.map((assignment) => {
              const isOverdue = new Date(assignment.deadline) < new Date();
              const submissionRate = assignment.total_acknowledgments > 0 
                ? Math.round((assignment.total_acknowledgments / (assignment.total_students || 1)) * 100)
                : 0;

              return (
                <div key={assignment.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 p-6 border border-gray-200">
                  <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        <h3 className="text-xl font-bold text-gray-900">{assignment.title}</h3>
                        <span className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                          assignment.submission_type === 'group' 
                            ? 'bg-blue-100 text-blue-700' 
                            : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {assignment.submission_type === 'group' ? 'Group Work' : 'Individual'}
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

                      <p className="text-gray-600 mb-4 line-clamp-2">{assignment.description}</p>
                      
                      <div className="grid grid-cols-3 gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <p className="text-xs font-medium text-gray-600">Deadline</p>
                          </div>
                          <p className="text-sm font-bold text-gray-900">
                            {new Date(assignment.deadline).toLocaleDateString()}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(assignment.deadline).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>

                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <p className="text-xs font-medium text-gray-600">Acknowledged</p>
                          </div>
                          <p className="text-sm font-bold text-green-600">
                            {assignment.total_acknowledgments || 0} / {assignment.total_students || 0}
                          </p>
                        </div>

                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                            </svg>
                            <p className="text-xs font-medium text-gray-600">Completion</p>
                          </div>
                          <p className="text-sm font-bold text-blue-600">{submissionRate}%</p>
                        </div>
                      </div>

                      <div className="max-w-xl">
                        <ProgressBar percentage={submissionRate} showLabel={false} />
                      </div>
                    </div>
                    
                    <div className="flex lg:flex-col gap-2 lg:min-w-[160px]">
                      <Link
                        to={`/admin/courses/${courseId}/assignments/${assignment.id}/analytics`}
                        className="btn btn-primary text-sm flex items-center justify-center gap-2 flex-1 lg:flex-none"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        Analytics
                      </Link>
                      <a 
                        href={assignment.onedrive_link} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="btn btn-secondary text-sm flex items-center justify-center gap-2 flex-1 lg:flex-none"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                        </svg>
                        Files
                      </a>
                      <button 
                        onClick={() => handleDelete(assignment.id)} 
                        className="btn bg-red-600 hover:bg-red-700 text-white text-sm flex items-center justify-center gap-2 flex-1 lg:flex-none"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full my-8">
            <div className="bg-gradient-to-r from-primary-500 to-primary-700 px-6 py-5 rounded-t-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Create New Assignment</h3>
                    <p className="text-sm text-primary-100">Fill in the assignment details</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-1 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <form onSubmit={handleCreate} className="p-6 space-y-6">
              <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
                <h4 className="text-sm font-bold text-gray-700 mb-4 flex items-center gap-2">
                  <svg className="w-4 h-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Basic Information
                </h4>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Assignment Title
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <input
                        type="text"
                        className="input pl-10 bg-white"
                        placeholder="e.g., Chapter 5 Problem Set"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      className="input min-h-[100px] bg-white"
                      placeholder="Provide detailed instructions for the assignment..."
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      required
                    />
                    <p className="mt-1 text-xs text-gray-500">Be clear about what students need to do</p>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 rounded-lg p-5 border border-blue-200">
                <h4 className="text-sm font-bold text-gray-700 mb-4 flex items-center gap-2">
                  <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Settings
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Deadline
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <input
                        type="datetime-local"
                        className="input pl-10 bg-white"
                        value={formData.deadline}
                        onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Submission Type
                    </label>
                    <select
                      className="input bg-white"
                      value={formData.submission_type}
                      onChange={(e) => setFormData({ ...formData, submission_type: e.target.value })}
                    >
                      <option value="individual">Individual Submission</option>
                      <option value="group">Group Submission</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="bg-purple-50 rounded-lg p-5 border border-purple-200">
                <h4 className="text-sm font-bold text-gray-700 mb-4 flex items-center gap-2">
                  <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                  </svg>
                  Resources
                </h4>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    OneDrive Link
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                      </svg>
                    </div>
                    <input
                      type="url"
                      className="input pl-10 bg-white"
                      placeholder="https://onedrive.live.com/..."
                      value={formData.onedrive_link}
                      onChange={(e) => setFormData({ ...formData, onedrive_link: e.target.value })}
                      required
                    />
                  </div>
                  <p className="mt-1 text-xs text-gray-500">Share a link to assignment files and resources</p>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-red-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-sm font-medium text-red-700">{error}</p>
                  </div>
                </div>
              )}

              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-5 py-2.5 bg-white border-2 border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="flex-1 px-5 py-2.5 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-medium rounded-lg hover:from-primary-700 hover:to-primary-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                >
                  {creating ? (
                    <>
                      <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Creating...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      <span>Create Assignment</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
}