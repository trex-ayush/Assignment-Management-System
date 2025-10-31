import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Input from '../../components/common/Input';
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
          <div className="animate-pulse text-gray-600">Loading...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="mb-6">
        <Link to="/admin" className="text-blue-600 hover:underline mb-4 inline-block">
          ← Back to Dashboard
        </Link>
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">{course?.name}</h1>
            <p className="text-gray-600">{course?.code} • Manage Students</p>
          </div>
          <Button onClick={() => setShowEnrollModal(true)}>
            + Enroll Student
          </Button>
        </div>
      </div>

      {students.length === 0 ? (
        <Card className="text-center py-12">
          <div className="text-6xl mb-4">👨‍🎓</div>
          <p className="text-gray-500 text-lg mb-4">No students enrolled yet</p>
          <Button onClick={() => setShowEnrollModal(true)}>
            Enroll First Student
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {students.map((student) => (
            <Card key={student.id}>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                  {student.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-800">{student.name}</h3>
                  <p className="text-sm text-gray-600">{student.email}</p>
                  <p className="text-xs text-gray-500">
                    Enrolled: {new Date(student.enrolled_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal isOpen={showEnrollModal} onClose={() => setShowEnrollModal(false)} title="Enroll Student">
        <form onSubmit={handleEnroll}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Student
            </label>
            <select
              className="input"
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

          {availableStudents.length === 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
              <p className="text-sm text-yellow-800">
                All students are already enrolled in this course.
              </p>
            </div>
          )}

          <div className="flex gap-3">
            <Button type="button" variant="secondary" onClick={() => setShowEnrollModal(false)} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1" disabled={enrolling || availableStudents.length === 0}>
              {enrolling ? 'Enrolling...' : 'Enroll Student'}
            </Button>
          </div>
        </form>
      </Modal>
    </Layout>
  );
}