import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Input from '../../components/common/Input';
import Toast from '../../components/common/Toast';
import { courseAPI, groupAPI } from '../../services/api';

export default function CourseGroups() {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [myGroup, setMyGroup] = useState(null);
  const [members, setMembers] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [memberEmail, setMemberEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [adding, setAdding] = useState(false);
  const [toast, setToast] = useState(null);
  const [error, setError] = useState('');
  const [addError, setAddError] = useState('');

  useEffect(() => {
    loadData();
  }, [courseId]);

  const loadData = async () => {
    try {
      const [courseRes, groupsRes] = await Promise.all([
        courseAPI.getById(courseId),
        groupAPI.getMyGroups(),
      ]);

      setCourse(courseRes.data.course);
      const courseGroups = groupsRes.data.filter(g => g.course_id === parseInt(courseId));
      const group = courseGroups[0] || null;
      setMyGroup(group);

      if (group) {
        loadGroupMembers(group.id);
      }
    } catch (err) {
      console.error('Failed to load data:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadGroupMembers = async (groupId) => {
    try {
      const response = await groupAPI.getById(groupId);
      setMembers(response.data.members || []);
    } catch (err) {
      console.error('Failed to load members:', err);
    }
  };

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    setError('');
    setCreating(true);

    try {
      await groupAPI.create({ 
        name: groupName, 
        course_id: parseInt(courseId) 
      });
      setToast({ message: 'Group created successfully!', type: 'success' });
      setShowCreateModal(false);
      setGroupName('');
      loadData();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create group');
    } finally {
      setCreating(false);
    }
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    setAddError('');
    setAdding(true);

    try {
      await groupAPI.addMember(myGroup.id, memberEmail);
      setToast({ message: 'Member added successfully!', type: 'success' });
      setShowAddMemberModal(false);
      setMemberEmail('');
      loadGroupMembers(myGroup.id);
    } catch (err) {
      setAddError(err.response?.data?.error || 'Failed to add member');
    } finally {
      setAdding(false);
    }
  };

  const handleRemoveMember = async (memberId) => {
    if (!confirm('Remove this member from the group?')) return;

    try {
      await groupAPI.removeMember(myGroup.id, memberId);
      setToast({ message: 'Member removed successfully', type: 'success' });
      loadGroupMembers(myGroup.id);
    } catch (err) {
      setToast({ 
        message: err.response?.data?.error || 'Failed to remove member', 
        type: 'error' 
      });
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
        <Link to="/dashboard" className="text-blue-600 hover:underline mb-4 inline-block">
          ← Back to Dashboard
        </Link>
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">{course?.name}</h1>
            <p className="text-gray-600">My Groups</p>
          </div>
          {!myGroup && (
            <Button onClick={() => setShowCreateModal(true)}>
              Create Group
            </Button>
          )}
        </div>
      </div>

      {myGroup ? (
        <div className="space-y-6">
          {/* Group Info Card */}
          <Card>
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-2xl font-bold text-gray-800">{myGroup.name}</h3>
                <p className="text-sm text-gray-600 mt-1">
                  {myGroup.member_count} members • Created by {myGroup.creator_name}
                </p>
              </div>
              {myGroup.is_leader && (
                <Button onClick={() => setShowAddMemberModal(true)} className="text-sm">
                  + Add Member
                </Button>
              )}
            </div>

            {myGroup.is_leader && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm text-blue-800">
                  <strong>You are the group leader.</strong> You can add or remove members and acknowledge group assignments.
                </p>
              </div>
            )}
          </Card>

          {/* Members Card */}
          <Card>
            <h3 className="text-xl font-bold text-gray-800 mb-4">Group Members</h3>
            
            {members.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No members yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {members.map((member) => (
                  <div 
                    key={member.id} 
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold">
                        {member.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">{member.name}</p>
                        <p className="text-sm text-gray-600">{member.email}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        member.role === 'leader' 
                          ? 'bg-yellow-100 text-yellow-800' 
                          : 'bg-gray-200 text-gray-700'
                      }`}>
                        {member.role === 'leader' ? '👑 Leader' : 'Member'}
                      </span>
                      
                      {myGroup.is_leader && member.role !== 'leader' && (
                        <button
                          onClick={() => handleRemoveMember(member.id)}
                          className="text-red-600 hover:text-red-700 text-sm font-medium ml-2"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Instructions Card */}
          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200">
            <h3 className="text-lg font-bold text-blue-900 mb-3">💡 How to Submit Assignments</h3>
            <ul className="space-y-2 text-sm text-blue-800">
              <li className="flex items-start gap-2">
                <span className="font-bold">1.</span>
                <span>Go to the Assignments page for this course</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold">2.</span>
                <span>Upload your work to the OneDrive link provided</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold">3.</span>
                <span>
                  {myGroup.is_leader 
                    ? 'As the group leader, acknowledge the submission (this will mark it as submitted for all group members)'
                    : 'The group leader will acknowledge the submission once uploaded'
                  }
                </span>
              </li>
            </ul>
          </Card>
        </div>
      ) : (
        <Card className="text-center py-12">
          <div className="text-6xl mb-4">👥</div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">You're not in any group for this course</h3>
          <p className="text-gray-600 mb-6">Create a group to collaborate with your classmates</p>
          <Button onClick={() => setShowCreateModal(true)}>
            Create a Group
          </Button>
        </Card>
      )}

      {/* Create Group Modal */}
      <Modal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} title="Create New Group">
        <form onSubmit={handleCreateGroup}>
          <Input
            label="Group Name"
            type="text"
            placeholder="e.g., Team Alpha, Study Group 1"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            error={error}
            required
          />
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> You will be the group leader and can add members after creating the group.
            </p>
          </div>
          <div className="flex gap-3">
            <Button type="button" variant="secondary" onClick={() => setShowCreateModal(false)} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1" disabled={creating}>
              {creating ? 'Creating...' : 'Create Group'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Add Member Modal */}
      <Modal isOpen={showAddMemberModal} onClose={() => setShowAddMemberModal(false)} title="Add Group Member">
        <form onSubmit={handleAddMember}>
          <Input
            label="Student Email"
            type="email"
            placeholder="student@example.com"
            value={memberEmail}
            onChange={(e) => setMemberEmail(e.target.value)}
            error={addError}
            required
          />
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
            <p className="text-sm text-yellow-800">
              <strong>Important:</strong> The student must be registered in the system and enrolled in this course.
            </p>
          </div>
          <div className="flex gap-3">
            <Button 
              type="button" 
              variant="secondary" 
              onClick={() => {
                setShowAddMemberModal(false);
                setMemberEmail('');
                setAddError('');
              }} 
              className="flex-1"
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1" disabled={adding}>
              {adding ? 'Adding...' : 'Add Member'}
            </Button>
          </div>
        </form>
      </Modal>
    </Layout>
  );
}