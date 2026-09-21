import { useState } from "react";
import type { SosAlert } from "../../types/sos";
import { formatCoordinates, formatDateTime, getDisplayLocation, getMapsUrl } from "../../utils/sos";
import SosStatusBadge from "./SosStatusBadge";
import { resolveSosAlert } from "../../services/sosService";

type SosDetailPanelProps = {
  alert: SosAlert | null;
  onClose: () => void;
};

const displayOptional = (value: string | number | null | undefined) => {
  if (value === null || value === undefined || value === "") {
    return "Unavailable";
  }

  return String(value);
};

function SosDetailPanel({ alert, onClose }: SosDetailPanelProps) {
  const [isResolving, setIsResolving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!alert) {
    return null;
  }

  const handleResolve = async () => {
    if (!confirm("Mark this SOS as resolved?")) return;
    
    setIsResolving(true);
    setError(null);
    try {
      await resolveSosAlert(alert.sosId);
      setIsResolving(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to resolve SOS.");
      setIsResolving(false);
    }
  };

  const mapsUrl = getMapsUrl(alert);

  return (
    <div className="fixed inset-0 z-20 bg-slate-950/40 px-4 py-6" role="dialog" aria-modal="true" aria-labelledby="sos-detail-title">
      <div className="mx-auto flex max-h-full max-w-3xl flex-col overflow-hidden rounded-lg bg-white shadow-xl">
        <header className="border-b border-slate-200 px-5 py-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">SOS detail</p>
              <h2 id="sos-detail-title" className="text-xl font-semibold text-slate-950">
                {alert.name}
              </h2>
            </div>
            <div className="flex items-center gap-2">
              {error ? <span className="text-xs text-red-600 mr-2">{error}</span> : null}
              {alert.status === "ACTIVE" ? (
                <button
                  type="button"
                  className="rounded-md bg-emerald-600 px-3 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={handleResolve}
                  disabled={isResolving}
                >
                  {isResolving ? "Resolving..." : "Mark as Resolved"}
                </button>
              ) : null}
              <SosStatusBadge status={alert.status} />
              <button
                type="button"
                className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
                onClick={onClose}
              >
                Close
              </button>
            </div>
          </div>
        </header>

        <div className="overflow-y-auto p-5">
          <dl className="grid gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">SOS ID</dt>
              <dd className="mt-1 text-sm text-slate-950">{alert.sosId}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">User ID</dt>
              <dd className="mt-1 text-sm text-slate-950">{alert.userId}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Time</dt>
              <dd className="mt-1 text-sm text-slate-950">{formatDateTime(alert.createdAt)}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Coordinates</dt>
              <dd className="mt-1 text-sm text-slate-950">{formatCoordinates(alert)}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Location name</dt>
              <dd className="mt-1 text-sm text-slate-950">{displayOptional(alert.locationName)}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Address</dt>
              <dd className="mt-1 text-sm text-slate-950">{displayOptional(alert.address)}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Age</dt>
              <dd className="mt-1 text-sm text-slate-950">{displayOptional(alert.age)}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Blood group</dt>
              <dd className="mt-1 text-sm text-slate-950">{displayOptional(alert.bloodGroup)}</dd>
            </div>
          </dl>

          <section className="mt-6 rounded-lg border border-slate-200 bg-slate-50 p-4">
            <h3 className="text-sm font-semibold text-slate-950">Emergency contacts</h3>
            {alert.emergencyContacts.length > 0 ? (
              <div className="mt-3 grid gap-3">
                {alert.emergencyContacts.map((contact, index) => (
                  <article key={`${contact.phone ?? contact.name ?? "contact"}-${index}`} className="rounded-md border border-slate-200 bg-white p-3">
                    <p className="text-sm font-medium text-slate-950">{displayOptional(contact.name)}</p>
                    <p className="mt-1 text-xs text-slate-600">{displayOptional(contact.relationship)}</p>
                    <p className="mt-2 text-sm text-slate-800">{displayOptional(contact.phone)}</p>
                  </article>
                ))}
              </div>
            ) : (
              <p className="mt-2 text-sm text-slate-600">No emergency contacts were included in this SOS record.</p>
            )}
          </section>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            {mapsUrl ? (
              <a
                className="inline-flex justify-center rounded-md border border-slate-900 bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
                href={mapsUrl}
                target="_blank"
                rel="noreferrer"
              >
                Open in Maps
              </a>
            ) : null}
            <p className="text-sm text-slate-600">Primary display location: {getDisplayLocation(alert)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SosDetailPanel;
