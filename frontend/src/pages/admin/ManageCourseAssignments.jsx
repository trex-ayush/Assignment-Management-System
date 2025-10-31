import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import Modal from '../../components/common/Modal';
import Input from '../../components/common/Input';
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
    if (!confirm('Delete this assignment?')) return;

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
            <p className="text-gray-600">{course?.code} • {course?.semester}</p>
          </div>
          <Button onClick={() => setShowCreateModal(true)}>
            Create Assignment
          </Button>
        </div>
      </div>

      {assignments.length === 0 ? (
        <Card className="text-center py-12">
          <div className="text-6xl mb-4">📝</div>
          <p className="text-gray-500 text-lg mb-4">No assignments yet</p>
          <Button onClick={() => setShowCreateModal(true)}>
            Create First Assignment
          </Button>
        </Card>
      ) : (
        <div className="space-y-4">
          {assignments.map((assignment) => {
            const isOverdue = new Date(assignment.deadline) < new Date();
            const submissionRate = assignment.total_acknowledgments > 0 
              ? Math.round((assignment.total_acknowledgments / (assignment.total_students || 1)) * 100)
              : 0;

            return (
              <Card key={assignment.id}>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-bold">{assignment.title}</h3>
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${
                        assignment.submission_type === 'group' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {assignment.submission_type}
                      </span>
                      {isOverdue && (
                        <span className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs font-semibold">
                          Overdue
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 mb-3 line-clamp-2">{assignment.description}</p>
                    
                    <div className="grid grid-cols-3 gap-4 mb-3">
                      <div>
                        <p className="text-xs text-gray-600">Deadline</p>
                        <p className="text-sm font-semibold">{new Date(assignment.deadline).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Acknowledged</p>
                        <p className="text-sm font-semibold text-green-600">{assignment.total_acknowledgments || 0}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Completion</p>
                        <p className="text-sm font-semibold text-blue-600">{submissionRate}%</p>
                      </div>
                    </div>

                    <div className="max-w-md">
                      <ProgressBar percentage={submissionRate} showLabel={false} />
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-2 ml-4">
                    <Link
                      to={`/admin/courses/${courseId}/assignments/${assignment.id}/analytics`}
                      className="btn btn-primary text-sm whitespace-nowrap"
                    >
                      📊 View Analytics
                    </Link>
                    <a 
                      href={assignment.onedrive_link} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="btn btn-secondary text-sm whitespace-nowrap text-center"
                    >
                      📁 Files
                    </a>
                    <Button 
                      variant="danger" 
                      onClick={() => handleDelete(assignment.id)} 
                      className="text-sm whitespace-nowrap"
                    >
                      🗑️ Delete
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <Modal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} title="Create Assignment">
        <form onSubmit={handleCreate}>
          <Input
            label="Title"
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              className="input min-h-[100px]"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
            />
          </div>
          <Input
            label="Deadline"
            type="datetime-local"
            value={formData.deadline}
            onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
            required
          />
          <Input
            label="OneDrive Link"
            type="url"
            value={formData.onedrive_link}
            onChange={(e) => setFormData({ ...formData, onedrive_link: e.target.value })}
            required
          />
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Submission Type</label>
            <select
              className="input"
              value={formData.submission_type}
              onChange={(e) => setFormData({ ...formData, submission_type: e.target.value })}
            >
              <option value="individual">Individual</option>
              <option value="group">Group</option>
            </select>
          </div>
          {error && <div className="bg-red-100 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}
          <div className="flex gap-3">
            <Button type="button" variant="secondary" onClick={() => setShowCreateModal(false)} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1" disabled={creating}>
              {creating ? 'Creating...' : 'Create'}
            </Button>
          </div>
        </form>
      </Modal>
    </Layout>
  );
}