const pool = require("../config/db");

const createGroup = async ({ name, creator_id }) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const groupResult = await client.query(
      `INSERT INTO groups (name, creator_id) 
       VALUES ($1, $2) 
       RETURNING *`,
      [name, creator_id]
    );

    const group = groupResult.rows[0];

    await client.query(
      `INSERT INTO group_members (group_id, user_id, role) 
       VALUES ($1, $2, $3)`,
      [group.id, creator_id, "leader"]
    );

    await client.query("COMMIT");
    return group;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

const findGroupById = async (id) => {
  const result = await pool.query(
    `SELECT g.*, u.name as creator_name
     FROM groups g
     JOIN users u ON g.creator_id = u.id
     WHERE g.id = $1`,
    [id]
  );
  return result.rows[0];
};

const findGroupsByUserId = async (userId) => {
  const result = await pool.query(
    `SELECT g.*, u.name as creator_name,
            COUNT(DISTINCT gm.user_id) as member_count
     FROM groups g
     JOIN users u ON g.creator_id = u.id
     JOIN group_members gm ON g.id = gm.group_id
     WHERE gm.user_id = $1
     GROUP BY g.id, u.name
     ORDER BY g.created_at DESC`,
    [userId]
  );
  return result.rows;
};

const findAllGroups = async () => {
  const result = await pool.query(
    `SELECT g.*, u.name as creator_name,
            COUNT(DISTINCT gm.user_id) as member_count
     FROM groups g
     JOIN users u ON g.creator_id = u.id
     LEFT JOIN group_members gm ON g.id = gm.group_id
     GROUP BY g.id, u.name
     ORDER BY g.created_at DESC`
  );
  return result.rows;
};

const addGroupMember = async (groupId, userId, role = "member") => {
  const result = await pool.query(
    `INSERT INTO group_members (group_id, user_id, role) 
     VALUES ($1, $2, $3) 
     RETURNING *`,
    [groupId, userId, role]
  );
  return result.rows[0];
};

const getGroupMembers = async (groupId) => {
  const result = await pool.query(
    `SELECT u.id, u.name, u.email, gm.role, gm.joined_at
     FROM group_members gm
     JOIN users u ON gm.user_id = u.id
     WHERE gm.group_id = $1
     ORDER BY gm.role DESC, u.name`,
    [groupId]
  );
  return result.rows;
};

const removeGroupMember = async (groupId, userId) => {
  const result = await pool.query(
    "DELETE FROM group_members WHERE group_id = $1 AND user_id = $2 RETURNING *",
    [groupId, userId]
  );
  return result.rows[0];
};

const isGroupMember = async (groupId, userId) => {
  const result = await pool.query(
    "SELECT * FROM group_members WHERE group_id = $1 AND user_id = $2",
    [groupId, userId]
  );
  return result.rows.length > 0;
};

const isGroupLeader = async (groupId, userId) => {
  const result = await pool.query(
    "SELECT * FROM group_members WHERE group_id = $1 AND user_id = $2 AND role = 'leader'",
    [groupId, userId]
  );
  return result.rows.length > 0;
};

module.exports = {
  createGroup,
  findGroupById,
  findGroupsByUserId,
  findAllGroups,
  addGroupMember,
  getGroupMembers,
  removeGroupMember,
  isGroupMember,
  isGroupLeader,
};
