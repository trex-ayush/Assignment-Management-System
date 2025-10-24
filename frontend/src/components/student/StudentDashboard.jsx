import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import Card from '../../components/common/Card';
import { statsAPI, assignmentAPI, groupAPI } from '../../services/api';

export default function StudentDashboard() {
  const [stats, setStats] = useState(null);
  const [recentAssignments, setRecentAssignments] = useState([]);
  const [myGroups, setMyGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [statsRes, assignmentsRes, groupsRes] = await Promise.all([
        statsAPI.getStudentStats(),
        assignmentAPI.getAll(),
        groupAPI.getMyGroups(),
      ]);

      setStats(statsRes.data);
      setRecentAssignments(assignmentsRes.data.slice(0, 5));
      setMyGroups(groupsRes.data.slice(0, 3));
    } catch (err) {
      console.error('Failed to load dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-600">Loading...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Student Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome back! Here's your overview.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <div className="text-center">
            <p className="text-gray-600 text-sm mb-2">My Groups</p>
            <p className="text-4xl font-bold text-primary-600">{stats?.my_groups || 0}</p>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <p className="text-gray-600 text-sm mb-2">Total Assignments</p>
            <p className="text-4xl font-bold text-primary-600">{stats?.total_assignments || 0}</p>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <p className="text-gray-600 text-sm mb-2">My Submissions</p>
            <p className="text-4xl font-bold text-green-600">{stats?.my_submissions || 0}</p>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Assignments */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Recent Assignments</h2>
            <Link to="/assignments" className="text-primary-600 hover:underline text-sm">
              View All
            </Link>
          </div>
          <div className="space-y-3">
            {recentAssignments.length === 0 ? (
              <Card>
                <p className="text-gray-500 text-center">No assignments yet</p>
              </Card>
            ) : (
              recentAssignments.map((assignment) => (
                <Card key={assignment.id}>
                  <h3 className="font-bold mb-1">{assignment.title}</h3>
                  <p className="text-sm text-gray-600 line-clamp-1">{assignment.description}</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Due: {new Date(assignment.due_date).toLocaleDateString()}
                  </p>
                </Card>
              ))
            )}
          </div>
        </div>

        {/* My Groups */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">My Groups</h2>
            <Link to="/groups" className="text-primary-600 hover:underline text-sm">
              View All
            </Link>
          </div>
          <div className="space-y-3">
            {myGroups.length === 0 ? (
              <Card>
                <p className="text-gray-500 text-center">No groups yet</p>
              </Card>
            ) : (
              myGroups.map((group) => (
                <Card key={group.id}>
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-bold">{group.name}</h3>
                      <p className="text-sm text-gray-600">{group.member_count} members</p>
                    </div>
                    <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded">
                      {group.creator_name}
                    </span>
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}