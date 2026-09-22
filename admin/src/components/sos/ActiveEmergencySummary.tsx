import type { SosAlert } from "../../types/sos";
import { formatDateTime, getDisplayLocation } from "../../utils/sos";
import EmptyState from "../common/EmptyState";
import SosStatusBadge from "./SosStatusBadge";

type ActiveEmergencySummaryProps = {
  alerts: SosAlert[];
  onViewDetails: (alert: SosAlert) => void;
};

function ActiveEmergencySummary({ alerts, onViewDetails }: ActiveEmergencySummaryProps) {
  const activeAlerts = alerts.filter((alert) => alert.status === "ACTIVE");

  if (activeAlerts.length === 0) {
    return (
      <EmptyState
        badge="No active alerts"
        title="No active emergencies in the local mock dataset"
        description="When Firestore is connected, this area should prioritize currently active SOS incidents."
      />
    );
  }

  return (
    <section className="rounded-lg border border-red-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-950">Active Emergency Summary</h2>
          <p className="mt-1 text-sm text-slate-600">Current active SOS records from local mock data.</p>
        </div>
        <SosStatusBadge status="ACTIVE" />
      </div>

      <div className="mt-4 grid gap-3">
        {activeAlerts.slice(0, 3).map((alert) => (
          <article key={alert.sosId} className="rounded-md border border-slate-200 bg-slate-50 p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h3 className="font-semibold text-slate-950">{alert.name}</h3>
                <p className="mt-1 text-sm text-slate-700">{getDisplayLocation(alert)}</p>
                <p className="mt-1 text-xs text-slate-500">{formatDateTime(alert.createdAt)}</p>
              </div>
              <button
                type="button"
                className="rounded-md border border-red-200 bg-white px-3 py-2 text-sm font-medium text-red-800 hover:bg-red-50"
                onClick={() => onViewDetails(alert)}
              >
                View details
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default ActiveEmergencySummary;
