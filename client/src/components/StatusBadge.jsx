// Small colored label that shows a job's status, e.g. "Interview"
export default function StatusBadge({ status }) {
  return <span className={`badge badge-${status.toLowerCase()}`}>{status}</span>;
}
