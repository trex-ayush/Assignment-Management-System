const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const authRoutes = require("./routes/auth");
const assignmentRoutes = require("./routes/assignments");
const groupRoutes = require("./routes/groups");
const submissionRoutes = require("./routes/submissions");
const statsRoutes = require("./routes/stats");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser());

const allowedOrigin = process.env.CLIENT_URL;

app.use(cors({
  origin: allowedOrigin,
  credentials: true
}));

app.use("/api/auth", authRoutes);
app.use("/api/assignments", assignmentRoutes);
app.use("/api/groups", groupRoutes);
app.use("/api/submissions", submissionRoutes);
app.use("/api/stats", statsRoutes);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});