const express = require("express");
const router = express.Router();
const {
  createAssignmentController,
  getCourseAssignments,
  getAssignmentDetails,
  updateAssignmentController,
  deleteAssignmentController,
} = require("../controllers/assignmentController");
const { authenticateToken, isAdmin } = require("../middleware/auth");

router.post("/", authenticateToken, isAdmin, createAssignmentController);
router.get("/course/:courseId", authenticateToken, getCourseAssignments);
router.get("/:assignmentId", authenticateToken, getAssignmentDetails);
router.put("/:assignmentId", authenticateToken, isAdmin, updateAssignmentController);
router.delete("/:assignmentId", authenticateToken, isAdmin, deleteAssignmentController);

module.exports = router;