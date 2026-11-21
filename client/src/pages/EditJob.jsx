import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";
import JobForm from "../components/JobForm";
import FormSkeleton from "../components/FormSkeleton";
import SlowNote from "../components/SlowNote";
import ErrorAlert from "../components/ErrorAlert";
import { getErrorMessage } from "../utils/getErrorMessage";

export default function EditJob() {
  const { id } = useParams(); // the :id from the URL /jobs/:id/edit
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Load the job so the form can be pre-filled
  const loadJob = () => {
    api
      .get(`/jobs/${id}`)
      .then((res) => {
        // The database returns null for empty fields; inputs need "" instead
        const data = res.data.job;
        setJob({
          company: data.company,
          job_title: data.job_title,
          location: data.location || "",
          salary: data.salary || "",
          status: data.status,
          deadline: data.deadline || "",
          job_url: data.job_url || "",
          notes: data.notes || "",
        });
      })
      .catch((err) => setError(getErrorMessage(err, "Could not load job")))
      .finally(() => setLoading(false));
  };
  useEffect(loadJob, [id]);

  // "Try again": show the loading state again, then repeat the request
  const retry = () => {
    setError("");
    setLoading(true);
    loadJob();
  };

  const handleSubmit = async (data) => {
    await api.put(`/jobs/${id}`, data);
    navigate("/dashboard");
  };

  // Pick what to show under the title: loading, error, or the form
  let body;
  if (loading) {
    // Loading: grey placeholders in the shape of the form
    body = (
      <>
        <FormSkeleton />
        <SlowNote />
      </>
    );
  } else if (error) {
    // Error: say what went wrong, and offer a retry or a way out
    body = (
      <>
        <ErrorAlert message={error} onRetry={retry} />
        <Link to="/dashboard" className="btn btn-inline btn-outline">Back to dashboard</Link>
      </>
    );
  } else {
    // Only rendered after the job has loaded, so the form starts with the saved values
    body = <JobForm initialValues={job} onSubmit={handleSubmit} submitLabel="Save Changes" />;
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Edit Job</h1>
          <p className="page-subtitle">Update the details or move it to the next stage.</p>
        </div>
      </div>
      {body}
    </div>
  );
}
