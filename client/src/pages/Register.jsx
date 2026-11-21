import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import AuthLayout from "../components/AuthLayout";
import Field from "../components/Field";
import ErrorAlert from "../components/ErrorAlert";
import Spinner from "../components/Spinner";
import { LIMITS } from "../utils/constants";
import { clearOnChange, focusFirstError, validateConfirm, validateEmail, validatePassword } from "../utils/forms";
import { getErrorMessage } from "../utils/getErrorMessage";

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
    if (!name.trim()) newErrors.name = "Enter your name";
    const emailError = validateEmail(email);
    if (emailError) newErrors.email = emailError;
    const passwordError = validatePassword(password);
    if (passwordError) newErrors.password = passwordError;
    const confirmError = validateConfirm(confirmPassword, password);
    if (confirmError) newErrors.confirmPassword = confirmError;
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
    <AuthLayout>
      <form className="auth-card" onSubmit={handleSubmit} noValidate>
        <h1>Create account</h1>
        <p className="auth-subtitle">Start tracking your internship applications.</p>

        <ErrorAlert message={serverError} />

        <Field
          id="name"
          label="Name"
          value={name}
          onChange={clearOnChange(setName, setErrors, "name")}
          error={errors.name}
          maxLength={LIMITS.name}
          autoComplete="name"
        />
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
          hint="At least 8 characters."
          maxLength={LIMITS.password}
          autoComplete="new-password"
        />
        <Field
          id="confirmPassword"
          label="Confirm password"
          type="password"
          value={confirmPassword}
          onChange={clearOnChange(setConfirmPassword, setErrors, "confirmPassword")}
          error={errors.confirmPassword}
          maxLength={LIMITS.password}
          autoComplete="new-password"
        />

        <button type="submit" className="btn" disabled={submitting}>
          {submitting && <Spinner small />}
          {submitting ? "Creating account..." : "Create account"}
        </button>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </form>
    </AuthLayout>
  );
}
