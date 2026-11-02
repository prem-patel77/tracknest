import { useEffect, useState } from "react";
import {
  PieChart, Pie, Cell, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer,
} from "recharts";
import api from "../api/axios";
import PageLoader from "../components/PageLoader";
import ErrorAlert from "../components/ErrorAlert";
import EmptyState from "../components/EmptyState";
import { Link } from "react-router-dom";
import { STATUSES, STATUS_COLORS } from "../utils/constants";
import { getErrorMessage } from "../utils/getErrorMessage";

// "2026-11" -> "Nov 26" (the label under each bar)
const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const formatMonth = (value) => {
  const [year, month] = value.split("-");
  return `${MONTH_NAMES[Number(month) - 1]} ${year.slice(2)}`;
};

export default function Statistics() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");

  // Same endpoint the dashboard cards use; it also returns the per-month counts
  const loadStats = () => {
    api
      .get("/jobs/stats")
      .then((res) => {
        setStats(res.data);
        setError("");
      })
      .catch((err) => setError(getErrorMessage(err, "Could not load statistics")));
  };
  useEffect(loadStats, []);

  if (error) return <ErrorAlert message={error} onRetry={loadStats} />;
  if (!stats) return <PageLoader text="Loading statistics..." />;

  const { total, byStatus, byMonth } = stats;

  // Summary cards. "Active" = still in progress (not rejected, not an offer yet)
  const active = byStatus.Applied + byStatus.OA + byStatus.Interview;
  const cards = [
    { label: "Total", value: total, accent: "var(--primary)" },
    { label: "Active", value: active, accent: STATUS_COLORS.Applied },
    { label: "Interviews", value: byStatus.Interview, accent: STATUS_COLORS.Interview },
    { label: "Offers", value: byStatus.Offer, accent: STATUS_COLORS.Offer },
    { label: "Rejected", value: byStatus.Rejected, accent: STATUS_COLORS.Rejected },
  ];

  // Pie chart data: one slice per status that has at least one job
  const pieData = STATUSES.map((s) => ({ name: s, value: byStatus[s] })).filter((d) => d.value > 0);

  // Bar chart data: the server already sends the last 12 months, oldest first
  const barData = byMonth.map((m) => ({ month: formatMonth(m.month), count: m.count }));

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Statistics</h1>
          <p className="page-subtitle">See how your search is going.</p>
        </div>
      </div>

      <div className="summary-cards">
        {cards.map((card) => (
          <div className="summary-card" key={card.label} style={{ "--accent": card.accent }}>
            <div className="summary-label">{card.label}</div>
            <div className="summary-value">{card.value}</div>
          </div>
        ))}
      </div>

      {total === 0 ? (
        <EmptyState icon="chart" title="No data yet" text="Add some jobs to see your charts.">
          <Link to="/jobs/new" className="btn btn-inline">Add a job</Link>
        </EmptyState>
      ) : (
        <div className="chart-grid">
          <section className="chart-card card">
            <h2>Jobs by status</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" outerRadius="80%" label>
                  {pieData.map((d) => (
                    <Cell key={d.name} fill={STATUS_COLORS[d.name]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </section>

          <section className="chart-card card">
            <h2>Applications per month</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" fontSize={12} interval="preserveStartEnd" />
                <YAxis allowDecimals={false} width={30} />
                <Tooltip />
                <Bar dataKey="count" name="Jobs added" fill="#0d9488" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </section>
        </div>
      )}
    </div>
  );
}
