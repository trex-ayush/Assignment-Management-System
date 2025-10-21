const express = require("express");
const router = express.Router();
const {
  createAssignmentController,
  getAllAssignmentsController,
  getAssignmentDetails,
  updateAssignmentController,
  deleteAssignmentController,
  getAssignmentAnalytics,
} = require("../controllers/assignmentController");
const { authenticateToken, isAdmin } = require("../middleware/auth");

router.post("/", authenticateToken, isAdmin, createAssignmentController);
router.get("/", authenticateToken, getAllAssignmentsController);
router.get("/:assignmentId", authenticateToken, getAssignmentDetails);
router.put("/:assignmentId", authenticateToken, isAdmin, updateAssignmentController);
router.delete("/:assignmentId", authenticateToken, isAdmin, deleteAssignmentController);
router.get("/:assignmentId/analytics", authenticateToken, isAdmin, getAssignmentAnalytics);

module.exports = router;