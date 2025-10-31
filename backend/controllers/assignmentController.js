const {
  createAssignment,
  findAssignmentById,
  findAssignmentsByCourse,
  findAssignmentsByCourseForStudent,
  updateAssignment,
  deleteAssignment,
  getAssignmentStats,
} = require("../models/assignmentModel");
const { findAcknowledgmentsByAssignment } = require("../models/acknowledgmentModel");

const createAssignmentController = async (req, res) => {
  const { course_id, title, description, deadline, onedrive_link, submission_type } = req.body;

  try {
    if (!course_id || !title || !description || !deadline || !onedrive_link || !submission_type) {
      return res.status(400).json({ error: "All fields are required" });
    }

    if (!['individual', 'group'].includes(submission_type)) {
      return res.status(400).json({ error: "Invalid submission type" });
    }

    const assignment = await createAssignment({
      course_id,
      title: title.trim(),
      description: description.trim(),
      deadline,
      onedrive_link,
      submission_type,
      created_by: req.user.id,
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

const getCourseAssignments = async (req, res) => {
  const { courseId } = req.params;

  try {
    const assignments = req.user.role === 'admin'
      ? await findAssignmentsByCourse(courseId)
      : await findAssignmentsByCourseForStudent(courseId, req.user.id);

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

    const acknowledgments = await findAcknowledgmentsByAssignment(assignmentId);
    const stats = await getAssignmentStats(assignmentId);

    res.json({
      assignment,
      acknowledgments,
      stats,
    });
  } catch (error) {
    console.error("Get assignment details error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const updateAssignmentController = async (req, res) => {
  const { assignmentId } = req.params;
  const { title, description, deadline, onedrive_link, submission_type } = req.body;

  try {
    const existing = await findAssignmentById(assignmentId);

    if (!existing || existing.created_by !== req.user.id) {
      return res.status(404).json({ error: "Assignment not found or unauthorized" });
    }

    const assignment = await updateAssignment(assignmentId, {
      title: title?.trim(),
      description: description?.trim(),
      deadline,
      onedrive_link,
      submission_type,
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
      return res.status(404).json({ error: "Assignment not found or unauthorized" });
    }

    await deleteAssignment(assignmentId);

    res.json({ message: "Assignment deleted successfully" });
  } catch (error) {
    console.error("Delete assignment error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  createAssignmentController,
  getCourseAssignments,
  getAssignmentDetails,
  updateAssignmentController,
  deleteAssignmentController,
};