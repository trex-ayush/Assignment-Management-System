const pool = require("../config/db");

const createAssignment = async ({
  course_id,
  title,
  description,
  deadline,
  onedrive_link,
  submission_type,
  created_by,
}) => {
  const result = await pool.query(
    `INSERT INTO assignments (course_id, title, description, deadline, onedrive_link, submission_type, created_by) 
     VALUES ($1, $2, $3, $4, $5, $6, $7) 
     RETURNING *`,
    [course_id, title, description, deadline, onedrive_link, submission_type, created_by]
  );
  return result.rows[0];
};

const findAssignmentById = async (id) => {
  const result = await pool.query(
    `SELECT a.*, u.name as professor_name, c.name as course_name, c.code as course_code
     FROM assignments a
     JOIN users u ON a.created_by = u.id
     JOIN courses c ON a.course_id = c.id
     WHERE a.id = $1`,
    [id]
  );
  return result.rows[0];
};

const findAssignmentsByCourse = async (courseId) => {
  const result = await pool.query(
    `SELECT a.*, u.name as professor_name,
            COUNT(DISTINCT ack.id) as total_acknowledgments
     FROM assignments a
     JOIN users u ON a.created_by = u.id
     LEFT JOIN acknowledgments ack ON a.id = ack.assignment_id
     WHERE a.course_id = $1
     GROUP BY a.id, u.name
     ORDER BY a.deadline DESC`,
    [courseId]
  );
  return result.rows;
};

const findAssignmentsByCourseForStudent = async (courseId, studentId) => {
  const result = await pool.query(
    `SELECT a.*, 
            u.name as professor_name,
            CASE WHEN ack.id IS NOT NULL THEN true ELSE false END as is_acknowledged,
            ack.acknowledged_at
     FROM assignments a
     JOIN users u ON a.created_by = u.id
     LEFT JOIN acknowledgments ack ON a.id = ack.assignment_id AND ack.user_id = $2
     WHERE a.course_id = $1
     ORDER BY a.deadline ASC`,
    [courseId, studentId]
  );
  return result.rows;
};

const updateAssignment = async (id, data) => {
  const fields = [];
  const values = [];
  let paramCount = 1;

  const allowedFields = ["title", "description", "deadline", "onedrive_link", "submission_type"];

  allowedFields.forEach((key) => {
    if (data[key] !== undefined) {
      fields.push(`${key} = $${paramCount}`);
      values.push(data[key]);
      paramCount++;
    }
  });

  if (fields.length === 0) {
    throw new Error("No fields to update");
  }

  values.push(id);

  const result = await pool.query(
    `UPDATE assignments SET ${fields.join(", ")} 
     WHERE id = $${paramCount} 
     RETURNING *`,
    values
  );
  return result.rows[0];
};

const deleteAssignment = async (id) => {
  const result = await pool.query(
    "DELETE FROM assignments WHERE id = $1 RETURNING *",
    [id]
  );
  return result.rows[0];
};

const getAssignmentStats = async (assignmentId) => {
  const assignment = await findAssignmentById(assignmentId);
  
  if (assignment.submission_type === 'individual') {
    const result = await pool.query(
      `SELECT 
         (SELECT COUNT(*) FROM course_enrollments WHERE course_id = $1) as total_students,
         COUNT(DISTINCT ack.user_id) as acknowledged_count,
         (SELECT COUNT(*) FROM course_enrollments WHERE course_id = $1) - COUNT(DISTINCT ack.user_id) as pending_count
       FROM acknowledgments ack
       WHERE ack.assignment_id = $2`,
      [assignment.course_id, assignmentId]
    );
    return result.rows[0];
  } else {
    const result = await pool.query(
      `SELECT 
         (SELECT COUNT(*) FROM groups WHERE course_id = $1) as total_groups,
         COUNT(DISTINCT ack.group_id) as acknowledged_count,
         (SELECT COUNT(*) FROM groups WHERE course_id = $1) - COUNT(DISTINCT ack.group_id) as pending_count
       FROM acknowledgments ack
       WHERE ack.assignment_id = $2 AND ack.group_id IS NOT NULL`,
      [assignment.course_id, assignmentId]
    );
    return result.rows[0];
  }
};

module.exports = {
  createAssignment,
  findAssignmentById,
  findAssignmentsByCourse,
  findAssignmentsByCourseForStudent,
  updateAssignment,
  deleteAssignment,
  getAssignmentStats,
};