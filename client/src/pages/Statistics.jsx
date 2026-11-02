import { useEffect, useState } from "react";
import {
  PieChart, Pie, Cell, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer,
} from "recharts";
import api from "../api/axios";
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
  useEffect(() => {
    api
      .get("/jobs/stats")
      .then((res) => setStats(res.data))
      .catch((err) => setError(getErrorMessage(err, "Could not load statistics")));
  }, []);

  if (error) return <div className="alert-error">{error}</div>;
  if (!stats) return <p className="center-text">Loading...</p>;

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

  // Pie chart data: one slice per status that has at least one job
  const pieData = STATUSES.map((s) => ({ name: s, value: byStatus[s] })).filter((d) => d.value > 0);

  // Bar chart data: the server already sends the last 12 months, oldest first
  const barData = byMonth.map((m) => ({ month: formatMonth(m.month), count: m.count }));

  return (
    <div>
      <div className="page-header">
        <h1>Statistics</h1>
      </div>

      <div className="summary-cards">
        {cards.map((card) => (
          <div className="summary-card" key={card.label}>
            <div className="summary-value">{card.value}</div>
            <div className="summary-label">{card.label}</div>
          </div>
        ))}
      </div>

      {total === 0 ? (
        <p className="center-text">No data yet. Add some jobs to see your charts!</p>
      ) : (
        <div className="chart-grid">
          <section className="chart-card">
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

          <section className="chart-card">
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
