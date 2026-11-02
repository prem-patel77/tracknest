import { useState } from "react";
import { Link, Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import Spinner from "../components/Spinner";
import Brand from "../components/Brand";
import { getErrorMessage } from "../utils/getErrorMessage";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Login() {
  const { user, loading, login } = useAuth();
  const navigate = useNavigate();
  // The 401 handler in api/axios.js sends expired sessions here as /login?expired=1
  const [searchParams] = useSearchParams();
  const sessionExpired = searchParams.get("expired") === "1";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({}); // per-field messages
  const [serverError, setServerError] = useState(""); // message from the API
  const [submitting, setSubmitting] = useState(false);

  // Already logged in? Skip the form.
  if (!loading && user) return <Navigate to="/dashboard" replace />;

  // Check the inputs before calling the API
  const validate = () => {
    const newErrors = {};
    if (!email.trim()) newErrors.email = "Email is required";
    else if (!EMAIL_REGEX.test(email.trim())) newErrors.email = "Please enter a valid email";
    if (!password) newErrors.password = "Password is required";
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
      await login(email.trim(), password);
      navigate("/dashboard");
    } catch (err) {
      // Show the server's message, or a fallback if the server is unreachable
      setServerError(getErrorMessage(err, "Could not log in"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit} noValidate>
        <Brand />
        <h1>Log in</h1>
        <p className="auth-subtitle">Welcome back! Log in to see your applications.</p>

        {sessionExpired && !serverError && (
          <div className="alert-info">Your session expired. Please log in again.</div>
        )}
        {serverError && <div className="alert-error" role="alert">{serverError}</div>}

        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {errors.email && <p className="field-error">{errors.email}</p>}

        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {errors.password && <p className="field-error">{errors.password}</p>}

        <button type="submit" className="btn" disabled={submitting}>
          {submitting && <Spinner small />}
          {submitting ? "Logging in..." : "Log in"}
        </button>

        <p className="auth-switch">
          No account? <Link to="/register">Register</Link>
        </p>
      </form>
    </div>
  );
}
