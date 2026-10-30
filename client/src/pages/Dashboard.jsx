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

  // Load all of the user's jobs once, when the page opens
  useEffect(() => {
    api
      .get("/jobs")
      .then((res) => setJobs(res.data.jobs))
      .catch((err) => setError(err.response?.data?.message || "Could not load jobs"))
      .finally(() => setLoading(false));
  }, []);

  // Called when the user clicks "Delete" in the popup
  const confirmDelete = async () => {
    setDeleting(true);
    try {
      await api.delete(`/jobs/${jobToDelete.id}`);
      // Remove it from the list on screen (no need to reload everything)
      setJobs(jobs.filter((j) => j.id !== jobToDelete.id));
    } catch (err) {
      setError(err.response?.data?.message || "Could not delete job");
    } finally {
      setDeleting(false);
      setJobToDelete(null);
    }
  };

  // Count how many jobs have a given status (for the summary cards)
  const countByStatus = (status) => jobs.filter((j) => j.status === status).length;

  const cards = [
    { label: "Total", value: jobs.length },
    { label: "Applied", value: countByStatus("Applied") },
    { label: "Interview", value: countByStatus("Interview") },
    { label: "Offer", value: countByStatus("Offer") },
    { label: "Rejected", value: countByStatus("Rejected") },
  ];

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

      {loading ? (
        <p className="center-text">Loading...</p>
      ) : jobs.length === 0 ? (
        <p className="center-text">No jobs yet. Click "Add Job" to track your first application!</p>
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
