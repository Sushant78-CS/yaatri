import type { SosAlert } from "../../types/sos";
import { formatDateTime, getDisplayLocation } from "../../utils/sos";
import EmptyState from "../common/EmptyState";
import SosStatusBadge from "./SosStatusBadge";

type SosTableProps = {
  alerts: SosAlert[];
  emptyTitle: string;
  emptyDescription: string;
  onViewDetails: (alert: SosAlert) => void;
};

function SosTable({ alerts, emptyTitle, emptyDescription, onViewDetails }: SosTableProps) {
  if (alerts.length === 0) {
    return <EmptyState title={emptyTitle} description={emptyDescription} />;
  }

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
          <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-600">
            <tr>
              <th scope="col" className="px-4 py-3">
                User
              </th>
              <th scope="col" className="px-4 py-3">
                Location
              </th>
              <th scope="col" className="px-4 py-3">
                Time
              </th>
              <th scope="col" className="px-4 py-3">
                Status
              </th>
              <th scope="col" className="px-4 py-3 text-right">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {alerts.map((alert) => (
              <tr key={alert.sosId} className="align-top">
                <td className="px-4 py-4">
                  <p className="font-medium text-slate-950">{alert.name}</p>
                  <p className="mt-1 text-xs text-slate-500">{alert.sosId}</p>
                </td>
                <td className="max-w-xs px-4 py-4 text-slate-700">{getDisplayLocation(alert)}</td>
                <td className="px-4 py-4 text-slate-700">{formatDateTime(alert.createdAt)}</td>
                <td className="px-4 py-4">
                  <SosStatusBadge status={alert.status} />
                </td>
                <td className="px-4 py-4 text-right">
                  <button
                    type="button"
                    className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
                    onClick={() => onViewDetails(alert)}
                  >
                    View details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default SosTable;
