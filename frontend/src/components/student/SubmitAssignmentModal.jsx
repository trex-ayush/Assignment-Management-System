import { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import { groupAPI, submissionAPI } from '../../services/api';

export default function SubmitAssignmentModal({ isOpen, onClose, assignment, onSuccess }) {
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState('');
  const [confirmed, setConfirmed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      loadGroups();
    }
  }, [isOpen]);

  const loadGroups = async () => {
    try {
      const response = await groupAPI.getMyGroups();
      setGroups(response.data);
    } catch (err) {
      console.error('Failed to load groups:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!confirmed) {
      alert('Please confirm that you have uploaded your work to OneDrive');
      return;
    }

    setError('');
    setLoading(true);

    try {
      await submissionAPI.submit({
        assignmentId: assignment.id,
        groupId: parseInt(selectedGroup),
      });
      
      onSuccess?.();
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || 'Submission failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Submit Assignment">
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <h3 className="font-bold text-lg mb-2">{assignment?.title}</h3>
          <p className="text-gray-600 mb-4">{assignment?.description}</p>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <p className="text-sm text-blue-800">
              <strong>OneDrive Link:</strong>
            </p>
            <a
              href={assignment?.onedrive_link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline text-sm"
            >
              {assignment?.onedrive_link}
            </a>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Group
          </label>
          <select
            className="input"
            value={selectedGroup}
            onChange={(e) => setSelectedGroup(e.target.value)}
            required
          >
            <option value="">Choose a group</option>
            {groups.map((group) => (
              <option key={group.id} value={group.id}>
                {group.name} ({group.member_count} members)
              </option>
            ))}
          </select>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={confirmed}
              onChange={(e) => setConfirmed(e.target.checked)}
              className="mt-1"
            />
            <span className="text-sm text-yellow-800">
              I confirm that I have uploaded my assignment to the provided OneDrive link and I'm ready to submit.
            </span>
          </label>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="flex gap-3">
          <Button type="button" variant="secondary" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button type="submit" className="flex-1" disabled={loading || !confirmed}>
            {loading ? 'Submitting...' : 'Confirm Submit'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}