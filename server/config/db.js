const { Pool, types } = require("pg");

// Keep DATE columns as plain "YYYY-MM-DD" strings (avoids timezone shifts)
types.setTypeParser(1082, (val) => val);

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

module.exports = pool;