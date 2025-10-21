const pool = require("../config/db");

const createUser = async ({ name, email, password, role }) => {
  const result = await pool.query(
    `INSERT INTO users (name, email, password, role) 
     VALUES ($1, $2, $3, $4) 
     RETURNING id, name, email, role, created_at`,
    [name, email, password, role]
  );
  return result.rows[0];
};

const findUserByEmail = async (email) => {
  const result = await pool.query("SELECT * FROM users WHERE email = $1", [
    email,
  ]);
  return result.rows[0];
};

const findUserById = async (id) => {
  const result = await pool.query(
    "SELECT id, name, email, role, created_at FROM users WHERE id = $1",
    [id]
  );
  return result.rows[0];
};

const findAllUsers = async (role = null) => {
  let query = "SELECT id, name, email, role, created_at FROM users";
  const params = [];

  if (role) {
    query += " WHERE role = $1";
    params.push(role);
  }

  query += " ORDER BY created_at DESC";

  const result = await pool.query(query, params);
  return result.rows;
};

const updateUser = async (id, data) => {
  const fields = [];
  const values = [];
  let paramCount = 1;

  Object.keys(data).forEach((key) => {
    if (data[key] !== undefined && key !== "id") {
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
    `UPDATE users SET ${fields.join(", ")} 
     WHERE id = $${paramCount} 
     RETURNING id, name, email, role, created_at`,
    values
  );
  return result.rows[0];
};

const deleteUser = async (id) => {
  const result = await pool.query(
    "DELETE FROM users WHERE id = $1 RETURNING *",
    [id]
  );
  return result.rows[0];
};

module.exports = {
  createUser,
  findUserByEmail,
  findUserById,
  findAllUsers,
  updateUser,
  deleteUser,
};
