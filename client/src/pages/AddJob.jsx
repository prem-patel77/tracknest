import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import JobForm from "../components/JobForm";

export default function AddJob() {
  const navigate = useNavigate();

  // Send the new job to the API, then go back to the dashboard.
  // If it fails, JobForm catches the error and shows the message.
  const handleSubmit = async (data) => {
    await api.post("/jobs", data);
    navigate("/dashboard");
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Add Job</h1>
          <p className="page-subtitle">Save a new application to your tracker.</p>
        </div>
      </div>
      <JobForm onSubmit={handleSubmit} submitLabel="Add Job" />
    </div>
  );
}
