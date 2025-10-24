import { useState, useEffect } from 'react';
import Layout from '../../components/layout/Layout';
import AssignmentCard from '../../components/student/AssignmentCard';
import SubmitAssignmentModal from '../../components/student/SubmitAssignmentModal';
import { assignmentAPI, submissionAPI } from '../../services/api';

export default function Assignments() {
  const [assignments, setAssignments] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [assignmentsRes, submissionsRes] = await Promise.all([
        assignmentAPI.getAll(),
        submissionAPI.getMySubmissions(),
      ]);
      setAssignments(assignmentsRes.data);
      setSubmissions(submissionsRes.data);
    } catch (err) {
      console.error('Failed to load assignments:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (assignment) => {
    setSelectedAssignment(assignment);
    setShowSubmitModal(true);
  };

  const handleSubmitSuccess = () => {
    loadData();
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
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Assignments</h1>
        <p className="text-gray-600 mt-2">View and submit your assignments</p>
      </div>

      {assignments.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No assignments available</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {assignments.map((assignment) => (
            <AssignmentCard
              key={assignment.id}
              assignment={assignment}
              onSubmit={handleSubmit}
              submissions={submissions}
            />
          ))}
        </div>
      )}

      <SubmitAssignmentModal
        isOpen={showSubmitModal}
        onClose={() => setShowSubmitModal(false)}
        assignment={selectedAssignment}
        onSuccess={handleSubmitSuccess}
      />
    </Layout>
  );
}