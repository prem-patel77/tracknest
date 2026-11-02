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

// Chart colors for each status (match the badge colors in index.css)
export const STATUS_COLORS = {
  Saved: "#94a3b8",
  Applied: "#3b82f6",
  OA: "#f59e0b",
  Interview: "#8b5cf6",
  Offer: "#22c55e",
  Rejected: "#ef4444",
};
