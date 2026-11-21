// Grey placeholders in the shape of the job form (two modules with a few fields each).
// Shown on the Edit page while the saved job is loading.
// The counts are approximate: one placeholder per row of the real form
// (module 1: two field pairs + the link, module 2: a pair + the notes box).
const FIELDS_PER_MODULE = [3, 3];

export default function FormSkeleton() {
  return (
    <div className="form-stack" aria-busy="true">
      {FIELDS_PER_MODULE.map((fieldCount, module) => (
        <div className="module" key={module}>
          <div className="module-tab">
            <span className="skeleton skeleton-tab" />
          </div>
          <div className="module-body">
            {Array.from({ length: fieldCount }, (_, field) => (
              <div className="field" key={field}>
                <span className="skeleton skeleton-label" />
                <span className="skeleton skeleton-input" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
