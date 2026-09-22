import EmptyState from "../components/common/EmptyState";
import KpiCard from "../components/dashboard/KpiCard";
import StatusBadge from "../components/common/StatusBadge";
import { useAdminData } from "../context/AdminDataContext";
import { getDailyIncidentCounts, getStatusDistribution } from "../utils/reports";
import { getSosDashboardStats } from "../utils/sos";

function ReportsPage() {
  const { sosAlerts } = useAdminData();
  const stats = getSosDashboardStats(sosAlerts);
  const statusDistribution = getStatusDistribution(sosAlerts);
  const dailyCounts = getDailyIncidentCounts(sosAlerts);
  const maxDailyCount = Math.max(...dailyCounts.map((item) => item.count), 1);

  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-xl font-semibold text-slate-950">Reports</h1>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
              Report summaries derived from the same shared SOS data source used across the dashboard.
            </p>
          </div>
          <StatusBadge tone="neutral">Read-only reports</StatusBadge>
        </div>
      </section>

      {sosAlerts.length === 0 ? (
        <EmptyState
          badge="No report data"
          title="No SOS records are available for reports"
          description="Reports will render once the data source supplies SOS records."
        />
      ) : (
        <>
          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label="Report summary metrics">
            <KpiCard label="Total SOS" value={stats.totalSos} helperText="All local incident records" />
            <KpiCard label="Active SOS" value={stats.activeSos} helperText="Current active display data" tone="danger" />
            <KpiCard label="Recent incidents" value={stats.recentIncidents} helperText="Created in the last 24 hours" tone="warning" />
            <KpiCard label="Users involved" value={stats.usersAssociated} helperText="Unique user identifiers" tone="success" />
          </section>

          <section className="grid gap-6 xl:grid-cols-2">
            <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-950">Status Distribution</h2>
              <div className="mt-4 space-y-4">
                {statusDistribution.map((item) => {
                  const percentage = stats.totalSos > 0 ? Math.round((item.count / stats.totalSos) * 100) : 0;

                  return (
                    <div key={item.status}>
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium text-slate-800">{item.status === "ACTIVE" ? "Active" : "Resolved"}</span>
                        <span className="text-slate-600">
                          {item.count} records, {percentage}%
                        </span>
                      </div>
                      <div className="mt-2 h-3 overflow-hidden rounded-full bg-slate-100">
                        <div
                          className={`h-full rounded-full ${item.status === "ACTIVE" ? "bg-red-600" : "bg-emerald-600"}`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </article>

            <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-950">Incident Counts Over Time</h2>
              <div className="mt-4 space-y-4">
                {dailyCounts.map((item) => {
                  const width = Math.max((item.count / maxDailyCount) * 100, 8);

                  return (
                    <div key={item.label} className="grid grid-cols-[120px_1fr_40px] items-center gap-3 text-sm">
                      <span className="text-slate-600">{item.label}</span>
                      <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                        <div className="h-full rounded-full bg-slate-700" style={{ width: `${width}%` }} />
                      </div>
                      <span className="text-right font-medium text-slate-950">{item.count}</span>
                    </div>
                  );
                })}
              </div>
            </article>
          </section>
        </>
      )}
    </div>
  );
}

export default ReportsPage;
