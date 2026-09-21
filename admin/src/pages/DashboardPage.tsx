import { useState } from "react";
import EmptyState from "../components/common/EmptyState";
import ActiveEmergencySummary from "../components/sos/ActiveEmergencySummary";
import SosDetailPanel from "../components/sos/SosDetailPanel";
import SosTable from "../components/sos/SosTable";
import KpiCard from "../components/dashboard/KpiCard";
import StatusBadge from "../components/common/StatusBadge";
import { useAdminData } from "../context/AdminDataContext";
import type { SosAlert } from "../types/sos";
import { getSosDashboardStats, sortByCreatedAtDesc } from "../utils/sos";

function DashboardPage() {
  const [selectedAlert, setSelectedAlert] = useState<SosAlert | null>(null);
  const { sosAlerts } = useAdminData();
  const stats = getSosDashboardStats(sosAlerts);
  const recentAlerts = sortByCreatedAtDesc(sosAlerts).slice(0, 5);

  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-xl font-semibold text-slate-950">Emergency Operations Overview</h1>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
              Read-only overview derived from the shared admin SOS data source.
            </p>
          </div>
          <StatusBadge tone="warning">Read-only</StatusBadge>
        </div>
      </section>

      {sosAlerts.length === 0 ? (
        <EmptyState
          badge="No records"
          title="No SOS incidents available"
          description="No SOS records are currently available from the admin data source."
        />
      ) : (
        <>
          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label="SOS summary metrics">
            <KpiCard label="Total SOS" value={stats.totalSos} helperText="All local SOS records" />
            <KpiCard label="Active SOS" value={stats.activeSos} helperText="Require operator attention" tone="danger" />
            <KpiCard label="Recent incidents" value={stats.recentIncidents} helperText="Created in the last 24 hours" tone="warning" />
            <KpiCard
              label="Users associated"
              value={stats.usersAssociated}
              helperText="Unique users in incident records"
              tone="success"
            />
          </section>

          <ActiveEmergencySummary alerts={sosAlerts} onViewDetails={setSelectedAlert} />

          <section className="space-y-3">
            <div>
              <h2 className="text-lg font-semibold text-slate-950">Recent SOS Incidents</h2>
              <p className="mt-1 text-sm text-slate-600">Most recent local SOS records, sorted by createdAt.</p>
            </div>
            <SosTable
              alerts={recentAlerts}
              emptyTitle="No recent SOS incidents"
              emptyDescription="Recent incident rows will appear here when records are available."
              onViewDetails={setSelectedAlert}
            />
          </section>
        </>
      )}

      <SosDetailPanel alert={selectedAlert} onClose={() => setSelectedAlert(null)} />
    </div>
  );
}

export default DashboardPage;
