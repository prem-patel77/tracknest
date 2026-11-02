const pool = require("../config/db");

const findByEmail = async (email) => {
  const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
  return result.rows[0];
};

const findById = async (id) => {
  const result = await pool.query(
    "SELECT id, name, email, created_at FROM users WHERE id = $1",
    [id]
  );
  return result.rows[0];
};

const createUser = async (name, email, passwordHash) => {
  const result = await pool.query(
    "INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, name, email, created_at",
    [name, email, passwordHash]
  );
  return result.rows[0];
};

// Same as findById but includes password_hash (only for checking the current password)
const findByIdWithHash = async (id) => {
  const result = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
  return result.rows[0];
};

const updateProfile = async (id, name, email) => {
  const result = await pool.query(
    "UPDATE users SET name = $1, email = $2 WHERE id = $3 RETURNING id, name, email, created_at",
    [name, email, id]
  );
  return result.rows[0];
};

const updatePassword = async (id, passwordHash) => {
  await pool.query("UPDATE users SET password_hash = $1 WHERE id = $2", [passwordHash, id]);
};

module.exports = { findByEmail, findById, findByIdWithHash, createUser, updateProfile, updatePassword };