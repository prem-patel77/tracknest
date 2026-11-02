const Job = require("../models/jobModel");

const STATUSES = ["Saved", "Applied", "OA", "Interview", "Offer", "Rejected"];

const validateJob = (body) => {
  const { company, job_title, status, job_url, deadline } = body;

  if (!String(company || "").trim()) return "Company is required";
  if (!String(job_title || "").trim()) return "Job title is required";
  if (status && !STATUSES.includes(status)) return "Invalid status";
  if (job_url) {
    try {
      new URL(job_url);
    } catch {
      return "Invalid job URL";
    }
  }
  if (deadline && isNaN(Date.parse(deadline))) return "Invalid deadline";
  return null;
};

const cleanJob = (body) => ({
  ...body,
  company: body.company.trim(),
  job_title: body.job_title.trim(),
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

  return { filters: { search, status } };
};

// GET /api/jobs?search=shopify&status=Applied
const getJobs = async (req, res) => {
  try {
    const { error, filters } = parseListQuery(req.query);
    if (error) return res.status(400).json({ message: error });

    const jobs = await Job.getAllByUser(req.userId, filters);
    res.json({ jobs });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// GET /api/jobs/stats -> { total: 12, byStatus: { Saved: 2, Applied: 5, ... } }
// Always counts every job the user has, no matter what the list is filtered by
const getJobStats = async (req, res) => {
  try {
    const rows = await Job.getStatusCounts(req.userId);

    // Start every status at 0 so the client never gets a missing key
    const byStatus = Object.fromEntries(STATUSES.map((s) => [s, 0]));
    let total = 0;
    rows.forEach((row) => {
      byStatus[row.status] = row.count;
      total += row.count;
    });

    res.json({ total, byStatus });
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