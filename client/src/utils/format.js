const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// "2026-11-14" -> "Nov 14, 2026". Split by hand instead of new Date(string) to avoid timezone shifts.
export function formatDate(value) {
  if (!value) return "-";
  const [year, month, day] = value.split("-").map(Number);
  return `${MONTHS[month - 1]} ${day}, ${year}`;
}

// Describes a job's deadline: { label, hint, tone }
// tone: "overdue" (red), "soon" (amber, within 7 days) or "" (normal)
// Finished jobs (Offer / Rejected) never count as overdue.
export function describeDeadline(deadline, status) {
  if (!deadline) return { label: "-", hint: "", tone: "" };

  const [year, month, day] = deadline.split("-").map(Number);
  const today = new Date();
  const todayMidnight = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());
  const days = Math.round((Date.UTC(year, month - 1, day) - todayMidnight) / 86400000); // days from today

  const label = formatDate(deadline);
  if (status === "Offer" || status === "Rejected") return { label, hint: "", tone: "" };
  if (days < 0) return { label, hint: `${-days} ${-days === 1 ? "day" : "days"} overdue`, tone: "overdue" };
  if (days === 0) return { label, hint: "Due today", tone: "soon" };
  if (days <= 7) return { label, hint: `In ${days} ${days === 1 ? "day" : "days"}`, tone: "soon" };
  return { label, hint: `In ${days} days`, tone: "" };
}

// Picks a stable soft color for a company's letter avatar, so "Google" is always the same color
export function avatarColors(name) {
  let hash = 0;
  for (const char of name) hash = (hash * 31 + char.charCodeAt(0)) % 360;
  return { background: `hsl(${hash} 65% 93%)`, color: `hsl(${hash} 55% 30%)` };
}
