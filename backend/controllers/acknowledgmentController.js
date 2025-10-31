const {
  createAcknowledgment,
  findAcknowledgmentByAssignmentAndUser,
  acknowledgeForGroupMembers,
} = require("../models/acknowledgmentModel");
const { findAssignmentById } = require("../models/assignmentModel");
const { isGroupMember, isGroupLeader } = require("../models/groupModel");

const acknowledgeAssignment = async (req, res) => {
  const { assignmentId, groupId } = req.body;

  try {
    if (!assignmentId) {
      return res.status(400).json({ error: "Assignment ID is required" });
    }

    const assignment = await findAssignmentById(assignmentId);
    if (!assignment) {
      return res.status(404).json({ error: "Assignment not found" });
    }

    const existing = await findAcknowledgmentByAssignmentAndUser(assignmentId, req.user.id);
    if (existing) {
      return res.status(409).json({ error: "Already acknowledged" });
    }

    if (assignment.submission_type === 'group') {
      if (!groupId) {
        return res.status(400).json({ error: "Group ID required for group assignments" });
      }

      const isLeader = await isGroupLeader(groupId, req.user.id);
      if (!isLeader) {
        return res.status(403).json({ error: "Only group leader can acknowledge" });
      }

      await acknowledgeForGroupMembers(assignmentId, groupId, req.user.id);

      res.status(201).json({
        message: "Assignment acknowledged for entire group",
      });
    } else {
      const acknowledgment = await createAcknowledgment({
        assignment_id: assignmentId,
        user_id: req.user.id,
        group_id: null,
      });

      res.status(201).json({
        message: "Assignment acknowledged successfully",
        acknowledgment,
      });
    }
  } catch (error) {
    console.error("Acknowledge assignment error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  acknowledgeAssignment,
};