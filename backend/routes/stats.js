const express = require("express");
const router = express.Router();
const { authenticateToken, isAdmin, isStudent } = require("../middleware/auth");
const pool = require("../config/db");

// Admin Dashboard Statistics
router.get("/admin", authenticateToken, isAdmin, async (req, res) => {
  try {
    // Get basic counts
    const stats = await pool.query(`
      SELECT 
        (SELECT COUNT(*) FROM users WHERE role = 'student') as total_students,
        (SELECT COUNT(*) FROM groups) as total_groups,
        (SELECT COUNT(*) FROM assignments) as total_assignments,
        (SELECT COUNT(*) FROM submissions) as total_submissions
    `);

    res.json(stats.rows[0]);
  } catch (error) {
    console.error("Admin stats error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Student Dashboard Statistics
router.get("/student", authenticateToken, isStudent, async (req, res) => {
  try {
    const stats = await pool.query(`
      SELECT 
        (SELECT COUNT(*) FROM group_members WHERE user_id = $1) as my_groups,
        (SELECT COUNT(DISTINCT s.assignment_id) 
         FROM submissions s
         JOIN group_members gm ON s.group_id = gm.group_id
         WHERE gm.user_id = $1) as my_submissions,
        (SELECT COUNT(*) FROM assignments WHERE assign_to_all = true) as total_assignments
    `, [req.user.id]);

    res.json(stats.rows[0]);
  } catch (error) {
    console.error("Student stats error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;