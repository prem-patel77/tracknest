const pool = require("../config/db");

const getAllByUser = async (userId) => {
  const result = await pool.query(
    "SELECT * FROM jobs WHERE user_id = $1 ORDER BY created_at DESC",
    [userId]
  );
  return result.rows;
};

const getOne = async (id, userId) => {
  const result = await pool.query(
    "SELECT * FROM jobs WHERE id = $1 AND user_id = $2",
    [id, userId]
  );
  return result.rows[0];
};

const create = async (userId, job) => {
  const { company, job_title, location, salary, status, deadline, job_url, notes } = job;
  const result = await pool.query(
    `INSERT INTO jobs (user_id, company, job_title, location, salary, status, deadline, job_url, notes)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
     RETURNING *`,
    [
      userId,
      company,
      job_title,
      location || null,
      salary || null,
      status || "Saved",
      deadline || null,
      job_url || null,
      notes || null,
    ]
  );
  return result.rows[0];
};

const update = async (id, userId, job) => {
  const { company, job_title, location, salary, status, deadline, job_url, notes } = job;
  const result = await pool.query(
    `UPDATE jobs
     SET company = $1, job_title = $2, location = $3, salary = $4, status = $5,
         deadline = $6, job_url = $7, notes = $8, updated_at = NOW()
     WHERE id = $9 AND user_id = $10
     RETURNING *`,
    [
      company,
      job_title,
      location || null,
      salary || null,
      status || "Saved",
      deadline || null,
      job_url || null,
      notes || null,
      id,
      userId,
    ]
  );
  return result.rows[0];
};

const remove = async (id, userId) => {
  const result = await pool.query(
    "DELETE FROM jobs WHERE id = $1 AND user_id = $2 RETURNING id",
    [id, userId]
  );
  return result.rows[0];
};

module.exports = { getAllByUser, getOne, create, update, remove };