import { useState, useEffect } from 'react';
import Layout from '../../components/layout/Layout';
import Card from '../../components/common/Card';
import { submissionAPI } from '../../services/api';
import { formatDate } from '../../utils/helpers';

export default function Submissions() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSubmissions();
  }, []);

  const loadSubmissions = async () => {
    try {
      const response = await submissionAPI.getMySubmissions();
      setSubmissions(response.data);
    } catch (err) {
      console.error('Failed to load submissions:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-600">Loading submissions...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">My Submissions</h1>
        <p className="text-gray-600 mt-2">Track your submitted assignments</p>
      </div>

      {submissions.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No submissions yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {submissions.map((submission) => (
            <Card key={submission.id}>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-800 mb-2">
                    {submission.title}
                  </h3>
                  <p className="text-gray-600 mb-3">{submission.description}</p>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Group: </span>
                      <span className="font-medium">{submission.group_name}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Submitted by: </span>
                      <span className="font-medium">{submission.submitted_by_name}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Due Date: </span>
                      <span className="font-medium">{formatDate(submission.due_date)}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Submitted at: </span>
                      <span className="font-medium text-green-600">
                        {formatDate(submission.submitted_at)}
                      </span>
                    </div>
                  </div>
                </div>
                
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium ml-4">
                  Submitted
                </span>
              </div>
            </Card>
          ))}
        </div>
      )}
    </Layout>
  );
}