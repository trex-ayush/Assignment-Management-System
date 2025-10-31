import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import AssignmentCard from '../../components/student/AssignmentCard';
import ProgressBar from '../../components/common/ProgressBar';
import Toast from '../../components/common/Toast';
import { courseAPI, assignmentAPI, groupAPI, acknowledgmentAPI } from '../../services/api';

export default function CourseAssignments() {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [userGroups, setUserGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    loadCourseData();
  }, [courseId]);

  const loadCourseData = async () => {
    try {
      const [courseRes, assignmentsRes, groupsRes] = await Promise.all([
        courseAPI.getById(courseId),
        assignmentAPI.getByCourse(courseId),
        groupAPI.getMyGroups(),
      ]);

      setCourse(courseRes.data.course);
      setAssignments(assignmentsRes.data);
      setUserGroups(groupsRes.data.filter(g => g.course_id === parseInt(courseId)));
    } catch (err) {
      console.error('Failed to load course data:', err);
      setToast({ message: 'Failed to load course data', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleAcknowledge = async (assignmentId, groupId) => {
    try {
      await acknowledgmentAPI.acknowledge({ assignmentId, groupId });
      setToast({ message: 'Assignment acknowledged successfully!', type: 'success' });
      loadCourseData();
    } catch (err) {
      setToast({ message: err.response?.data?.error || 'Failed to acknowledge assignment', type: 'error' });
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-pulse text-gray-600">Loading assignments...</div>
        </div>
      </Layout>
    );
  }

  const acknowledgedCount = assignments.filter(a => a.is_acknowledged).length;
  const progressPercentage = assignments.length > 0
    ? Math.round((acknowledgedCount / assignments.length) * 100)
    : 0;

  return (
    <Layout>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className="mb-6">
        <Link to="/dashboard" className="text-blue-600 hover:underline mb-4 inline-block">
          ← Back to Courses
        </Link>
        <div className="card">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">{course?.name}</h1>
              <p className="text-gray-600">{course?.code} • {course?.semester}</p>
              <p className="text-sm text-gray-500 mt-1">Professor: {course?.professor_name}</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-blue-600">{assignments.length}</div>
              <div className="text-sm text-gray-600">Assignments</div>
            </div>
          </div>
          <div className="mt-6">
            <ProgressBar
              percentage={progressPercentage}
              label="Course Progress"
            />
          </div>
        </div>
      </div>

      {assignments.length === 0 ? (
        <div className="card text-center py-12">
          <div className="text-6xl mb-4">📝</div>
          <p className="text-gray-500 text-lg">No assignments posted yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {assignments.map((assignment) => {
            const userGroup = assignment.submission_type === 'group'
              ? userGroups.find(g => g.id === assignment.group_id) || userGroups[0]
              : null;

            return (
              <AssignmentCard
                key={assignment.id}
                assignment={assignment}
                onAcknowledge={handleAcknowledge}
                userGroup={userGroup}
              />
            );
          })}
        </div>
      )}
    </Layout>
  );
}