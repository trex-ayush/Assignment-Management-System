const express = require("express");
const router = express.Router();
const {
  register,
  login,
  getProfile,
  logout,
} = require("../controllers/authController");
const { authenticateToken, isAdmin } = require("../middleware/auth");
const { findAllUsers } = require("../models/userModel");

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/profile", authenticateToken, getProfile);

router.get("/users", authenticateToken, isAdmin, async (req, res) => {
  try {
    const { role } = req.query;
    const users = await findAllUsers(role);
    res.json(users);
  } catch (error) {
    console.error("Get users error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;