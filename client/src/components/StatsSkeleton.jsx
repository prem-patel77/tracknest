// Grey placeholders in the shape of the Statistics page: five stat modules and two chart modules.
// Used while the chart code downloads (App.jsx) and while the numbers load (Statistics.jsx).
export default function StatsSkeleton() {
  return (
    <div aria-busy="true">
      <div className="summary-cards">
        {[1, 2, 3, 4, 5].map((n) => (
          <div className="summary-card" key={n}>
            <div className="summary-label">
              <span className="skeleton skeleton-tab" />
            </div>
            <div className="summary-value">
              <span className="skeleton skeleton-value" />
            </div>
          </div>
        ))}
      </div>

      <div className="chart-grid">
        {[1, 2].map((n) => (
          <div className="module" key={n}>
            <div className="module-tab">
              <span className="skeleton skeleton-tab" />
            </div>
            <div className="module-body chart-body">
              <span className="skeleton skeleton-chart" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
