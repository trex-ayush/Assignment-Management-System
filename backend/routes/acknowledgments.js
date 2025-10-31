const express = require("express");
const router = express.Router();
const { acknowledgeAssignment } = require("../controllers/acknowledgmentController");
const { authenticateToken, isStudent } = require("../middleware/auth");

router.post("/", authenticateToken, isStudent, acknowledgeAssignment);

module.exports = router;