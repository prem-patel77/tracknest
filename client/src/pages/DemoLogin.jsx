import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import PageLoader from "../components/PageLoader";
import { getErrorMessage } from "../utils/getErrorMessage";

// Public demo account (created by `npm run seed`). The password is not a secret:
// it is already shown in the README so anyone can try the app.
const DEMO_EMAIL = "demo@tracknest.dev";
const DEMO_PASSWORD = "Demo1234!";

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

    login(DEMO_EMAIL, DEMO_PASSWORD)
      .then(() => navigate("/dashboard", { replace: true }))
      .catch((err) => setError(getErrorMessage(err, "Could not open the demo")));
  }, [login, navigate]);

  if (error) {
    return (
      <div className="auth-page">
        <div className="auth-card">
          <h1>Demo unavailable</h1>
          <div className="alert-error" role="alert">{error}</div>
          <p className="auth-switch">
            <Link to="/login">Go to the login page</Link>
          </p>
        </div>
      </div>
    );
  }

  // The server is on a free tier, so the first request can be slow
  return <PageLoader text="Opening the demo... (the server may take a moment to wake up)" />;
}
