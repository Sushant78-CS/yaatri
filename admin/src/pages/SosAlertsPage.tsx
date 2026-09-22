import { useMemo, useState } from "react";
import EmptyState from "../components/common/EmptyState";
import SosDetailPanel from "../components/sos/SosDetailPanel";
import SosTable from "../components/sos/SosTable";
import StatusBadge from "../components/common/StatusBadge";
import { useAdminData } from "../context/AdminDataContext";
import type { SosAlert, SosStatus } from "../types/sos";
import type { SosDateFilter } from "../utils/sos";
import { filterSosAlerts } from "../utils/sos";

function SosAlertsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<SosStatus | "ALL">("ALL");
  const [dateFilter, setDateFilter] = useState<SosDateFilter>("all");
  const [selectedAlert, setSelectedAlert] = useState<SosAlert | null>(null);
  const { sosAlerts } = useAdminData();

  const filteredAlerts = useMemo(
    () => filterSosAlerts(sosAlerts, searchTerm, statusFilter, dateFilter),
    [dateFilter, searchTerm, sosAlerts, statusFilter],
  );

  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-xl font-semibold text-slate-950">SOS Alerts</h1>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
              Search, filter, and inspect read-only SOS records from the shared admin data source.
            </p>
          </div>
          <StatusBadge tone="danger">{`${filteredAlerts.length} shown`}</StatusBadge>
        </div>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm" aria-label="SOS alert filters">
        <div className="grid gap-4 lg:grid-cols-[1fr_180px_180px]">
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Search alerts</span>
            <input
              className="mt-2 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-950 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100"
              type="search"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search by user, SOS ID, location, blood group"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-slate-700">Status</span>
            <select
              className="mt-2 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-950 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100"
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value as SosStatus | "ALL")}
            >
              <option value="ALL">All statuses</option>
              <option value="ACTIVE">Active</option>
              <option value="RESOLVED">Resolved</option>
            </select>
          </label>

          <label className="block">
            <span className="text-sm font-medium text-slate-700">Time range</span>
            <select
              className="mt-2 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-950 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100"
              value={dateFilter}
              onChange={(event) => setDateFilter(event.target.value as SosDateFilter)}
            >
              <option value="all">All time</option>
              <option value="24h">Last 24 hours</option>
              <option value="7d">Last 7 days</option>
            </select>
          </label>
        </div>
      </section>

      {sosAlerts.length === 0 ? (
        <EmptyState
          badge="No records"
          title="No SOS alerts are available"
          description="No SOS records are currently available from the admin data source."
        />
      ) : (
        <SosTable
          alerts={filteredAlerts}
          emptyTitle="No alerts match these filters"
          emptyDescription="Try a different search term, status, or time range."
          onViewDetails={setSelectedAlert}
        />
      )}

      <SosDetailPanel alert={selectedAlert} onClose={() => setSelectedAlert(null)} />
    </div>
  );
}

export default SosAlertsPage;
