const {
  createAssignment,
  findAssignmentById,
  findAllAssignments,
  updateAssignment,
  deleteAssignment,
  getAssignmentTargetGroups,
  getAssignmentSubmissionStats,
} = require("../models/assignmentModel");
const { findSubmissionsByAssignment } = require("../models/submissionModel");

const createAssignmentController = async (req, res) => {
  const {
    title,
    description,
    due_date,
    onedrive_link,
    assign_to_all,
    target_groups,
  } = req.body;

  try {
    if (!title || !description || !due_date || !onedrive_link) {
      return res.status(400).json({ error: "All fields are required" });
    }

    if (
      assign_to_all === false &&
      (!target_groups || target_groups.length === 0)
    ) {
      return res
        .status(400)
        .json({ error: "Please select at least one group" });
    }

    const assignment = await createAssignment({
      title: title.trim(),
      description: description.trim(),
      due_date,
      onedrive_link,
      created_by: req.user.id,
      assign_to_all: assign_to_all !== false,
      target_groups: assign_to_all === false ? target_groups : null,
    });

    res.status(201).json({
      message: "Assignment created successfully",
      assignment,
    });
  } catch (error) {
    console.error("Create assignment error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getAllAssignmentsController = async (req, res) => {
  try {
    const assignments = await findAllAssignments();
    res.json(assignments);
  } catch (error) {
    console.error("Get assignments error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getAssignmentDetails = async (req, res) => {
  const { assignmentId } = req.params;

  try {
    const assignment = await findAssignmentById(assignmentId);

    if (!assignment) {
      return res.status(404).json({ error: "Assignment not found" });
    }

    const submissions = await findSubmissionsByAssignment(assignmentId);
    const targetGroups = await getAssignmentTargetGroups(assignmentId);
    const stats = await getAssignmentSubmissionStats(assignmentId);

    res.json({
      assignment,
      submissions,
      targetGroups,
      stats,
    });
  } catch (error) {
    console.error("Get assignment details error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const updateAssignmentController = async (req, res) => {
  const { assignmentId } = req.params;
  const { title, description, due_date, onedrive_link, assign_to_all } =
    req.body;

  try {
    const existing = await findAssignmentById(assignmentId);

    if (!existing || existing.created_by !== req.user.id) {
      return res
        .status(404)
        .json({ error: "Assignment not found or unauthorized" });
    }

    const assignment = await updateAssignment(assignmentId, {
      title: title?.trim(),
      description: description?.trim(),
      due_date,
      onedrive_link,
      assign_to_all,
    });

    res.json({
      message: "Assignment updated successfully",
      assignment,
    });
  } catch (error) {
    console.error("Update assignment error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const deleteAssignmentController = async (req, res) => {
  const { assignmentId } = req.params;

  try {
    const existing = await findAssignmentById(assignmentId);

    if (!existing || existing.created_by !== req.user.id) {
      return res
        .status(404)
        .json({ error: "Assignment not found or unauthorized" });
    }

    await deleteAssignment(assignmentId);

    res.json({ message: "Assignment deleted successfully" });
  } catch (error) {
    console.error("Delete assignment error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getAssignmentAnalytics = async (req, res) => {
  const { assignmentId } = req.params;

  try {
    const assignment = await findAssignmentById(assignmentId);

    if (!assignment) {
      return res.status(404).json({ error: "Assignment not found" });
    }

    const stats = await getAssignmentSubmissionStats(assignmentId);
    const submissions = await findSubmissionsByAssignment(assignmentId);
    const targetGroups = await getAssignmentTargetGroups(assignmentId);

    const groupBreakdown = targetGroups.map((group) => {
      const submission = submissions.find((s) => s.group_id === group.id);
      return {
        ...group,
        submitted: !!submission,
        submitted_at: submission?.submitted_at,
        submitted_by_name: submission?.submitted_by_name,
        group_members: submission?.group_members || [],
      };
    });

    res.json({
      assignment,
      stats,
      groupBreakdown,
      submissions,
    });
  } catch (error) {
    console.error("Get analytics error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  createAssignmentController,
  getAllAssignmentsController,
  getAssignmentDetails,
  updateAssignmentController,
  deleteAssignmentController,
  getAssignmentAnalytics,
};
