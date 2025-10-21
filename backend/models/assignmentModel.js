const pool = require("../config/db");

const createAssignment = async ({
  title,
  description,
  due_date,
  onedrive_link,
  created_by,
  assign_to_all,
  target_groups,
}) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const result = await client.query(
      `INSERT INTO assignments (title, description, due_date, onedrive_link, created_by, assign_to_all) 
       VALUES ($1, $2, $3, $4, $5, $6) 
       RETURNING *`,
      [title, description, due_date, onedrive_link, created_by, assign_to_all !== false]
    );

    const assignment = result.rows[0];

    if (!assignment.assign_to_all && target_groups && target_groups.length > 0) {
      for (const groupId of target_groups) {
        await client.query(
          `INSERT INTO assignment_groups (assignment_id, group_id) 
           VALUES ($1, $2)`,
          [assignment.id, groupId]
        );
      }
    }

    await client.query("COMMIT");
    return assignment;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

const findAssignmentById = async (id) => {
  const result = await pool.query(
    `SELECT a.*, u.name as professor_name
     FROM assignments a
     JOIN users u ON a.created_by = u.id
     WHERE a.id = $1`,
    [id]
  );
  return result.rows[0];
};

const findAllAssignments = async () => {
  const result = await pool.query(
    `SELECT a.*, u.name as professor_name,
            COUNT(DISTINCT s.id) as total_submissions
     FROM assignments a
     JOIN users u ON a.created_by = u.id
     LEFT JOIN submissions s ON a.id = s.assignment_id
     GROUP BY a.id, u.name
     ORDER BY a.due_date DESC`
  );
  return result.rows;
};

const updateAssignment = async (id, data) => {
  const fields = [];
  const values = [];
  let paramCount = 1;

  const allowedFields = ["title", "description", "due_date", "onedrive_link", "assign_to_all"];

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

const getAssignmentTargetGroups = async (assignmentId) => {
  const assignment = await findAssignmentById(assignmentId);

  if (assignment.assign_to_all) {
    const result = await pool.query(
      `SELECT g.*, COUNT(gm.user_id) as member_count
       FROM groups g
       LEFT JOIN group_members gm ON g.id = gm.group_id
       GROUP BY g.id
       ORDER BY g.name`
    );
    return result.rows;
  } else {
    const result = await pool.query(
      `SELECT g.*, COUNT(gm.user_id) as member_count
       FROM groups g
       JOIN assignment_groups ag ON g.id = ag.group_id
       LEFT JOIN group_members gm ON g.id = gm.group_id
       WHERE ag.assignment_id = $1
       GROUP BY g.id
       ORDER BY g.name`,
      [assignmentId]
    );
    return result.rows;
  }
};

const getAssignmentSubmissionStats = async (assignmentId) => {
  const assignment = await findAssignmentById(assignmentId);

  if (assignment.assign_to_all) {
    const result = await pool.query(
      `SELECT 
         (SELECT COUNT(*) FROM groups) as total_groups,
         COUNT(DISTINCT s.id) as submitted_count,
         (SELECT COUNT(*) FROM groups) - COUNT(DISTINCT s.id) as pending_count
       FROM submissions s
       WHERE s.assignment_id = $1`,
      [assignmentId]
    );
    return result.rows[0];
  } else {
    const result = await pool.query(
      `SELECT 
         COUNT(DISTINCT ag.group_id) as total_groups,
         COUNT(DISTINCT s.id) as submitted_count,
         COUNT(DISTINCT ag.group_id) - COUNT(DISTINCT s.id) as pending_count
       FROM assignment_groups ag
       LEFT JOIN submissions s ON s.assignment_id = ag.assignment_id AND s.group_id = ag.group_id
       WHERE ag.assignment_id = $1`,
      [assignmentId]
    );
    return result.rows[0];
  }
};

module.exports = {
  createAssignment,
  findAssignmentById,
  findAllAssignments,
  updateAssignment,
  deleteAssignment,
  getAssignmentTargetGroups,
  getAssignmentSubmissionStats,
};