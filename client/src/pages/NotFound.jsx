import { Link } from "react-router-dom";

// Shown for any URL that does not exist, e.g. /nothing-here
export default function NotFound() {
  return (
    <div className="empty-state card">
      <div className="status-code">404</div>
      <h2>Page not found</h2>
      <p>The page you are looking for doesn't exist or has been moved.</p>
      <Link to="/dashboard" className="btn btn-inline">Back to dashboard</Link>
    </div>
  );
}
