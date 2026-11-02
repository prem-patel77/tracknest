const pool = require("../config/db");

// Make user text safe to use inside ILIKE (so "%" and "_" are treated as normal characters)
const escapeLike = (text) => text.replace(/[\\%_]/g, "\\$&");

// The only ways a list can be sorted. The key comes from the URL, but the SQL text comes
// from this object, so user input is never pasted into the query (prevents SQL injection).
const SORT_COLUMNS = {
  company: "LOWER(company)",
  deadline: "deadline",
  created_at: "created_at",
  // Sort statuses in pipeline order (Saved -> Rejected) instead of alphabetically
  status:
    "CASE status WHEN 'Saved' THEN 1 WHEN 'Applied' THEN 2 WHEN 'OA' THEN 3 " +
    "WHEN 'Interview' THEN 4 WHEN 'Offer' THEN 5 ELSE 6 END",
};

// Get ONE PAGE of the user's jobs, optionally filtered by a search word and/or a status, and sorted
// The search matches the company OR the position (job title), ignoring upper/lower case
// Returns { jobs, total } where total = how many jobs match in ALL pages (needed for page buttons)
const getAllByUser = async (
  userId,
  { search, status, sortBy = "created_at", order = "desc", page = 1, limit = 10 } = {}
) => {
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

  const direction = order === "asc" ? "ASC" : "DESC";
  // NULLS LAST puts jobs without a deadline at the end (either direction)
  // "id" at the end keeps the order stable when two jobs have the same value
  const column = SORT_COLUMNS[sortBy] || SORT_COLUMNS.created_at;
  const orderBy = `${column} ${direction} NULLS LAST, id ${direction}`;

  const where = conditions.join(" AND ");

  // How many jobs match the search/filter in total (same WHERE, no LIMIT)
  const countResult = await pool.query(`SELECT COUNT(*)::int AS total FROM jobs WHERE ${where}`, values);

  // Page 1 skips 0 rows, page 2 skips `limit` rows, page 3 skips 2 x `limit` rows, ...
  const offset = (page - 1) * limit;
  const result = await pool.query(
    `SELECT * FROM jobs WHERE ${where} ORDER BY ${orderBy}
     LIMIT $${values.length + 1} OFFSET $${values.length + 2}`,
    [...values, limit, offset]
  );

  return { jobs: result.rows, total: countResult.rows[0].total };
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