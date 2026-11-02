import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import StatusBadge from "../components/StatusBadge";
import ConfirmModal from "../components/ConfirmModal";
import { STATUSES, SORT_OPTIONS } from "../utils/constants";
import { getErrorMessage } from "../utils/getErrorMessage";

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
  const [status, setStatus] = useState("All"); // status filter dropdown
  const [sort, setSort] = useState("created_at:desc"); // "field:direction"
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10); // jobs per page
  // Info sent back by the server: how many jobs match in total and how many pages that is
  const [pagination, setPagination] = useState({ total: 0, totalPages: 1 });

  // Wait 300ms after the user stops typing, so we don't call the API on every key press
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(1); // a new search always starts from the first page
    }, 300);
    return () => clearTimeout(timer); // typing again cancels the previous timer
  }, [searchInput]);

  // Changing a filter, the sorting or the page size also goes back to page 1
  const changeStatus = (value) => {
    setStatus(value);
    setPage(1);
  };
  const changeSort = (value) => {
    setSort(value);
    setPage(1);
  };
  const changeLimit = (value) => {
    setLimit(Number(value));
    setPage(1);
  };

  // Load the summary card totals
  const loadStats = () => {
    api
      .get("/jobs/stats")
      .then((res) => setStats(res.data))
      .catch((err) => setError(getErrorMessage(err, "Could not load totals")));
  };

  // Load ONE PAGE of jobs from the server whenever the search, filter, sorting or page changes
  const loadJobs = () => {
    const [sortBy, order] = sort.split(":"); // "deadline:asc" -> "deadline", "asc"
    api
      .get("/jobs", { params: { search, status, sortBy, order, page, limit } })
      .then((res) => {
        setJobs(res.data.jobs);
        setPagination(res.data.pagination);
        setError("");
        // If this page no longer exists (e.g. we deleted its last job), go back one page
        if (res.data.jobs.length === 0 && page > res.data.pagination.totalPages) {
          setPage(res.data.pagination.totalPages);
        }
      })
      .catch((err) => setError(getErrorMessage(err, "Could not load jobs")))
      .finally(() => setLoading(false));
  };

  useEffect(loadStats, []); // totals: once, when the page opens
  useEffect(loadJobs, [search, status, sort, page, limit]); // jobs: again when any of these change

  // Called when the user clicks "Delete" in the popup
  const confirmDelete = async () => {
    setDeleting(true);
    try {
      await api.delete(`/jobs/${jobToDelete.id}`);
      // Reload from the server so the list and the totals are both correct
      loadJobs();
      loadStats();
    } catch (err) {
      setError(getErrorMessage(err, "Could not delete job"));
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
  const isFiltering = search !== "" || status !== "All";

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
        <select value={status} onChange={(e) => changeStatus(e.target.value)}>
          <option value="All">All statuses</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <select value={sort} onChange={(e) => changeSort(e.target.value)}>
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <p className="center-text">Loading...</p>
      ) : jobs.length === 0 ? (
        <p className="center-text">
          {isFiltering
            ? "No jobs match your search or filter."
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

      {/* Page controls: shown whenever there is at least one matching job */}
      {!loading && pagination.total > 0 && (
        <div className="pagination">
          <span className="pagination-info">
            {pagination.total} {pagination.total === 1 ? "job" : "jobs"}
          </span>
          <label className="pagination-size">
            Per page
            <select value={limit} onChange={(e) => changeLimit(e.target.value)}>
              {[5, 10, 20, 50].map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </label>
          <div className="pagination-buttons">
            <button
              className="btn btn-outline btn-small"
              onClick={() => setPage(page - 1)}
              disabled={page <= 1}
            >
              Previous
            </button>
            <span>Page {page} of {pagination.totalPages}</span>
            <button
              className="btn btn-outline btn-small"
              onClick={() => setPage(page + 1)}
              disabled={page >= pagination.totalPages}
            >
              Next
            </button>
          </div>
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
