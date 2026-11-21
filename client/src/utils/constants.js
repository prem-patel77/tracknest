// The allowed job statuses (must match the CHECK constraint in server/schema.sql)
export const STATUSES = ["Saved", "Applied", "OA", "Interview", "Offer", "Rejected"];

// Choices for the "Sort by" dropdown. value = "field:direction", sent to the API as sortBy + order
export const SORT_OPTIONS = [
  { value: "created_at:desc", label: "Newest first" },
  { value: "created_at:asc", label: "Oldest first" },
  { value: "company:asc", label: "Company (A-Z)" },
  { value: "company:desc", label: "Company (Z-A)" },
  { value: "deadline:asc", label: "Deadline (soonest)" },
  { value: "deadline:desc", label: "Deadline (latest)" },
  { value: "status:asc", label: "Status (Saved to Rejected)" },
  { value: "status:desc", label: "Status (Rejected to Saved)" },
];

// Chart colors for each status. These are CSS variables (defined in index.css), not hex codes,
// so the charts switch automatically between the light and dark theme.
// Example: "OA" -> "var(--status-oa)"
export const STATUS_COLORS = Object.fromEntries(
  STATUSES.map((status) => [status, `var(--status-${status.toLowerCase()})`])
);

// The shared demo account (created by `npm run seed`). The server blocks profile and
// password changes for it, so the Profile page uses this email to explain why.
export const DEMO_EMAIL = "demo@tracknest.dev";

// Max text lengths (must match server/utils/validators.js and the columns in schema.sql)
export const LIMITS = {
  name: 100,
  email: 255,
  password: 72,
  company: 150,
  job_title: 150,
  location: 150,
  salary: 50,
  notes: 5000,
};
