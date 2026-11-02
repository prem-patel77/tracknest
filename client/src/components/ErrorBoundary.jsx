import { Component } from "react";

// Safety net for bugs: if any component crashes while rendering, React would show a blank page.
// An error boundary catches the crash and shows this message instead.
// (It must be a class component; React has no hook for this yet.)
export default class ErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error) {
    console.error(error);
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div className="auth-page">
        <div className="auth-card status-card">
          <div className="status-code">Oops</div>
          <h1>Something went wrong</h1>
          <p>An unexpected error happened. Reloading the page usually fixes it.</p>
          <button className="btn" onClick={() => window.location.assign("/dashboard")}>
            Reload TrackNest
          </button>
        </div>
      </div>
    );
  }
}
