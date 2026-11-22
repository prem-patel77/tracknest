import { useState } from "react";
import { Link } from "react-router-dom";
import { STATUSES, LIMITS } from "../utils/constants";
import { focusFirstError } from "../utils/forms";
import { getErrorMessage } from "../utils/getErrorMessage";
import Field from "./Field";
import ErrorAlert from "./ErrorAlert";
import Spinner from "./Spinner";

// Used by both the Add job and Edit job pages.
// - initialValues: starting field values (empty for "add", the saved job for "edit")
// - onSubmit: async function that receives the cleaned form data and saves it
// - submitLabel: text on the button, e.g. "Add job"
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

  // One handler for every input: update the field whose name matches, and clear its error
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  // Check the inputs before calling the API (errors are added in the order the fields appear)
  const validate = () => {
    const newErrors = {};
    if (!form.company.trim()) newErrors.company = "Enter the company name";
    if (!form.job_title.trim()) newErrors.job_title = "Enter the job title";
    if (form.job_url.trim()) {
      try {
        const { protocol } = new URL(form.job_url.trim());
        if (protocol !== "http:" && protocol !== "https:") throw new Error("not a web link");
      } catch {
        newErrors.job_url = "Enter a web link that starts with http:// or https://";
      }
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");

    const newErrors = validate();
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return focusFirstError(newErrors);

    setSubmitting(true);
    try {
      await onSubmit({
        ...form,
        company: form.company.trim(),
        job_title: form.job_title.trim(),
        job_url: form.job_url.trim(),
      });
    } catch (err) {
      setServerError(getErrorMessage(err, "Could not save job"));
      setSubmitting(false);
    }
  };

  // The ids below match the keys in `form` and `errors`, so one handler can serve every field
  return (
    <form className="form-stack" onSubmit={handleSubmit} noValidate>
      {/* Module 1: what the job is. .form-row puts two fields side by side on wide screens */}
      <section className="module">
        <h2 className="module-tab">Job</h2>
        <div className="module-body">
          <div className="form-row">
            <Field
              id="company"
              label="Company"
              required
              value={form.company}
              onChange={handleChange}
              error={errors.company}
              maxLength={LIMITS.company}
            />
            <Field
              id="job_title"
              label="Job title"
              required
              value={form.job_title}
              onChange={handleChange}
              error={errors.job_title}
              maxLength={LIMITS.job_title}
            />
          </div>
          <div className="form-row">
            <Field id="location" label="Location" value={form.location} onChange={handleChange} maxLength={LIMITS.location} />
            <Field id="salary" label="Salary" value={form.salary} onChange={handleChange} maxLength={LIMITS.salary} />
          </div>
          <Field
            id="job_url"
            label="Job link"
            type="url"
            value={form.job_url}
            onChange={handleChange}
            error={errors.job_url}
            placeholder="https://..."
          />
        </div>
      </section>

      {/* Module 2: where it stands */}
      <section className="module">
        <h2 className="module-tab">Status and notes</h2>
        <div className="module-body">
          <div className="form-row">
            <Field as="select" id="status" label="Status" value={form.status} onChange={handleChange}>
              {STATUSES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </Field>
            <Field id="deadline" label="Deadline" type="date" value={form.deadline} onChange={handleChange} />
          </div>
          <Field
            as="textarea"
            id="notes"
            label="Notes"
            rows="4"
            value={form.notes}
            onChange={handleChange}
            maxLength={LIMITS.notes}
          />
        </div>
      </section>

      {/* A save error sits right above the buttons, where the user is looking */}
      <ErrorAlert message={serverError} />

      <div className="form-actions">
        <button type="submit" className="btn btn-inline" disabled={submitting}>
          {submitting && <Spinner small />}
          {submitting ? "Saving..." : submitLabel}
        </button>
        <Link
          to="/dashboard"
          className={submitting ? "btn btn-inline btn-outline is-disabled" : "btn btn-inline btn-outline"}
          aria-disabled={submitting}
          onClick={(e) => submitting && e.preventDefault()}
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
