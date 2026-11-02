import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import Spinner from "../components/Spinner";
import Brand from "../components/Brand";
import { LIMITS } from "../utils/constants";
import { getErrorMessage } from "../utils/getErrorMessage";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Register() {
  const { user, loading, register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Already logged in? Skip the form.
  if (!loading && user) return <Navigate to="/dashboard" replace />;

  // Same rules as the server (password min 8 chars), so errors show instantly
  const validate = () => {
    const newErrors = {};
    if (!name.trim()) newErrors.name = "Name is required";
    if (!email.trim()) newErrors.email = "Email is required";
    else if (!EMAIL_REGEX.test(email.trim())) newErrors.email = "Please enter a valid email";
    if (!password) newErrors.password = "Password is required";
    else if (password.length < 8) newErrors.password = "Password must be at least 8 characters";
    else if (password.length > LIMITS.password) newErrors.password = `Password must be at most ${LIMITS.password} characters`;
    if (confirmPassword !== password) newErrors.confirmPassword = "Passwords do not match";
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
      await register(name.trim(), email.trim(), password);
      navigate("/dashboard");
    } catch (err) {
      // e.g. "Email is already registered"
      setServerError(getErrorMessage(err, "Could not create account"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit} noValidate>
        <Brand />
        <h1>Create account</h1>
        <p className="auth-subtitle">Start tracking your internship applications.</p>

        {serverError && <div className="alert-error" role="alert">{serverError}</div>}

        <label htmlFor="name">Name</label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={LIMITS.name}
          autoComplete="name"
        />
        {errors.name && <p className="field-error">{errors.name}</p>}

        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          maxLength={LIMITS.email}
          autoComplete="email"
        />
        {errors.email && <p className="field-error">{errors.email}</p>}

        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          maxLength={LIMITS.password}
          autoComplete="new-password"
        />
        {errors.password && <p className="field-error">{errors.password}</p>}

        <label htmlFor="confirmPassword">Confirm password</label>
        <input
          id="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          maxLength={LIMITS.password}
          autoComplete="new-password"
        />
        {errors.confirmPassword && <p className="field-error">{errors.confirmPassword}</p>}

        <button type="submit" className="btn" disabled={submitting}>
          {submitting && <Spinner small />}
          {submitting ? "Creating account..." : "Register"}
        </button>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </form>
    </div>
  );
}
