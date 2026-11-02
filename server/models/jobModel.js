const pool = require("../config/db");

// Make user text safe to use inside ILIKE (so "%" and "_" are treated as normal characters)
const escapeLike = (text) => text.replace(/[\\%_]/g, "\\$&");

// Get the user's jobs, optionally filtered by a search word and/or a status
// The search matches the company OR the position (job title), ignoring upper/lower case
const getAllByUser = async (userId, { search, status } = {}) => {
  const conditions = ["user_id = $1"];
  const values = [userId];

  if (status) {
    values.push(status);
    conditions.push(`status = $${values.length}`);
  }

  if (search) {
    values.push(`%${escapeLike(search)}%`);
    // $2 is the search pattern; values are passed separately so SQL injection is impossible
    conditions.push(`(company ILIKE $${values.length} OR job_title ILIKE $${values.length})`);
  }

  const result = await pool.query(
    `SELECT * FROM jobs WHERE ${conditions.join(" AND ")} ORDER BY created_at DESC`,
    values
  );
  return result.rows;
};

// Count ALL of the user's jobs per status (ignores search/filters) for the summary cards
const getStatusCounts = async (userId) => {
  const result = await pool.query(
    "SELECT status, COUNT(*)::int AS count FROM jobs WHERE user_id = $1 GROUP BY status",
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

module.exports = { getAllByUser, getStatusCounts, getOne, create, update, remove };