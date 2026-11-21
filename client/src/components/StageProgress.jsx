import { STATUSES } from "../utils/constants";

// The five pipeline stages, in order (every status except "Rejected"). Each one is a small bar ("pip").
const STAGES = STATUSES.filter((status) => status !== "Rejected");

// Shows how far a job has got: the filled pips are the stages reached.
// Example: "OA" fills 3 of the 5 pips.
// A rejected job shows 5 empty pips, because we don't know how far it got.
export default function StageProgress({ status }) {
  const rejected = status === "Rejected";
  const reached = STAGES.indexOf(status) + 1; // Saved = 1 ... Offer = 5 (Rejected = 0)
  const label = rejected ? "Rejected" : `Stage ${reached} of ${STAGES.length}: ${status}`;

  return (
    // role="img" + aria-label: screen readers say the label instead of reading five empty boxes
    <span className={`stage stage-${status.toLowerCase()}`} role="img" aria-label={label}>
      {STAGES.map((stage, index) => (
        <span key={stage} className={index < reached ? "pip pip-on" : "pip"} />
      ))}
    </span>
  );
}
