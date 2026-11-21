import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import AuthLayout from "../components/AuthLayout";
import ErrorAlert from "../components/ErrorAlert";
import SkeletonRows from "../components/SkeletonRows";
import SlowNote from "../components/SlowNote";
import { DEMO_EMAIL } from "../utils/constants";
import { getErrorMessage } from "../utils/getErrorMessage";

// Public demo account (created by `npm run seed`). The password is not a secret:
// it is already shown in the README so anyone can try the app.
const DEMO_PASSWORD = "Demo1234!";

// Logs in as the demo user and opens the dashboard. If it fails, the message is shown on the page.
function openDemo(login, navigate, setError) {
  login(DEMO_EMAIL, DEMO_PASSWORD)
    .then(() => navigate("/dashboard", { replace: true }))
    .catch((err) => setError(getErrorMessage(err, "Could not open the demo")));
}

// Visiting /demo logs in as the demo user and opens the dashboard, so a link
// on a resume goes straight into the app.
export default function DemoLogin() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  // React dev mode runs effects twice; this makes sure we only log in once
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    openDemo(login, navigate, setError);
  }, [login, navigate]);

  // "Try again": clearing the error shows the loading state again, then we retry
  const retry = () => {
    setError("");
    openDemo(login, navigate, setError);
  };

  // Error state: a red message with a Try again button, plus ways out
  if (error) {
    return (
      <AuthLayout>
        <div className="auth-card">
          <h1>Demo unavailable</h1>
          <p className="auth-subtitle">We could not open the shared demo account.</p>
          <ErrorAlert message={error} onRetry={retry} />
          <div className="demo-links">
            <Link to="/login">Log in instead</Link>
            <Link to="/">Back to home</Link>
          </div>
        </div>
      </AuthLayout>
    );
  }

  // Loading state: grey rows in the shape of the dashboard table. The server is on a
  // free tier, so the first request can be slow (SlowNote appears after 4 seconds).
  return (
    <AuthLayout>
      <div className="auth-card" aria-busy="true">
        <h1>Opening the demo</h1>
        <p className="auth-subtitle" role="status">Signing in to the shared demo account...</p>
        <div className="card demo-skeleton">
          <SkeletonRows rows={3} />
        </div>
        <SlowNote />
      </div>
    </AuthLayout>
  );
}
