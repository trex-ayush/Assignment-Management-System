const express = require("express");
const router = express.Router();
const {
  createGroupController,
  getMyGroups,
  getGroupDetails,
  addMember,
  removeMember,
  getAllGroupsController,
} = require("../controllers/groupController");
const { authenticateToken, isAdmin, isStudent } = require("../middleware/auth");

// Student
router.post("/", authenticateToken, isStudent, createGroupController);
router.get("/my-groups", authenticateToken, isStudent, getMyGroups);
router.get("/:groupId", authenticateToken, getGroupDetails);
router.post("/:groupId/members", authenticateToken, isStudent, addMember);
router.delete("/:groupId/members/:memberId", authenticateToken, isStudent, removeMember);

// Admin
router.get("/", authenticateToken, isAdmin, getAllGroupsController);

module.exports = router;