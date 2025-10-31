const pool = require("../config/db");

const createCourse = async ({ name, code, semester, professor_id }) => {
  const result = await pool.query(
    `INSERT INTO courses (name, code, semester, professor_id) 
     VALUES ($1, $2, $3, $4) 
     RETURNING *`,
    [name, code, semester, professor_id]
  );
  return result.rows[0];
};

const findCourseById = async (id) => {
  const result = await pool.query(
    `SELECT c.*, u.name as professor_name
     FROM courses c
     JOIN users u ON c.professor_id = u.id
     WHERE c.id = $1`,
    [id]
  );
  return result.rows[0];
};

const findCoursesByProfessor = async (professorId) => {
  const result = await pool.query(
    `SELECT c.*, 
            COUNT(DISTINCT ce.student_id) as total_students,
            COUNT(DISTINCT a.id) as total_assignments
     FROM courses c
     LEFT JOIN course_enrollments ce ON c.id = ce.course_id
     LEFT JOIN assignments a ON c.id = a.course_id
     WHERE c.professor_id = $1
     GROUP BY c.id
     ORDER BY c.created_at DESC`,
    [professorId]
  );
  return result.rows;
};

const findCoursesByStudent = async (studentId) => {
  const result = await pool.query(
    `SELECT c.*, u.name as professor_name,
            COUNT(DISTINCT a.id) as total_assignments,
            COUNT(DISTINCT ack.id) as acknowledged_count,
            COUNT(DISTINCT a.id) - COUNT(DISTINCT ack.id) as pending_count
     FROM courses c
     JOIN users u ON c.professor_id = u.id
     JOIN course_enrollments ce ON c.id = ce.course_id
     LEFT JOIN assignments a ON c.id = a.course_id
     LEFT JOIN acknowledgments ack ON a.id = ack.assignment_id AND ack.user_id = $1
     WHERE ce.student_id = $1
     GROUP BY c.id, u.name
     ORDER BY c.created_at DESC`,
    [studentId]
  );
  return result.rows;
};

const enrollStudent = async (courseId, studentId) => {
  const result = await pool.query(
    `INSERT INTO course_enrollments (course_id, student_id) 
     VALUES ($1, $2) 
     RETURNING *`,
    [courseId, studentId]
  );
  return result.rows[0];
};

const getEnrolledStudents = async (courseId) => {
  const result = await pool.query(
    `SELECT u.id, u.name, u.email, ce.enrolled_at
     FROM users u
     JOIN course_enrollments ce ON u.id = ce.student_id
     WHERE ce.course_id = $1
     ORDER BY u.name`,
    [courseId]
  );
  return result.rows;
};

const isStudentEnrolled = async (courseId, studentId) => {
  const result = await pool.query(
    `SELECT * FROM course_enrollments 
     WHERE course_id = $1 AND student_id = $2`,
    [courseId, studentId]
  );
  return result.rows.length > 0;
};

module.exports = {
  createCourse,
  findCourseById,
  findCoursesByProfessor,
  findCoursesByStudent,
  enrollStudent,
  getEnrolledStudents,
  isStudentEnrolled,
};