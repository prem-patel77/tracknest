import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import Brand from "../components/Brand";
import ThemeToggle from "../components/ThemeToggle";
import StatusBadge from "../components/StatusBadge";
import StageProgress from "../components/StageProgress";
import SkeletonRows from "../components/SkeletonRows";
import SlowNote from "../components/SlowNote";
import { Icon } from "../components/Icons";
import { STATUSES } from "../utils/constants";
import { describeDeadline, DEADLINE_ICON } from "../utils/format";

// Made-up applications for the preview table. `days` is how far away the deadline is
// (negative = already passed), so the deadline words are always correct for today.
const SAMPLE_JOBS = [
  { company: "Bluefield Systems", title: "Backend Intern", status: "Applied", days: -3 },
  { company: "Northwind Labs", title: "Software Engineer Intern", status: "OA", days: 2 },
  { company: "Orbit Health", title: "Data Engineering Intern", status: "Interview", days: 12 },
  { company: "Kestrel Cloud", title: "Platform Intern", status: "Rejected", days: -9 },
];

// The three deadline wordings shown in the "Deadlines" module (tone = same names as describeDeadline)
const DEADLINE_EXAMPLES = [
  { tone: "overdue", text: "2 days overdue" },
  { tone: "soon", text: "In 3 days" },
  { tone: "later", text: "In 12 days" },
];

// Today plus N days as "YYYY-MM-DD" (the format describeDeadline expects)
function dateInDays(days) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  const pad = (n) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

// The deep-teal bar at the top: logo on the left, Log in and the theme button on the right
function LandingNav() {
  return (
    <header className="landing-nav">
      <div className="landing-nav-inner">
        <Brand />
        <nav className="landing-nav-links" aria-label="Account">
          <Link to="/login" className="landing-nav-link">Log in</Link>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}

// Loading state: shown while we check whether a saved login is still valid.
// Grey blocks in the shape of the page, plus a note if the free server is slow to wake up.
function LandingLoading() {
  return (
    <>
      <LandingNav />
      <main className="landing" aria-busy="true">
        <div className="landing-hero">
          <div className="landing-skeleton-text">
            <span className="skeleton" />
            <span className="skeleton" />
            <span className="skeleton" />
          </div>
          <div className="card landing-preview">
            <SkeletonRows rows={4} />
          </div>
        </div>
        <SlowNote />
      </main>
    </>
  );
}

// The public page at "/". It has no data to fetch, so the only waiting is the login check above.
export default function Landing() {
  const { user, loading } = useAuth();

  if (loading) return <LandingLoading />;

  // Already logged in? Skip the sales pitch.
  if (user) return <Navigate to="/dashboard" replace />;

  return (
    <>
      <a href="#main" className="skip-link">Skip to content</a>
      <LandingNav />

      <main className="landing" id="main">
        <div className="landing-hero">
          <div className="landing-copy">
            <span className="summary-label landing-tab">Job tracker for students</span>
            <h1>Know where every application stands.</h1>
            <p className="landing-lead">
              TrackNest lists every internship application like a league table: its stage, its
              progress and its deadline on one line, so you can see what needs you today.
            </p>
            <div className="landing-actions">
              <Link to="/demo" className="btn btn-inline">Try the demo</Link>
              <Link to="/login" className="btn btn-inline btn-outline">Log in</Link>
            </div>
            <p className="landing-note">
              No sign-up needed. The demo account is shared and filled with sample applications,
              so please don't enter personal details. Or{" "}
              <Link to="/register">create your own account</Link>.
            </p>
          </div>

          {/* A small preview of the real dashboard rows: stripe, rank, tag, pips, deadline */}
          <section className="card landing-preview" aria-label="Sample applications">
            <div className="summary-label">Ranked by what needs you next</div>
            <ol className="preview-list">
              {SAMPLE_JOBS.map((job, index) => {
                const deadline = describeDeadline(dateInDays(job.days), job.status);
                return (
                  // row-<status> sets the color of the stripe (same classes as the dashboard table)
                  <li key={job.company} className={`preview-row row-${job.status.toLowerCase()}`}>
                    <span className="preview-zone" aria-hidden="true" />
                    <span className="preview-rank">{index + 1}</span>
                    <span className="preview-main">
                      <span className="company-name">{job.company}</span>
                      <span className="cell-sub">{job.title}</span>
                    </span>
                    <span className="preview-status"><StatusBadge status={job.status} /></span>
                    <span className="preview-meta">
                      <StageProgress status={job.status} />
                      {/* Words plus an icon, so urgency never depends on color alone */}
                      <span className={`deadline-hint deadline-${deadline.tone}`}>
                        {DEADLINE_ICON[deadline.tone] && <Icon name={DEADLINE_ICON[deadline.tone]} size={14} />}
                        {deadline.hint || deadline.label}
                      </span>
                    </span>
                  </li>
                );
              })}
            </ol>
            <p className="preview-note">Sample data, not a real account.</p>
          </section>
        </div>

        <div className="landing-features">
          <section className="card landing-module">
            <div className="summary-label">Pipeline</div>
            <div className="landing-module-body">
              <h2>Six stages made for students</h2>
              <p>Online assessments get a stage of their own, because they are part of every internship search.</p>
              <ul className="landing-stages">
                {STATUSES.map((status) => (
                  <li key={status}>
                    <StatusBadge status={status} />
                    <StageProgress status={status} />
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <section className="card landing-module">
            <div className="summary-label">Deadlines</div>
            <div className="landing-module-body">
              <h2>Due dates written in words</h2>
              <p>
                Late ones say so in red with an alert icon. Ones due within a week say so in amber
                with a clock. Everything else stays quiet.
              </p>
              <ul className="landing-deadlines">
                {DEADLINE_EXAMPLES.map(({ tone, text }) => (
                  <li key={tone} className={`deadline-hint deadline-${tone}`}>
                    {DEADLINE_ICON[tone] && <Icon name={DEADLINE_ICON[tone]} size={14} />}
                    {text}
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </div>

        <section className="card landing-cta">
          <div>
            <h2>Look around with sample data</h2>
            <p>
              The demo account opens in one click. You can add, edit and delete jobs; its name,
              email and password are read-only.
            </p>
          </div>
          <div className="landing-actions">
            <Link to="/demo" className="btn btn-inline">Try the demo</Link>
            <Link to="/register" className="btn btn-inline btn-outline">Create an account</Link>
          </div>
        </section>

        <footer className="landing-footer">
          TrackNest is a portfolio project built with React, Express and PostgreSQL.
        </footer>
      </main>
    </>
  );
}
