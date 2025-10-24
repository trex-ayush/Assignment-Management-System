import { useState, useEffect } from "react";
import Modal from "../../components/common/Modal";
import Card from "../../components/common/Card";
import { assignmentAPI } from "../../services/api";
import { formatDate } from "../../utils/helpers";

export default function AssignmentAnalytics({ isOpen, onClose, assignmentId }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen && assignmentId) {
      loadAnalytics();
    }
  }, [isOpen, assignmentId]);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      const response = await assignmentAPI.getAnalytics(assignmentId);
      setData(response.data);
    } catch (err) {
      console.error("Failed to load analytics:", err);
    } finally {
      setLoading(false);
    }
  };

  const total = data?.stats?.total_groups || 0;
  const submitted = data?.stats?.submitted_count || 0;
  const progress = total > 0 ? Math.round((submitted / total) * 100) : 0;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Assignment Analytics">
      {loading ? (
        <div className="text-center py-8">
          <p className="text-gray-600">Loading analytics...</p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-4 gap-4">
            <Card>
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">Total Groups</p>
                <p className="text-3xl font-bold text-primary-600">{total}</p>
              </div>
            </Card>
            <Card>
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">Submitted</p>
                <p className="text-3xl font-bold text-green-600">{submitted}</p>
              </div>
            </Card>
            <Card>
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">Pending</p>
                <p className="text-3xl font-bold text-yellow-600">
                  {data?.stats?.pending_count || 0}
                </p>
              </div>
            </Card>
            <Card>
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">Progress</p>
                <p className="text-3xl font-bold text-blue-600">{progress}%</p>
              </div>
            </Card>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-2">Overall Progress</h3>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div
                className="bg-blue-600 h-4 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <p className="text-right text-sm text-gray-600 mt-1">
              {submitted} of {total} groups submitted
            </p>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-3">Group Breakdown</h3>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {data?.groupBreakdown?.map((group) => (
                <Card key={group.id} className="!p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{group.name}</p>
                      <p className="text-sm text-gray-600">
                        {group.member_count} members
                      </p>
                      {group.submitted && (
                        <p className="text-xs text-green-600 mt-1">
                          Submitted by {group.submitted_by_name} on{" "}
                          {formatDate(group.submitted_at)}
                        </p>
                      )}
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        group.submitted
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {group.submitted ? "Submitted" : "Pending"}
                    </span>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
}
