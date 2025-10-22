const express = require("express");
const router = express.Router();
const {
  submitAssignment,
  getMySubmissions,
  getGroupSubmissions,
  deleteSubmissionController,
  checkSubmissionStatus,
} = require("../controllers/submissionController");
const { authenticateToken, isStudent } = require("../middleware/auth");

router.post("/", authenticateToken, isStudent, submitAssignment);
router.get("/my-submissions", authenticateToken, isStudent, getMySubmissions);
router.get("/group/:groupId", authenticateToken, getGroupSubmissions);
router.get("/status/:assignmentId/:groupId", authenticateToken, checkSubmissionStatus);
router.delete("/:submissionId", authenticateToken, deleteSubmissionController);

module.exports = router;