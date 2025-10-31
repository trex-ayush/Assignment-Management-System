import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import Toast from '../../components/common/Toast';
import { courseAPI } from '../../services/api';
import api from '../../services/api';

export default function ManageStudents() {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [students, setStudents] = useState([]);
  const [allStudents, setAllStudents] = useState([]);
  const [showEnrollModal, setShowEnrollModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    loadData();
  }, [courseId]);

  const loadData = async () => {
    try {
      const [courseRes, allStudentsRes] = await Promise.all([
        courseAPI.getById(courseId),
        api.get('/auth/users?role=student'),
      ]);

      setCourse(courseRes.data.course);
      setStudents(courseRes.data.students || []);
      setAllStudents(allStudentsRes.data || []);
    } catch (err) {
      console.error('Failed to load data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async (e) => {
    e.preventDefault();
    if (!selectedStudent) return;

    setEnrolling(true);
    try {
      await courseAPI.enrollStudent(courseId, parseInt(selectedStudent));
      setToast({ message: 'Student enrolled successfully!', type: 'success' });
      setShowEnrollModal(false);
      setSelectedStudent('');
      loadData();
    } catch (err) {
      setToast({ 
        message: err.response?.data?.error || 'Failed to enroll student', 
        type: 'error' 
      });
    } finally {
      setEnrolling(false);
    }
  };

  const enrolledIds = students.map(s => s.id);
  const availableStudents = allStudents.filter(s => !enrolledIds.includes(s.id));

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
            onClick={() => setShowEnrollModal(true)}
            className="btn btn-primary flex items-center gap-2 shadow-md hover:shadow-lg transition-shadow"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Enroll Student
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow-md p-5 border-l-4 border-blue-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Total Enrolled</p>
                <p className="text-3xl font-bold text-gray-900">{students.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-5 border-l-4 border-green-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Available</p>
                <p className="text-3xl font-bold text-gray-900">{availableStudents.length}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-5 border-l-4 border-purple-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Total Students</p>
                <p className="text-3xl font-bold text-gray-900">{allStudents.length}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg className="w-7 h-7 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Enrolled Students</h2>

        {students.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-16 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No students enrolled yet</h3>
            <p className="text-gray-500 mb-6">Start building your class by enrolling students</p>
            <button 
              onClick={() => setShowEnrollModal(true)}
              className="btn btn-primary inline-flex items-center gap-2 shadow-md hover:shadow-lg transition-shadow"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Enroll First Student
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {students.map((student) => (
              <div
                key={student.id}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 p-5 border border-gray-200"
              >
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-md flex-shrink-0">
                    {student.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-900 text-lg mb-1 truncate">{student.name}</h3>
                    <p className="text-sm text-gray-600 mb-2 truncate">{student.email}</p>
                    <div className="flex items-center text-xs text-gray-500">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Enrolled {new Date(student.enrolled_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showEnrollModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
            <div className="bg-gradient-to-r from-primary-500 to-primary-700 px-6 py-4 rounded-t-xl">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-white">Enroll Student</h3>
                <button
                  onClick={() => setShowEnrollModal(false)}
                  className="text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-1 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <form onSubmit={handleEnroll} className="p-6">
              <div className="mb-5">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Select Student
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <select
                    className="input pl-10"
                    value={selectedStudent}
                    onChange={(e) => setSelectedStudent(e.target.value)}
                    required
                  >
                    <option value="">Choose a student</option>
                    {availableStudents.map((student) => (
                      <option key={student.id} value={student.id}>
                        {student.name} ({student.email})
                      </option>
                    ))}
                  </select>
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  {availableStudents.length} student(s) available to enroll
                </p>
              </div>

              {availableStudents.length === 0 && (
                <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-5 rounded-r-lg">
                  <div className="flex items-start">
                    <svg className="w-5 h-5 text-yellow-500 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <p className="text-sm text-yellow-800">
                      All students are already enrolled in this course.
                    </p>
                  </div>
                </div>
              )}

              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowEnrollModal(false)}
                  className="flex-1 px-5 py-2.5 bg-white border-2 border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={enrolling || availableStudents.length === 0}
                  className="flex-1 px-5 py-2.5 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-medium rounded-lg hover:from-primary-700 hover:to-primary-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  {enrolling ? 'Enrolling...' : 'Enroll Student'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
}