import { useState } from "react";
import { Link } from "react-router-dom";
import { STATUSES, LIMITS } from "../utils/constants";

// Used by both the Add Job and Edit Job pages.
// - initialValues: starting field values (empty for "add", the saved job for "edit")
// - onSubmit: async function that receives the cleaned form data and saves it
// - submitLabel: text on the button, e.g. "Add Job"
const EMPTY_JOB = {
  company: "",
  job_title: "",
  location: "",
  salary: "",
  status: "Saved",
  deadline: "",
  job_url: "",
  notes: "",
};

export default function JobForm({ initialValues = EMPTY_JOB, onSubmit, submitLabel }) {
  const [form, setForm] = useState({ ...EMPTY_JOB, ...initialValues });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // One handler for every input: update the field whose name matches
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Check the inputs before calling the API
  const validate = () => {
    const newErrors = {};
    if (!form.company.trim()) newErrors.company = "Company is required";
    if (!form.job_title.trim()) newErrors.job_title = "Job title is required";
    if (form.job_url.trim()) {
      try {
        const { protocol } = new URL(form.job_url.trim());
        if (protocol !== "http:" && protocol !== "https:") throw new Error("not a web link");
      } catch {
        newErrors.job_url = "Please enter a valid URL starting with http:// or https://";
      }
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");

    const newErrors = validate();
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setSubmitting(true);
    try {
      await onSubmit({
        ...form,
        company: form.company.trim(),
        job_title: form.job_title.trim(),
        job_url: form.job_url.trim(),
      });
    } catch (err) {
      setServerError(err.response?.data?.message || "Could not reach the server");
      setSubmitting(false);
    }
  };

  return (
    <form className="form-card" onSubmit={handleSubmit} noValidate>
      {serverError && <div className="alert-error">{serverError}</div>}

      <label htmlFor="company">Company *</label>
      <input id="company" name="company" value={form.company} onChange={handleChange} maxLength={LIMITS.company} />
      {errors.company && <p className="field-error">{errors.company}</p>}

      <label htmlFor="job_title">Job title *</label>
      <input id="job_title" name="job_title" value={form.job_title} onChange={handleChange} maxLength={LIMITS.job_title} />
      {errors.job_title && <p className="field-error">{errors.job_title}</p>}

      <label htmlFor="location">Location</label>
      <input id="location" name="location" value={form.location} onChange={handleChange} maxLength={LIMITS.location} />

      <label htmlFor="salary">Salary</label>
      <input id="salary" name="salary" value={form.salary} onChange={handleChange} maxLength={LIMITS.salary} />

      <label htmlFor="status">Status</label>
      <select id="status" name="status" value={form.status} onChange={handleChange}>
        {STATUSES.map((s) => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>

      <label htmlFor="deadline">Deadline</label>
      <input id="deadline" name="deadline" type="date" value={form.deadline} onChange={handleChange} />

      <label htmlFor="job_url">Job URL</label>
      <input id="job_url" name="job_url" value={form.job_url} onChange={handleChange} placeholder="https://..." />
      {errors.job_url && <p className="field-error">{errors.job_url}</p>}

      <label htmlFor="notes">Notes</label>
      <textarea id="notes" name="notes" rows="4" value={form.notes} onChange={handleChange} maxLength={LIMITS.notes} />

      <div className="form-actions">
        <button type="submit" className="btn btn-inline" disabled={submitting}>
          {submitting ? "Saving..." : submitLabel}
        </button>
        <Link to="/dashboard" className="btn btn-inline btn-outline">Cancel</Link>
      </div>
    </form>
  );
}
