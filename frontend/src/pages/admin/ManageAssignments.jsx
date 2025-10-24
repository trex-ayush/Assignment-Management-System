import { useState, useEffect } from 'react';
import Layout from '../../components/layout/Layout';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import CreateAssignmentModal from './CreateAssignmentModal';
import EditAssignmentModal from './EditAssignmentModal';
import AssignmentAnalytics from './AssignmentAnalytics';
import { assignmentAPI } from '../../services/api';
import { formatDate } from '../../utils/helpers';

export default function ManageAssignments() {
  const [assignments, setAssignments] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [selectedAssignmentId, setSelectedAssignmentId] = useState(null);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAssignments();
  }, []);

  const loadAssignments = async () => {
    try {
      const response = await assignmentAPI.getAll();
      setAssignments(response.data);
    } catch (err) {
      console.error('Failed to load assignments:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (assignment) => {
    setSelectedAssignment(assignment);
    setShowEditModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this assignment?')) return;

    try {
      await assignmentAPI.delete(id);
      loadAssignments();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to delete assignment');
    }
  };

  const handleViewAnalytics = (id) => {
    setSelectedAssignmentId(id);
    setShowAnalytics(true);
  };

  const handleModalSuccess = () => {
    loadAssignments();
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-600">Loading assignments...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Manage Assignments</h1>
          <p className="text-gray-600 mt-2">Create and manage assignments</p>
        </div>
        <Button onClick={() => setShowCreateModal(true)}>
          Create Assignment
        </Button>
      </div>

      {assignments.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg mb-4">No assignments created yet</p>
          <Button onClick={() => setShowCreateModal(true)}>
            Create Your First Assignment
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {assignments.map((assignment) => (
            <Card key={assignment.id}>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-bold text-gray-800">
                      {assignment.title}
                    </h3>
                    {new Date(assignment.due_date) < new Date() && (
                      <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-medium">
                        Overdue
                      </span>
                    )}
                    {assignment.assign_to_all ? (
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                        All Groups
                      </span>
                    ) : (
                      <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs font-medium">
                        Selected Groups
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600 mb-3">{assignment.description}</p>
                  
                  <div className="flex gap-6 text-sm text-gray-600">
                    <div>
                      <span className="font-medium">Due: </span>
                      <span className={new Date(assignment.due_date) < new Date() ? 'text-red-600' : ''}>
                        {formatDate(assignment.due_date)}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium">Submissions: </span>
                      <span className="text-green-600 font-medium">
                        {assignment.total_submissions || 0}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium">Created by: </span>
                      {assignment.professor_name}
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2 ml-4">
                  <Button
                    onClick={() => handleEdit(assignment)}
                    variant="secondary"
                    className="text-sm"
                  >
                    Edit
                  </Button>
                  <Button
                    onClick={() => handleViewAnalytics(assignment.id)}
                    variant="secondary"
                    className="text-sm"
                  >
                    Analytics
                  </Button>
                  <a
                    href={assignment.onedrive_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-secondary text-sm"
                  >
                    Files
                  </a>
                  <Button
                    onClick={() => handleDelete(assignment.id)}
                    variant="danger"
                    className="text-sm"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <CreateAssignmentModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={handleModalSuccess}
      />

      <EditAssignmentModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedAssignment(null);
        }}
        assignment={selectedAssignment}
        onSuccess={handleModalSuccess}
      />

      <AssignmentAnalytics
        isOpen={showAnalytics}
        onClose={() => setShowAnalytics(false)}
        assignmentId={selectedAssignmentId}
      />
    </Layout>
  );
}