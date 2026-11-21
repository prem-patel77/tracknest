import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import StatusBadge from "../components/StatusBadge";
import StageProgress from "../components/StageProgress";
import ConfirmModal from "../components/ConfirmModal";
import ErrorAlert from "../components/ErrorAlert";
import EmptyState from "../components/EmptyState";
import { Icon } from "../components/Icons";
import { STATUSES, SORT_OPTIONS } from "../utils/constants";
import { describeDeadline } from "../utils/format";
import { getErrorMessage } from "../utils/getErrorMessage";

// Small icon shown before the deadline hint (so urgency is never shown by color alone)
const TONE_ICON = { overdue: "alert", soon: "clock" };

export default function Dashboard() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true); // true only until the FIRST page of jobs arrives
  const [slow, setSlow] = useState(false); // true if that first load takes more than 4 seconds
  const [loadedKey, setLoadedKey] = useState(""); // which search/filter/sort/page the shown jobs belong to
  const [statsLoading, setStatsLoading] = useState(true);
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

  // The free server can take up to a minute to wake up. After 4 seconds of loading,
  // show a short note so the visitor knows the page is not broken.
  useEffect(() => {
    if (!loading) return;
    const timer = setTimeout(() => setSlow(true), 4000);
    return () => clearTimeout(timer);
  }, [loading]);

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
      .catch((err) => setError(getErrorMessage(err, "Could not load totals")))
      .finally(() => setStatsLoading(false));
  };

  // Load ONE PAGE of jobs from the server whenever the search, filter, sorting or page changes
  const loadJobs = () => {
    const [sortBy, order] = sort.split(":"); // "deadline:asc" -> "deadline", "asc"
    const key = [search, status, sort, page, limit].join("|");
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
      .finally(() => {
        setLoading(false);
        setLoadedKey(key);
      });
  };

  // While the shown jobs belong to an older search/filter/page, a newer request is still running
  const fetching = !loading && loadedKey !== [search, status, sort, page, limit].join("|");

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

  // The five stat modules: a small tab with the name, and the number below it
  const cards = [
    { label: "Total", value: stats.total },
    { label: "Applied", value: stats.byStatus.Applied ?? 0 },
    { label: "Interview", value: stats.byStatus.Interview ?? 0 },
    { label: "Offer", value: stats.byStatus.Offer ?? 0 },
    { label: "Rejected", value: stats.byStatus.Rejected ?? 0 },
  ];

  // True when the user is filtering, so we can show a different "empty" message
  const isFiltering = search !== "" || status !== "All";

  // Reset the search box and the status dropdown (used by the "Clear filters" button)
  const clearFilters = () => {
    setSearchInput("");
    setSearch("");
    changeStatus("All");
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Dashboard</h1>
          <p className="page-subtitle">Your pipeline, ranked by what needs you next.</p>
        </div>
      </div>

      {/* "Try again" reloads both the totals and the list */}
      <ErrorAlert
        message={error}
        onRetry={() => {
          setError("");
          loadJobs();
          loadStats();
        }}
      />

      <div className="summary-cards">
        {cards.map((card) => (
          <div className="summary-card" key={card.label}>
            <div className="summary-label">{card.label}</div>
            <div className="summary-value">
              {statsLoading ? <span className="skeleton skeleton-value" /> : card.value}
            </div>
          </div>
        ))}
      </div>

      <div className="toolbar">
        <div className="search-box toolbar-search">
          <Icon name="search" size={16} />
          <input
            type="search"
            placeholder="Search by company or position..."
            aria-label="Search by company or position"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </div>
        <select aria-label="Filter by status" value={status} onChange={(e) => changeStatus(e.target.value)}>
          <option value="All">All statuses</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <select aria-label="Sort jobs" value={sort} onChange={(e) => changeSort(e.target.value)}>
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        <Link to="/jobs/new" className="btn btn-inline">
          <Icon name="plus" size={16} />
          Add job
        </Link>
      </div>

      {loading ? (
        // First load: grey placeholder rows in the shape of the table
        <div aria-busy="true">
          <div className="table-wrap card">
            {[1, 2, 3, 4, 5].map((row) => (
              <div className="skeleton-row" key={row}>
                {[1, 2, 3, 4].map((bar) => (
                  <span className="skeleton" key={bar} />
                ))}
              </div>
            ))}
          </div>
          {slow && (
            <p className="slow-note" role="status">
              Waking the server. Free hosting can take up to a minute on the first visit.
            </p>
          )}
        </div>
      ) : jobs.length === 0 && error ? null : jobs.length === 0 ? (
        isFiltering ? (
          <EmptyState icon="search" title="No matching jobs" text="Try a different search word or status.">
            <button className="btn btn-inline btn-outline" onClick={clearFilters}>Clear filters</button>
          </EmptyState>
        ) : (
          <EmptyState
            icon="briefcase"
            title="No applications yet"
            text="Add your first job to start tracking your internship search."
          >
            <Link to="/jobs/new" className="btn btn-inline">
              <Icon name="plus" size={16} />
              Add your first job
            </Link>
          </EmptyState>
        )
      ) : (
        // While a new page/filter is loading, keep the old rows but fade them out
        <div className={fetching ? "table-wrap card is-fetching" : "table-wrap card"}>
          <table className="job-table">
            <thead>
              <tr>
                <th className="cell-zone" aria-hidden="true" />
                <th className="cell-rank">#</th>
                <th>Company</th>
                <th>Position</th>
                <th>Status</th>
                <th>Progress</th>
                <th>Deadline</th>
                <th className="col-actions"><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job, index) => {
                const deadline = describeDeadline(job.deadline, job.status);
                return (
                  // row-<status> colors the strip at the start of the row
                  <tr key={job.id} className={`job-row row-${job.status.toLowerCase()}`}>
                    <td className="cell-zone" aria-hidden="true" />
                    {/* Rank = this row's place in the current sort order (it continues across pages) */}
                    <td className="cell-rank">{(page - 1) * limit + index + 1}</td>
                    <td className="cell-company">
                      <span className="company-name">{job.company}</span>
                    </td>
                    <td className="cell-position">
                      {job.job_title}
                      {job.location && <span className="cell-sub">{job.location}</span>}
                    </td>
                    <td className="cell-status"><StatusBadge status={job.status} /></td>
                    <td className="cell-stage"><StageProgress status={job.status} /></td>
                    <td className="cell-deadline">
                      <span className={deadline.tone === "done" ? "deadline deadline-done" : "deadline"}>
                        {deadline.label}
                      </span>
                      {/* The hint is in words and has an icon, so urgency never depends on color alone */}
                      {deadline.hint && (
                        <span className={`cell-sub deadline-hint deadline-${deadline.tone}`}>
                          {TONE_ICON[deadline.tone] && <Icon name={TONE_ICON[deadline.tone]} size={14} />}
                          {deadline.hint}
                        </span>
                      )}
                    </td>
                    <td className="col-actions">
                      <Link
                        to={`/jobs/${job.id}/edit`}
                        className="icon-btn"
                        title="Edit"
                        aria-label={`Edit ${job.job_title} at ${job.company}`}
                      >
                        <Icon name="edit" size={16} />
                      </Link>
                      <button
                        className="icon-btn icon-btn-danger"
                        title="Delete"
                        aria-label={`Delete ${job.job_title} at ${job.company}`}
                        onClick={() => setJobToDelete(job)}
                      >
                        <Icon name="trash" size={16} />
                      </button>
                    </td>
                  </tr>
                );
              })}
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
              disabled={page <= 1 || fetching}
            >
              Previous
            </button>
            <span>Page {page} of {pagination.totalPages}</span>
            <button
              className="btn btn-outline btn-small"
              onClick={() => setPage(page + 1)}
              disabled={page >= pagination.totalPages || fetching}
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
