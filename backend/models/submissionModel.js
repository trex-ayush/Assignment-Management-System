const pool = require("../config/db");

const createSubmission = async ({ assignment_id, group_id, submitted_by }) => {
  const result = await pool.query(
    `INSERT INTO submissions (assignment_id, group_id, submitted_by) 
     VALUES ($1, $2, $3) 
     RETURNING *`,
    [assignment_id, group_id, submitted_by]
  );
  return result.rows[0];
};

const findSubmissionById = async (id) => {
  const result = await pool.query(
    "SELECT * FROM submissions WHERE id = $1",
    [id]
  );
  return result.rows[0];
};

const findSubmissionByAssignmentAndGroup = async (assignmentId, groupId) => {
  const result = await pool.query(
    `SELECT s.*, u.name as submitted_by_name
     FROM submissions s
     LEFT JOIN users u ON s.submitted_by = u.id
     WHERE s.assignment_id = $1 AND s.group_id = $2`,
    [assignmentId, groupId]
  );
  return result.rows[0];
};

const findSubmissionsByGroup = async (groupId) => {
  const result = await pool.query(
    `SELECT s.*, a.title, a.description, a.due_date, a.onedrive_link,
            u.name as submitted_by_name
     FROM submissions s
     JOIN assignments a ON s.assignment_id = a.id
     LEFT JOIN users u ON s.submitted_by = u.id
     WHERE s.group_id = $1
     ORDER BY s.submitted_at DESC`,
    [groupId]
  );
  return result.rows;
};

const findSubmissionsByStudent = async (userId) => {
  const result = await pool.query(
    `SELECT s.*, a.title, a.description, a.due_date,
            g.name as group_name, u.name as submitted_by_name,
            gm.role as my_role
     FROM submissions s
     JOIN assignments a ON s.assignment_id = a.id
     JOIN groups g ON s.group_id = g.id
     JOIN group_members gm ON g.id = gm.group_id
     LEFT JOIN users u ON s.submitted_by = u.id
     WHERE gm.user_id = $1
     ORDER BY s.submitted_at DESC`,
    [userId]
  );
  return result.rows;
};

const findSubmissionsByAssignment = async (assignmentId) => {
  const result = await pool.query(
    `SELECT s.*, g.name as group_name, 
            u.name as submitted_by_name,
            COUNT(gm.user_id) as group_size,
            json_agg(json_build_object(
              'id', gm_users.id,
              'name', gm_users.name,
              'email', gm_users.email,
              'role', gm.role
            )) as group_members
     FROM submissions s
     JOIN groups g ON s.group_id = g.id
     LEFT JOIN users u ON s.submitted_by = u.id
     LEFT JOIN group_members gm ON g.id = gm.group_id
     LEFT JOIN users gm_users ON gm.user_id = gm_users.id
     WHERE s.assignment_id = $1
     GROUP BY s.id, g.name, u.name
     ORDER BY s.submitted_at DESC`,
    [assignmentId]
  );
  return result.rows;
};

const deleteSubmission = async (id) => {
  const result = await pool.query(
    "DELETE FROM submissions WHERE id = $1 RETURNING *",
    [id]
  );
  return result.rows[0];
};

const countSubmissionsByAssignment = async (assignmentId) => {
  const result = await pool.query(
    "SELECT COUNT(*) as count FROM submissions WHERE assignment_id = $1",
    [assignmentId]
  );
  return parseInt(result.rows[0].count);
};

module.exports = {
  createSubmission,
  findSubmissionById,
  findSubmissionByAssignmentAndGroup,
  findSubmissionsByGroup,
  findSubmissionsByStudent,
  findSubmissionsByAssignment,
  deleteSubmission,
  countSubmissionsByAssignment,
};