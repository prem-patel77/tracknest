import { useState } from "react";
import { Link, Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import AuthLayout from "../components/AuthLayout";
import Field from "../components/Field";
import ErrorAlert from "../components/ErrorAlert";
import Notice from "../components/Notice";
import Spinner from "../components/Spinner";
import { LIMITS } from "../utils/constants";
import { clearOnChange, focusFirstError, validateEmail } from "../utils/forms";
import { getErrorMessage } from "../utils/getErrorMessage";

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
    const emailError = validateEmail(email);
    if (emailError) newErrors.email = emailError;
    if (!password) newErrors.password = "Enter your password";
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
    <AuthLayout>
      <form className="auth-card" onSubmit={handleSubmit} noValidate>
        <h1>Log in</h1>
        <p className="auth-subtitle">Welcome back. Log in to see your applications.</p>

        {sessionExpired && !serverError && <Notice>Your session expired. Please log in again.</Notice>}
        <ErrorAlert message={serverError} />

        <Field
          id="email"
          label="Email"
          type="email"
          value={email}
          onChange={clearOnChange(setEmail, setErrors, "email")}
          error={errors.email}
          maxLength={LIMITS.email}
          autoComplete="email"
        />
        <Field
          id="password"
          label="Password"
          type="password"
          value={password}
          onChange={clearOnChange(setPassword, setErrors, "password")}
          error={errors.password}
          maxLength={LIMITS.password}
          autoComplete="current-password"
        />

        <button type="submit" className="btn" disabled={submitting}>
          {submitting && <Spinner small />}
          {submitting ? "Logging in..." : "Log in"}
        </button>

        {/* One-click demo for visitors: /demo logs in as the demo user */}
        <Link to="/demo" className="btn btn-outline demo-btn">Try the demo account</Link>
        <p className="auth-hint">Sample data, no sign-up needed.</p>

        <p className="auth-switch">
          No account? <Link to="/register">Register</Link>
        </p>
      </form>
    </AuthLayout>
  );
}
