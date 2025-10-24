import { useState } from 'react';
import Card from '../common/Card';
import Button from '../common/Button';
import { groupAPI } from '../../services/api';

export default function GroupCard({ group, onUpdate }) {
  const [members, setMembers] = useState([]);
  const [showMembers, setShowMembers] = useState(false);
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const loadMembers = async () => {
    if (showMembers) {
      setShowMembers(false);
      return;
    }

    try {
      const response = await groupAPI.getById(group.id);
      setMembers(response.data.members);
      setShowMembers(true);
    } catch (err) {
      console.error('Failed to load members:', err);
    }
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await groupAPI.addMember(group.id, newMemberEmail);
      setNewMemberEmail('');
      const response = await groupAPI.getById(group.id);
      setMembers(response.data.members);
      onUpdate?.();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add member');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveMember = async (memberId) => {
    if (!confirm('Remove this member?')) return;

    try {
      await groupAPI.removeMember(group.id, memberId);
      const response = await groupAPI.getById(group.id);
      setMembers(response.data.members);
      onUpdate?.();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to remove member');
    }
  };

  return (
    <Card>
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="text-lg font-bold text-gray-800">{group.name}</h3>
          <p className="text-sm text-gray-600">
            Created by: {group.creator_name}
          </p>
        </div>
        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
          {group.member_count} members
        </span>
      </div>

      <Button onClick={loadMembers} variant="secondary" className="w-full mb-3">
        {showMembers ? 'Hide Members' : 'View Members'}
      </Button>

      {showMembers && (
        <div className="border-t pt-4 mt-4">
          <h4 className="font-semibold mb-3">Members</h4>
          <div className="space-y-2 mb-4">
            {members.map((member) => (
              <div key={member.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <div>
                  <p className="font-medium">{member.name}</p>
                  <p className="text-sm text-gray-600">{member.email}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-1 rounded ${
                    member.role === 'leader' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-200'
                  }`}>
                    {member.role}
                  </span>
                  {member.role !== 'leader' && (
                    <button
                      onClick={() => handleRemoveMember(member.id)}
                      className="text-red-600 text-sm hover:text-red-700"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleAddMember} className="space-y-2">
            <input
              type="email"
              placeholder="Add member by email"
              className="input"
              value={newMemberEmail}
              onChange={(e) => setNewMemberEmail(e.target.value)}
              required
            />
            {error && <p className="text-red-600 text-sm">{error}</p>}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Adding...' : 'Add Member'}
            </Button>
          </form>
        </div>
      )}
    </Card>
  );
}