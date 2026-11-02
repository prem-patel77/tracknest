const Job = require("../models/jobModel");
const { LIMITS, isText, isRealDate, isWebUrl } = require("../utils/validators");

const STATUSES = ["Saved", "Applied", "OA", "Interview", "Offer", "Rejected"];
const SORT_FIELDS = ["company", "deadline", "created_at", "status"]; // created_at = date added
const DEFAULT_LIMIT = 10; // jobs per page if the client doesn't say
const MAX_LIMIT = 50; // so nobody can ask for 1,000,000 rows at once

// Returns an error message if the job data is invalid, otherwise null
const validateJob = (body) => {
  const { company, job_title, status, job_url, deadline } = body;

  if (!isText(company) || !company.trim()) return "Company is required";
  if (company.trim().length > LIMITS.company) return `Company must be at most ${LIMITS.company} characters`;
  if (!isText(job_title) || !job_title.trim()) return "Job title is required";
  if (job_title.trim().length > LIMITS.job_title) return `Job title must be at most ${LIMITS.job_title} characters`;

  // Optional text fields: if they are sent they must be text and not too long
  for (const field of ["location", "salary", "notes"]) {
    const value = body[field];
    if (value === undefined || value === null) continue;
    if (!isText(value)) return `${field} must be text`;
    if (value.length > LIMITS[field]) return `${field} must be at most ${LIMITS[field]} characters`;
  }

  if (status && !STATUSES.includes(status)) return "Invalid status";

  if (job_url) {
    if (!isText(job_url) || !isWebUrl(job_url.trim())) return "Job URL must start with http:// or https://";
  }
  if (deadline) {
    if (!isText(deadline) || !isRealDate(deadline)) return "Deadline must be a valid date (YYYY-MM-DD)";
  }
  return null;
};

// Trim the text fields so " Shopify " is saved as "Shopify"
const cleanJob = (body) => ({
  ...body,
  company: body.company.trim(),
  job_title: body.job_title.trim(),
  job_url: body.job_url ? body.job_url.trim() : body.job_url,
});

const parseId = (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) {
    res.status(400).json({ message: "Invalid job id" });
    return null;
  }
  return id;
};

// Read and check the query params of GET /api/jobs
// Returns { error } if something is invalid, otherwise { filters }
const parseListQuery = (query) => {
  // Query params are strings from the URL; trim spaces and ignore anything that isn't text
  const search = typeof query.search === "string" ? query.search.trim() : "";

  // "All" (or nothing) means no status filter
  const status = typeof query.status === "string" && query.status !== "All" ? query.status : "";
  if (status && !STATUSES.includes(status)) return { error: "Invalid status filter" };

  // Sorting: sortBy must be one of these, order must be asc or desc
  const sortBy = query.sortBy || "created_at";
  if (!SORT_FIELDS.includes(sortBy)) return { error: "Invalid sortBy" };

  const order = query.order || "desc";
  if (!["asc", "desc"].includes(order)) return { error: "Invalid order" };

  // Pagination: page starts at 1, limit is how many jobs per page (1 to MAX_LIMIT)
  const page = query.page === undefined ? 1 : Number(query.page);
  if (!Number.isInteger(page) || page < 1) return { error: "Invalid page" };

  const limit = query.limit === undefined ? DEFAULT_LIMIT : Number(query.limit);
  if (!Number.isInteger(limit) || limit < 1 || limit > MAX_LIMIT) {
    return { error: `Limit must be between 1 and ${MAX_LIMIT}` };
  }

  return { filters: { search, status, sortBy, order, page, limit } };
};

// GET /api/jobs?search=shopify&status=Applied&sortBy=deadline&order=asc&page=2&limit=10
const getJobs = async (req, res) => {
  try {
    const { error, filters } = parseListQuery(req.query);
    if (error) return res.status(400).json({ message: error });

    const { jobs, total } = await Job.getAllByUser(req.userId, filters);

    res.json({
      jobs,
      pagination: {
        page: filters.page,
        limit: filters.limit,
        total, // jobs matching the search/filter, across all pages
        totalPages: Math.max(1, Math.ceil(total / filters.limit)),
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// GET /api/jobs/stats -> { total: 12, byStatus: { Saved: 2, ... }, byMonth: [{ month: "2026-11", count: 3 }, ...] }
// Always counts every job the user has, no matter what the list is filtered by
const getJobStats = async (req, res) => {
  try {
    const rows = await Job.getStatusCounts(req.userId);
    const byMonth = await Job.getMonthlyCounts(req.userId); // last 12 months, oldest first

    // Start every status at 0 so the client never gets a missing key
    const byStatus = Object.fromEntries(STATUSES.map((s) => [s, 0]));
    let total = 0;
    rows.forEach((row) => {
      byStatus[row.status] = row.count;
      total += row.count;
    });

    res.json({ total, byStatus, byMonth });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const getJob = async (req, res) => {
  try {
    const id = parseId(req, res);
    if (id === null) return;

    const job = await Job.getOne(id, req.userId);
    if (!job) return res.status(404).json({ message: "Job not found" });

    res.json({ job });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const createJob = async (req, res) => {
  try {
    const error = validateJob(req.body);
    if (error) return res.status(400).json({ message: error });

    const job = await Job.create(req.userId, cleanJob(req.body));
    res.status(201).json({ job });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const updateJob = async (req, res) => {
  try {
    const id = parseId(req, res);
    if (id === null) return;

    const error = validateJob(req.body);
    if (error) return res.status(400).json({ message: error });

    const job = await Job.update(id, req.userId, cleanJob(req.body));
    if (!job) return res.status(404).json({ message: "Job not found" });

    res.json({ job });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const deleteJob = async (req, res) => {
  try {
    const id = parseId(req, res);
    if (id === null) return;

    const deleted = await Job.remove(id, req.userId);
    if (!deleted) return res.status(404).json({ message: "Job not found" });

    res.json({ message: "Job deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getJobs, getJobStats, getJob, createJob, updateJob, deleteJob };