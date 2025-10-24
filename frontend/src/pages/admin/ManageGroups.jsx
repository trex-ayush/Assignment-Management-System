import { useState, useEffect } from 'react';
import Layout from '../../components/layout/Layout';
import Card from '../../components/common/Card';
import { groupAPI } from '../../services/api';

export default function ManageGroups() {
  const [groups, setGroups] = useState([]);
  const [expandedGroup, setExpandedGroup] = useState(null);
  const [members, setMembers] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadGroups();
  }, []);

  const loadGroups = async () => {
    try {
      const response = await groupAPI.getAll();
      setGroups(response.data);
    } catch (err) {
      console.error('Failed to load groups:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleGroupDetails = async (groupId) => {
    if (expandedGroup === groupId) {
      setExpandedGroup(null);
      return;
    }

    try {
      const response = await groupAPI.getById(groupId);
      setMembers({ ...members, [groupId]: response.data.members });
      setExpandedGroup(groupId);
    } catch (err) {
      console.error('Failed to load group details:', err);
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
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Manage Groups</h1>
        <p className="text-gray-600 mt-2">View and monitor student groups</p>
      </div>

      {groups.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No groups created yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {groups.map((group) => (
            <Card key={group.id}>
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

              <button
                onClick={() => toggleGroupDetails(group.id)}
                className="text-primary-600 hover:underline text-sm"
              >
                {expandedGroup === group.id ? 'Hide Members' : 'View Members'}
              </button>

              {expandedGroup === group.id && members[group.id] && (
                <div className="mt-4 pt-4 border-t">
                  <h4 className="font-semibold mb-3">Members</h4>
                  <div className="space-y-2">
                    {members[group.id].map((member) => (
                      <div key={member.id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                        <div>
                          <p className="font-medium">{member.name}</p>
                          <p className="text-sm text-gray-600">{member.email}</p>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded ${
                          member.role === 'leader' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-200'
                        }`}>
                          {member.role}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </Layout>
  );
}