const pool = require("../config/db");

const createAcknowledgment = async ({ assignment_id, user_id, group_id }) => {
  const result = await pool.query(
    `INSERT INTO acknowledgments (assignment_id, user_id, group_id) 
     VALUES ($1, $2, $3) 
     RETURNING *`,
    [assignment_id, user_id, group_id]
  );
  return result.rows[0];
};

const findAcknowledgmentByAssignmentAndUser = async (assignmentId, userId) => {
  const result = await pool.query(
    `SELECT * FROM acknowledgments 
     WHERE assignment_id = $1 AND user_id = $2`,
    [assignmentId, userId]
  );
  return result.rows[0];
};

const findAcknowledgmentsByAssignment = async (assignmentId) => {
  const result = await pool.query(
    `SELECT ack.*, u.name as user_name, g.name as group_name
     FROM acknowledgments ack
     JOIN users u ON ack.user_id = u.id
     LEFT JOIN groups g ON ack.group_id = g.id
     WHERE ack.assignment_id = $1
     ORDER BY ack.acknowledged_at DESC`,
    [assignmentId]
  );
  return result.rows;
};

const findAcknowledgmentsByUser = async (userId) => {
  const result = await pool.query(
    `SELECT ack.*, a.title, a.description, a.deadline, c.name as course_name
     FROM acknowledgments ack
     JOIN assignments a ON ack.assignment_id = a.id
     JOIN courses c ON a.course_id = c.id
     WHERE ack.user_id = $1
     ORDER BY ack.acknowledged_at DESC`,
    [userId]
  );
  return result.rows;
};

const acknowledgeForGroupMembers = async (assignmentId, groupId, acknowledgedBy) => {
  const client = await pool.connect();
  
  try {
    await client.query("BEGIN");

    const members = await client.query(
      `SELECT user_id FROM group_members WHERE group_id = $1`,
      [groupId]
    );

    for (const member of members.rows) {
      await client.query(
        `INSERT INTO acknowledgments (assignment_id, user_id, group_id) 
         VALUES ($1, $2, $3)
         ON CONFLICT (assignment_id, user_id) DO NOTHING`,
        [assignmentId, member.user_id, groupId]
      );
    }

    await client.query("COMMIT");
    return true;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

module.exports = {
  createAcknowledgment,
  findAcknowledgmentByAssignmentAndUser,
  findAcknowledgmentsByAssignment,
  findAcknowledgmentsByUser,
  acknowledgeForGroupMembers,
};