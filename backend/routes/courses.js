const express = require("express");
const router = express.Router();
const {
  createCourseController,
  getMyCourses,
  getCourseDetails,
  enrollStudentController,
} = require("../controllers/courseController");
const { authenticateToken, isAdmin } = require("../middleware/auth");

router.post("/", authenticateToken, isAdmin, createCourseController);
router.get("/my-courses", authenticateToken, getMyCourses);
router.get("/:courseId", authenticateToken, getCourseDetails);
router.post("/:courseId/enroll", authenticateToken, isAdmin, enrollStudentController);

module.exports = router;