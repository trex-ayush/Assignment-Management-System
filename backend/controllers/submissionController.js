const {
  createSubmission,
  findSubmissionByAssignmentAndGroup,
  findSubmissionsByGroup,
  findSubmissionsByStudent,
  deleteSubmission,
  findSubmissionById,
} = require("../models/submissionModel");
const { findAssignmentById } = require("../models/assignmentModel");
const { isGroupMember } = require("../models/groupModel");

const submitAssignment = async (req, res) => {
  const { assignmentId, groupId } = req.body;

  try {
    if (!assignmentId || !groupId) {
      return res
        .status(400)
        .json({ error: "Assignment ID and Group ID are required" });
    }

    const assignment = await findAssignmentById(assignmentId);
    if (!assignment) {
      return res.status(404).json({ error: "Assignment not found" });
    }

    const isMember = await isGroupMember(groupId, req.user.id);
    if (!isMember) {
      return res
        .status(403)
        .json({ error: "You are not a member of this group" });
    }

    const existingSubmission = await findSubmissionByAssignmentAndGroup(
      assignmentId,
      groupId
    );
    if (existingSubmission) {
      return res.status(409).json({
        error: "Assignment already submitted by this group",
        submission: existingSubmission,
      });
    }

    const submission = await createSubmission({
      assignment_id: assignmentId,
      group_id: groupId,
      submitted_by: req.user.id,
    });

    res.status(201).json({
      message: "Assignment submitted successfully",
      submission,
    });
  } catch (error) {
    console.error("Submit assignment error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getMySubmissions = async (req, res) => {
  try {
    const submissions = await findSubmissionsByStudent(req.user.id);
    res.json(submissions);
  } catch (error) {
    console.error("Get submissions error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getGroupSubmissions = async (req, res) => {
  const { groupId } = req.params;

  try {
    const isMember = await isGroupMember(groupId, req.user.id);
    if (!isMember && req.user.role !== "admin") {
      return res.status(403).json({ error: "Access denied" });
    }

    const submissions = await findSubmissionsByGroup(groupId);
    res.json(submissions);
  } catch (error) {
    console.error("Get group submissions error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const deleteSubmissionController = async (req, res) => {
  const { submissionId } = req.params;

  try {
    const submission = await findSubmissionById(submissionId);

    if (!submission) {
      return res.status(404).json({ error: "Submission not found" });
    }

    if (submission.submitted_by !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ error: "Unauthorized" });
    }

    await deleteSubmission(submissionId);
    res.json({ message: "Submission deleted successfully" });
  } catch (error) {
    console.error("Delete submission error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const checkSubmissionStatus = async (req, res) => {
  const { assignmentId, groupId } = req.params;

  try {
    const submission = await findSubmissionByAssignmentAndGroup(
      assignmentId,
      groupId
    );

    if (!submission) {
      return res.json({ submitted: false });
    }

    res.json({
      submitted: true,
      submission,
    });
  } catch (error) {
    console.error("Check submission status error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  submitAssignment,
  getMySubmissions,
  getGroupSubmissions,
  deleteSubmissionController,
  checkSubmissionStatus,
};
