// Grey placeholder rows (shaped like the job table) shown while data loads.
// - rows: how many rows to draw. Put it inside a box with the "card" class.
export default function SkeletonRows({ rows }) {
  return Array.from({ length: rows }, (_, row) => (
    <div className="skeleton-row" key={row}>
      {[1, 2, 3, 4].map((bar) => (
        <span className="skeleton" key={bar} />
      ))}
    </div>
  ));
}
