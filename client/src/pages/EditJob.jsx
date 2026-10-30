import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";
import JobForm from "../components/JobForm";

export default function EditJob() {
  const { id } = useParams(); // the :id from the URL /jobs/:id/edit
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Load the job so the form can be pre-filled
  useEffect(() => {
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
      .catch((err) => setError(err.response?.data?.message || "Could not load job"))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (data) => {
    await api.put(`/jobs/${id}`, data);
    navigate("/dashboard");
  };

  if (loading) return <p className="center-text">Loading...</p>;

  if (error) {
    return (
      <div>
        <div className="alert-error">{error}</div>
        <p><Link to="/dashboard">Back to dashboard</Link></p>
      </div>
    );
  }

  return (
    <div>
      <h1>Edit Job</h1>
      {/* Only rendered after the job has loaded, so the form starts with the saved values */}
      <JobForm initialValues={job} onSubmit={handleSubmit} submitLabel="Save Changes" />
    </div>
  );
}
