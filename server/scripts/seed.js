// Creates a demo account with 14 sample jobs so the app (and its charts) can be shown off.
//
//   cd server
//   npm run seed
//
// Safe to run more than once: if the demo user already exists it does nothing.
//
//   npm run seed -- --reset
//
// With --reset, the demo user's jobs are deleted and the 14 sample jobs are created
// again (fresh dates), and the demo name/password are restored. Visitors can add, edit
// and delete demo jobs, so this puts the demo back to a clean state.
// It only ever touches rows that belong to the demo user. It never reads, updates
// or deletes any other user's data.

require("dotenv").config();
const bcrypt = require("bcryptjs");
const pool = require("../config/db");
const { DEMO_EMAIL } = require("../utils/demo");

const RESET = process.argv.includes("--reset");
const DEMO_NAME = "Demo User";
const DEMO_PASSWORD = "Demo1234!";

// monthsAgo: 0 = this month, 5 = five months ago  -> spreads created_at over the last 6 months
// day: day of that month the job was added
// deadlineIn: days from today until the deadline (negative = already passed, null = no deadline)
const JOBS = [
  { company: "Shopify", job_title: "Software Engineer Intern", location: "Toronto, ON (Hybrid)", salary: "$38/hr", status: "Rejected", monthsAgo: 5, day: 12, deadlineIn: null, notes: "Rejected after the online assessment. Practice more graph problems." },

  { company: "RBC", job_title: "Technology Analyst Intern", location: "Toronto, ON", salary: "$32/hr", status: "Interview", monthsAgo: 4, day: 3, deadlineIn: 9, notes: "Phone screen went well. Technical round scheduled." },
  { company: "Wealthsimple", job_title: "Frontend Developer Intern", location: "Remote (Canada)", salary: "$36/hr", status: "Applied", monthsAgo: 4, day: 21, deadlineIn: null, notes: "Applied through a referral from a classmate." },

  { company: "Google", job_title: "STEP Intern", location: "Waterloo, ON", salary: "$45/hr", status: "OA", monthsAgo: 3, day: 7, deadlineIn: 4, notes: "Online assessment is 90 minutes. Review dynamic programming." },
  { company: "Microsoft", job_title: "Software Engineer Intern", location: "Vancouver, BC", salary: "$42/hr", status: "Rejected", monthsAgo: 3, day: 15, deadlineIn: null, notes: null },
  { company: "Ubisoft", job_title: "Gameplay Programmer Intern", location: "Montreal, QC", salary: "$28/hr", status: "Applied", monthsAgo: 3, day: 26, deadlineIn: null, notes: "Needs a portfolio link. Added my GitHub." },

  { company: "Amazon", job_title: "SDE Intern", location: "Toronto, ON", salary: "$40/hr", status: "Interview", monthsAgo: 2, day: 5, deadlineIn: 14, notes: "Two back-to-back coding interviews. Review the leadership principles." },
  { company: "Cohere", job_title: "Machine Learning Intern", location: "Toronto, ON (Hybrid)", salary: "$44/hr", status: "Applied", monthsAgo: 2, day: 14, deadlineIn: null, notes: null },
  { company: "Hootsuite", job_title: "Full Stack Developer Intern", location: "Vancouver, BC", salary: "$30/hr", status: "Offer", monthsAgo: 2, day: 24, deadlineIn: 6, notes: "Offer received! Decision needed by the deadline." },

  { company: "Stripe", job_title: "Backend Engineer Intern", location: "Remote", salary: "$48/hr", status: "Interview", monthsAgo: 1, day: 4, deadlineIn: 12, notes: "Final round: system design + pairing session." },
  { company: "Telus", job_title: "Software Developer Co-op", location: "Burnaby, BC", salary: "$29/hr", status: "Applied", monthsAgo: 1, day: 13, deadlineIn: null, notes: null },
  { company: "Bell", job_title: "Cloud Engineering Intern", location: "Montreal, QC", salary: "$27/hr", status: "Saved", monthsAgo: 1, day: 22, deadlineIn: 21, notes: "Apply before the deadline. Tailor the resume for cloud roles." },

  { company: "Nvidia", job_title: "Software Engineering Intern", location: "Santa Clara, CA", salary: "$50/hr", status: "Saved", monthsAgo: 0, day: 1, deadlineIn: 30, notes: "Read the job posting again and prepare a cover letter." },
  { company: "Atlassian", job_title: "Frontend Engineer Intern", location: "Remote", salary: "$41/hr", status: "Saved", monthsAgo: 0, day: 2, deadlineIn: 18, notes: null },
];

// Formats a Date as "YYYY-MM-DD" using local time (no timezone shifts)
const toDateString = (date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

// "monthsAgo" + "day" -> a created_at timestamp string like "2026-08-12 09:30:00"
const createdAtFor = (monthsAgo, day) => {
  const today = new Date();
  // The 1st of that month, then pick the day. Never go past today for the current month.
  const month = new Date(today.getFullYear(), today.getMonth() - monthsAgo, 1);
  const lastDay = monthsAgo === 0 ? today.getDate() : new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  month.setDate(Math.min(day, lastDay));
  return `${toDateString(month)} 09:30:00`;
};

const deadlineFor = (daysFromNow) => {
  if (daysFromNow === null) return null;
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  return toDateString(date);
};

const seed = async () => {
  const existing = await pool.query("SELECT id FROM users WHERE email = $1", [DEMO_EMAIL]);
  if (existing.rows.length > 0 && !RESET) {
    console.log(`Demo user ${DEMO_EMAIL} already exists (id ${existing.rows[0].id}). Nothing to do.`);
    console.log("To wipe the demo jobs and re-create them, run: npm run seed -- --reset");
    return;
  }

  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 10);

  // One transaction: either the user AND all 14 jobs are saved, or nothing is
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    let userId;
    if (existing.rows.length > 0) {
      // --reset: keep the demo user row, put back its name/password, and delete ONLY its jobs
      userId = existing.rows[0].id;
      await client.query("UPDATE users SET name = $1, password_hash = $2 WHERE id = $3", [DEMO_NAME, passwordHash, userId]);
      const deleted = await client.query("DELETE FROM jobs WHERE user_id = $1", [userId]);
      console.log(`Reset: removed ${deleted.rowCount} old demo jobs.`);
    } else {
      // ON CONFLICT DO NOTHING protects against two seed runs happening at the same moment
      const userResult = await client.query(
        `INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3)
         ON CONFLICT (email) DO NOTHING RETURNING id`,
        [DEMO_NAME, DEMO_EMAIL, passwordHash]
      );
      if (userResult.rows.length === 0) {
        await client.query("ROLLBACK");
        console.log("Demo user was created by someone else just now. Nothing to do.");
        return;
      }
      userId = userResult.rows[0].id;
    }

    for (const job of JOBS) {
      const createdAt = createdAtFor(job.monthsAgo, job.day);
      await client.query(
        `INSERT INTO jobs
           (user_id, company, job_title, location, salary, status, deadline, job_url, notes, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $10)`,
        [
          userId,
          job.company,
          job.job_title,
          job.location,
          job.salary,
          job.status,
          deadlineFor(job.deadlineIn),
          `https://www.${job.company.toLowerCase().replace(/[^a-z0-9]/g, "")}.com/careers`,
          job.notes,
          createdAt,
        ]
      );
    }

    await client.query("COMMIT");
    console.log(`Created demo user ${DEMO_EMAIL} (id ${userId}) with ${JOBS.length} jobs.`);
    console.log(`Log in with password: ${DEMO_PASSWORD}`);
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
};

seed()
  .catch((err) => {
    console.error("Seed failed:", err.message);
    process.exitCode = 1;
  })
  .finally(() => pool.end());
