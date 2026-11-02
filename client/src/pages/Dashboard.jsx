import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import StatusBadge from "../components/StatusBadge";
import ConfirmModal from "../components/ConfirmModal";

export default function Dashboard() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [jobToDelete, setJobToDelete] = useState(null); // job waiting for confirmation
  const [deleting, setDeleting] = useState(false);

  // Totals for the summary cards (always ALL of the user's jobs, not just the ones shown)
  const [stats, setStats] = useState({ total: 0, byStatus: {} });

  // searchInput = what is typed in the box right now
  // search = the value we actually send to the server (updated shortly after typing stops)
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");

  // Wait 300ms after the user stops typing, so we don't call the API on every key press
  useEffect(() => {
    const timer = setTimeout(() => setSearch(searchInput.trim()), 300);
    return () => clearTimeout(timer); // typing again cancels the previous timer
  }, [searchInput]);

  // Load the summary card totals
  const loadStats = () => {
    api
      .get("/jobs/stats")
      .then((res) => setStats(res.data))
      .catch((err) => setError(err.response?.data?.message || "Could not load totals"));
  };

  // Load the jobs from the server whenever the search changes
  const loadJobs = () => {
    api
      .get("/jobs", { params: { search } })
      .then((res) => {
        setJobs(res.data.jobs);
        setError("");
      })
      .catch((err) => setError(err.response?.data?.message || "Could not load jobs"))
      .finally(() => setLoading(false));
  };

  useEffect(loadStats, []); // totals: once, when the page opens
  useEffect(loadJobs, [search]); // jobs: again every time the search changes

  // Called when the user clicks "Delete" in the popup
  const confirmDelete = async () => {
    setDeleting(true);
    try {
      await api.delete(`/jobs/${jobToDelete.id}`);
      // Reload from the server so the list and the totals are both correct
      loadJobs();
      loadStats();
    } catch (err) {
      setError(err.response?.data?.message || "Could not delete job");
    } finally {
      setDeleting(false);
      setJobToDelete(null);
    }
  };

  const cards = [
    { label: "Total", value: stats.total },
    { label: "Applied", value: stats.byStatus.Applied ?? 0 },
    { label: "Interview", value: stats.byStatus.Interview ?? 0 },
    { label: "Offer", value: stats.byStatus.Offer ?? 0 },
    { label: "Rejected", value: stats.byStatus.Rejected ?? 0 },
  ];

  // True when the user is filtering, so we can show a different "empty" message
  const isFiltering = search !== "";

  return (
    <div>
      <div className="page-header">
        <h1>Dashboard</h1>
        <Link to="/jobs/new" className="btn btn-inline">+ Add Job</Link>
      </div>

      {error && <div className="alert-error">{error}</div>}

      <div className="summary-cards">
        {cards.map((card) => (
          <div className="summary-card" key={card.label}>
            <div className="summary-value">{card.value}</div>
            <div className="summary-label">{card.label}</div>
          </div>
        ))}
      </div>

      <div className="toolbar">
        <input
          type="search"
          className="toolbar-search"
          placeholder="Search by company or position..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
      </div>

      {loading ? (
        <p className="center-text">Loading...</p>
      ) : jobs.length === 0 ? (
        <p className="center-text">
          {isFiltering
            ? "No jobs match your search."
            : 'No jobs yet. Click "Add Job" to track your first application!'}
        </p>
      ) : (
        <div className="table-wrap">
          <table className="job-table">
            <thead>
              <tr>
                <th>Company</th>
                <th>Position</th>
                <th>Location</th>
                <th>Status</th>
                <th>Deadline</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job) => (
                <tr key={job.id}>
                  <td>{job.company}</td>
                  <td>{job.job_title}</td>
                  <td>{job.location || "-"}</td>
                  <td><StatusBadge status={job.status} /></td>
                  <td>{job.deadline || "-"}</td>
                  <td>
                    <Link to={`/jobs/${job.id}/edit`} className="link-action">Edit</Link>
                    <button className="link-action link-danger" onClick={() => setJobToDelete(job)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {jobToDelete && (
        <ConfirmModal
          message={`Delete "${jobToDelete.job_title}" at ${jobToDelete.company}? This cannot be undone.`}
          onConfirm={confirmDelete}
          onCancel={() => setJobToDelete(null)}
          busy={deleting}
        />
      )}
    </div>
  );
}
