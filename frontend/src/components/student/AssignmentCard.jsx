import { useState } from 'react';
import Card from '../common/Card';
import Button from '../common/Button';

export default function AssignmentCard({ assignment, onAcknowledge, userGroup }) {
  const [showConfirm, setShowConfirm] = useState(false);
  const isOverdue = new Date(assignment.deadline) < new Date();
  const isAcknowledged = assignment.is_acknowledged;
  const isGroupAssignment = assignment.submission_type === 'group';
  const isGroupLeader = userGroup?.is_leader;
  const canAcknowledge = isGroupAssignment ? isGroupLeader : true;

  const handleAcknowledge = () => {
    if (!canAcknowledge) return;
    setShowConfirm(true);
  };

  const confirmAcknowledge = () => {
    onAcknowledge(assignment.id, isGroupAssignment ? userGroup?.id : null);
    setShowConfirm(false);
  };

  return (
    <>
      <Card className={`${isAcknowledged ? 'bg-green-50 border-green-200' : ''} animate-slideIn`}>
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-lg font-bold text-gray-800">{assignment.title}</h3>
              {isAcknowledged && (
                <span className="badge badge-success">
                  ✓ Acknowledged
                </span>
              )}
              {isOverdue && !isAcknowledged && (
                <span className="badge badge-danger">
                  Overdue
                </span>
              )}
            </div>
            <p className="text-sm text-gray-600 line-clamp-2">{assignment.description}</p>
          </div>
        </div>

        <div className="space-y-2 text-sm mb-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-700">Deadline:</span>
            <span className={isOverdue ? 'text-red-600 font-medium' : 'text-gray-600'}>
              {new Date(assignment.deadline).toLocaleString()}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-700">Type:</span>
            <span className={`badge ${isGroupAssignment ? 'badge-info' : 'badge-warning'}`}>
              {assignment.submission_type}
            </span>
          </div>
          {isGroupAssignment && !userGroup && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mt-2">
              <p className="text-sm text-yellow-800">
                ⚠️ You are not part of any group. Form or join one to submit this assignment.
              </p>
            </div>
          )}
          {isGroupAssignment && userGroup && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-2">
              <p className="text-sm text-blue-800">
                Group: <span className="font-semibold">{userGroup.name}</span>
                {isGroupLeader && <span className="ml-2 badge badge-warning">Leader</span>}
              </p>
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <a
            href={assignment.onedrive_link}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-secondary flex-1 text-center text-sm"
          >
            📁 View OneDrive
          </a>
          {!isAcknowledged && (
            <>
              {canAcknowledge ? (
                <Button onClick={handleAcknowledge} className="flex-1 text-sm">
                  ✓ Acknowledge
                </Button>
              ) : (
                <div className="flex-1 text-center text-xs text-gray-500 py-2">
                  Only group leader can acknowledge
                </div>
              )}
            </>
          )}
        </div>
      </Card>

      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full animate-fadeIn">
            <h3 className="text-lg font-bold mb-4">Confirm Acknowledgment</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you have submitted this assignment to OneDrive?
              {isGroupAssignment && ' This will acknowledge for your entire group.'}
            </p>
            <div className="flex gap-3">
              <Button variant="secondary" onClick={() => setShowConfirm(false)} className="flex-1">
                Cancel
              </Button>
              <Button onClick={confirmAcknowledge} className="flex-1">
                Yes, I have submitted
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}