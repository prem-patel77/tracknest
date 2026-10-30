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
      <h1>Add Job</h1>
      <JobForm onSubmit={handleSubmit} submitLabel="Add Job" />
    </div>
  );
}
