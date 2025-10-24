import { useState, useEffect } from 'react';
import Layout from '../../components/layout/Layout';
import GroupCard from '../../components/student/GroupCard';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Input from '../../components/common/Input';
import { groupAPI } from '../../services/api';

export default function MyGroups() {
  const [groups, setGroups] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadGroups();
  }, []);

  const loadGroups = async () => {
    try {
      const response = await groupAPI.getMyGroups();
      setGroups(response.data);
    } catch (err) {
      console.error('Failed to load groups:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    setError('');
    setCreating(true);

    try {
      await groupAPI.create({ name: groupName });
      setGroupName('');
      setShowCreateModal(false);
      loadGroups();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create group');
    } finally {
      setCreating(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-600">Loading groups...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">My Groups</h1>
          <p className="text-gray-600 mt-2">Manage your study groups</p>
        </div>
        <Button onClick={() => setShowCreateModal(true)}>
          Create Group
        </Button>
      </div>

      {groups.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg mb-4">You haven't joined any groups yet</p>
          <Button onClick={() => setShowCreateModal(true)}>
            Create Your First Group
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {groups.map((group) => (
            <GroupCard key={group.id} group={group} onUpdate={loadGroups} />
          ))}
        </div>
      )}

      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create New Group"
      >
        <form onSubmit={handleCreateGroup}>
          <Input
            label="Group Name"
            type="text"
            placeholder="Enter group name"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            error={error}
            required
          />
          <div className="flex gap-3 mt-4">
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