import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { PieChart, Pie, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import api from "../api/axios";
import ErrorAlert from "../components/ErrorAlert";
import EmptyState from "../components/EmptyState";
import SlowNote from "../components/SlowNote";
import StatsSkeleton from "../components/StatsSkeleton";
import { Icon } from "../components/Icons";
import { STATUSES, STATUS_COLORS } from "../utils/constants";
import { getErrorMessage } from "../utils/getErrorMessage";

// Chart colors are CSS variables (see index.css), so the charts follow the light / dark theme.
// Recharts draws plain SVG, so we pass var(--...) strings instead of hex codes.
const AXIS_TICK = { fill: "var(--ink-muted)", fontSize: 12 };

// People who ask for less motion get charts that appear without the 400ms grow-in.
// (CSS cannot stop recharts' animation, because recharts animates with JavaScript, so we check here.)
const ANIMATE = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// "2026-11" -> "Nov" (under each bar) or "November 2026" (in the tooltip and the table)
const monthDate = (value) => {
  const [year, month] = value.split("-");
  return new Date(Number(year), Number(month) - 1, 1);
};
const shortMonth = (value) => monthDate(value).toLocaleString("en", { month: "short" });
const longMonth = (value) => monthDate(value).toLocaleString("en", { month: "long", year: "numeric" });

// The small box that appears when you hover a slice or a bar: the number first, then what it is.
// - color: the swatch color for the bar chart (always a var(--...) string).
//   Pie slices carry their own `fill` in the data, so the pie does not pass it.
function ChartTooltip({ active, payload, label, unit, color }) {
  if (!active || !payload?.length) return null;
  const item = payload[0];

  return (
    <div className="chart-tooltip">
      <span className="legend-swatch" style={{ background: color ?? item.payload.fill }} />
      <strong>{item.value}</strong> {unit}
      <span className="chart-tooltip-label">{label ?? item.name}</span>
    </div>
  );
}

// Module 1: pie chart of jobs by status, with a table under it that doubles as the legend
function StatusChart({ byStatus, total }) {
  // One slice per status that has at least one job
  const pieData = STATUSES.filter((s) => byStatus[s] > 0).map((s) => ({
    name: s,
    value: byStatus[s],
    fill: STATUS_COLORS[s],
  }));

  return (
    <section className="module">
      <h2 className="module-tab">Jobs by status</h2>
      <div className="module-body chart-body">
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              outerRadius="90%"
              stroke="var(--surface)"
              strokeWidth={2}
              isAnimationActive={ANIMATE}
              animationDuration={400}
            />
            <Tooltip content={<ChartTooltip unit="jobs" />} />
          </PieChart>
        </ResponsiveContainer>

        {/* The legend is also the table view: every status with its count and share.
            Colour is never the only label, and it shows statuses that have no jobs yet. */}
        <table className="chart-table status-legend">
          <thead>
            <tr>
              <th>Status</th>
              <th>Jobs</th>
              <th>Share</th>
            </tr>
          </thead>
          <tbody>
            {STATUSES.map((s) => (
              <tr key={s}>
                <td>
                  <span className="legend-swatch" style={{ background: STATUS_COLORS[s] }} />
                  {s}
                </td>
                <td>{byStatus[s]}</td>
                <td>{Math.round((byStatus[s] / total) * 100)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

// Module 2: bar chart of jobs added in each of the last 12 months
function MonthChart({ byMonth }) {
  // The server already sends the last 12 months, oldest first.
  // If all 12 are zero (every job is older than a year) there is nothing to draw.
  const hasJobs = byMonth.some((m) => m.count > 0);

  return (
    <section className="module">
      <h2 className="module-tab">Applications per month</h2>
      <div className="module-body chart-body">
        {hasJobs ? (
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={byMonth}>
              <CartesianGrid stroke="var(--line-soft)" vertical={false} />
              <XAxis
                dataKey="month"
                tickFormatter={shortMonth}
                tick={AXIS_TICK}
                tickLine={false}
                stroke="var(--line)"
                interval="equidistantPreserveStart"
              />
              <YAxis allowDecimals={false} width={28} tick={AXIS_TICK} tickLine={false} axisLine={false} />
              <Tooltip
                content={<ChartTooltip unit="jobs added" color="var(--teal-main)" />}
                labelFormatter={longMonth}
                cursor={{ fill: "var(--wash)" }}
              />
              <Bar
                dataKey="count"
                fill="var(--teal-main)"
                barSize={20}
                radius={[4, 4, 0, 0]}
                isAnimationActive={ANIMATE}
                animationDuration={400}
              />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="chart-note">No jobs were added in the last 12 months.</p>
        )}

        {/* Table view: the same numbers without needing to hover */}
        <details className="chart-details">
          <summary>View as table</summary>
          <table className="chart-table">
            <thead>
              <tr>
                <th>Month</th>
                <th>Jobs added</th>
              </tr>
            </thead>
            <tbody>
              {byMonth.map((m) => (
                <tr key={m.month}>
                  <td>{longMonth(m.month)}</td>
                  <td>{m.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </details>
      </div>
    </section>
  );
}

export default function Statistics() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");

  // Same endpoint the dashboard cards use; it also returns the per-month counts
  const loadStats = () => {
    api
      .get("/jobs/stats")
      .then((res) => setStats(res.data))
      .catch((err) => setError(getErrorMessage(err, "Could not load statistics")));
  };
  useEffect(loadStats, []);

  // "Try again": go back to the loading state, then repeat the request
  const retry = () => {
    setError("");
    loadStats();
  };

  // Pick what to show under the title: error, loading, or the real page
  let body;
  if (error) {
    body = <ErrorAlert message={error} onRetry={retry} />;
  } else if (!stats) {
    body = (
      <>
        <StatsSkeleton />
        <SlowNote />
      </>
    );
  } else {
    const { total, byStatus, byMonth } = stats;

    // Summary cards. "Active" = still in progress (not rejected, not an offer yet)
    const active = byStatus.Applied + byStatus.OA + byStatus.Interview;
    const cards = [
      { label: "Total", value: total },
      { label: "Active", value: active },
      { label: "Interviews", value: byStatus.Interview },
      { label: "Offers", value: byStatus.Offer },
      { label: "Rejected", value: byStatus.Rejected },
    ];

    body = (
      <>
        <div className="summary-cards">
          {cards.map((card) => (
            <div className="summary-card" key={card.label}>
              <div className="summary-label">{card.label}</div>
              <div className="summary-value">{card.value}</div>
            </div>
          ))}
        </div>

        {total === 0 ? (
          <EmptyState icon="chart" title="No data yet" text="Add some jobs to see your charts.">
            <Link to="/jobs/new" className="btn btn-inline">
              <Icon name="plus" size={16} />
              Add a job
            </Link>
          </EmptyState>
        ) : (
          <div className="chart-grid">
            <StatusChart byStatus={byStatus} total={total} />
            <MonthChart byMonth={byMonth} />
          </div>
        )}
      </>
    );
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Statistics</h1>
          <p className="page-subtitle">See how your search is going.</p>
        </div>
      </div>
      {body}
    </div>
  );
}
