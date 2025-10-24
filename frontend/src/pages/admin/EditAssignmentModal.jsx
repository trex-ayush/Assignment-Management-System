import { useState, useEffect } from 'react';
import Modal from '../../components/common/Modal';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { assignmentAPI, groupAPI } from '../../services/api';

export default function EditAssignmentModal({ isOpen, onClose, assignment, onSuccess }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    due_date: '',
    onedrive_link: '',
    assign_to_all: true,
    target_groups: [],
  });
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen && assignment) {
      // Pre-fill form with assignment data
      setFormData({
        title: assignment.title || '',
        description: assignment.description || '',
        due_date: assignment.due_date ? formatDateForInput(assignment.due_date) : '',
        onedrive_link: assignment.onedrive_link || '',
        assign_to_all: assignment.assign_to_all !== false,
        target_groups: [],
      });
      loadGroups();
    }
  }, [isOpen, assignment]);

  const formatDateForInput = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const loadGroups = async () => {
    try {
      const response = await groupAPI.getAll();
      setGroups(response.data);
    } catch (err) {
      console.error('Failed to load groups:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await assignmentAPI.update(assignment.id, formData);
      onSuccess?.();
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update assignment');
    } finally {
      setLoading(false);
    }
  };

  const handleGroupToggle = (groupId) => {
    setFormData(prev => ({
      ...prev,
      target_groups: prev.target_groups.includes(groupId)
        ? prev.target_groups.filter(id => id !== groupId)
        : [...prev.target_groups, groupId]
    }));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Assignment">
      <form onSubmit={handleSubmit}>
        <Input
          label="Title"
          type="text"
          placeholder="Assignment title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
        />

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            className="input min-h-[100px]"
            placeholder="Assignment description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            required
          />
        </div>

        <Input
          label="Due Date"
          type="datetime-local"
          value={formData.due_date}
          onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
          required
        />

        <Input
          label="OneDrive Link"
          type="url"
          placeholder="https://onedrive.com/..."
          value={formData.onedrive_link}
          onChange={(e) => setFormData({ ...formData, onedrive_link: e.target.value })}
          required
        />

        <div className="mb-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.assign_to_all}
              onChange={(e) => setFormData({ ...formData, assign_to_all: e.target.checked })}
            />
            <span className="text-sm font-medium text-gray-700">
              Assign to all groups
            </span>
          </label>
        </div>

        {!formData.assign_to_all && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Groups
            </label>
            <div className="border rounded-lg p-3 max-h-48 overflow-y-auto">
              {groups.length === 0 ? (
                <p className="text-gray-500 text-sm text-center py-2">No groups available</p>
              ) : (
                groups.map((group) => (
                  <label key={group.id} className="flex items-center gap-2 p-2 hover:bg-gray-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.target_groups.includes(group.id)}
                      onChange={() => handleGroupToggle(group.id)}
                    />
                    <span className="text-sm">{group.name} ({group.member_count} members)</span>
                  </label>
                ))
              )}
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="flex gap-3">
          <Button type="button" variant="secondary" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button type="submit" className="flex-1" disabled={loading}>
            {loading ? 'Updating...' : 'Update Assignment'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}