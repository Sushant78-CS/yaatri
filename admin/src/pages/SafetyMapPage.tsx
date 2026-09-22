import { useMemo, useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import StatusBadge from "../components/common/StatusBadge";
import SosStatusBadge from "../components/sos/SosStatusBadge";
import { useAdminData } from "../context/AdminDataContext";
import type { SosAlert, SosStatus } from "../types/sos";
import { formatCoordinates, formatDateTime, getDisplayLocation, sortByCreatedAtDesc, getMapsUrl } from "../utils/sos";

// Custom icons using standard Tailwind colors to match the legend
const activeIcon = L.divIcon({
  className: "bg-transparent",
  html: `<div style="background-color: #dc2626; width: 16px; height: 16px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 4px rgba(0,0,0,0.5);"></div>`,
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});

const resolvedIcon = L.divIcon({
  className: "bg-transparent",
  html: `<div style="background-color: #059669; width: 16px; height: 16px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 4px rgba(0,0,0,0.5);"></div>`,
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});

function MapUpdater({ center }: { center: [number, number] | null }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, map.getZoom(), { animate: true });
    }
  }, [center, map]);
  return null;
}

function SafetyMapPage() {
  const [statusFilter, setStatusFilter] = useState<SosStatus | "ALL">("ALL");
  const [selectedIncidentId, setSelectedIncidentId] = useState<string | null>(null);
  const { sosAlerts, status: dataStatus, message: dataMessage } = useAdminData();

  const incidentsWithCoordinates = useMemo(
    () =>
      sortByCreatedAtDesc(sosAlerts).filter(
        (alert) =>
          alert.latitude !== null &&
          alert.longitude !== null &&
          (statusFilter === "ALL" ? true : alert.status === statusFilter),
      ),
    [sosAlerts, statusFilter],
  );

  const selectedIncident: SosAlert | undefined =
    incidentsWithCoordinates.find((alert) => alert.sosId === selectedIncidentId) ?? incidentsWithCoordinates[0];

  const mapCenter: [number, number] | null =
    selectedIncident?.latitude !== null && selectedIncident?.longitude !== null && selectedIncident !== undefined
      ? [selectedIncident.latitude, selectedIncident.longitude]
      : incidentsWithCoordinates.length > 0 &&
        incidentsWithCoordinates[0].latitude !== null &&
        incidentsWithCoordinates[0].longitude !== null
      ? [incidentsWithCoordinates[0].latitude, incidentsWithCoordinates[0].longitude]
      : null;

  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-xl font-semibold text-slate-950">Emergency & Safety Map</h1>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
              Incident-focused map workspace for SOS locations. This view does not track ordinary users or movement
              history.
            </p>
          </div>
          <StatusBadge tone="neutral">{`${incidentsWithCoordinates.length} incident locations`}</StatusBadge>
        </div>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm" aria-label="Map filters">
        <label className="block max-w-xs">
          <span className="text-sm font-medium text-slate-700">Incident status</span>
          <select
            className="mt-2 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-950 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100"
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value as SosStatus | "ALL")}
          >
            <option value="ALL">All incidents</option>
            <option value="ACTIVE">Active only</option>
            <option value="RESOLVED">Resolved display</option>
          </select>
        </label>
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="flex flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm h-[600px] xl:h-auto xl:min-h-[600px]">
          <div className="border-b border-slate-200 px-5 py-4 shrink-0">
            <h2 className="text-lg font-semibold text-slate-950">Incident Map</h2>
            <p className="mt-1 text-sm text-slate-600">Live visualization of SOS coordinates.</p>
          </div>
          <div className="relative flex-1 bg-slate-100 min-h-0 z-0">
            {dataStatus === "loading" ? (
              <div className="absolute inset-0 grid place-items-center bg-slate-50">
                <p className="text-sm font-medium text-slate-600">Loading map data...</p>
              </div>
            ) : dataStatus === "error" || dataStatus === "restricted" || dataStatus === "unauthorized" ? (
              <div className="absolute inset-0 grid place-items-center bg-slate-50 p-6 text-center">
                <p className="text-sm font-semibold text-red-600">Map unavailable</p>
                <p className="mt-2 text-sm text-slate-600">{dataMessage}</p>
              </div>
            ) : mapCenter ? (
              <MapContainer center={mapCenter} zoom={13} style={{ height: "100%", width: "100%" }}>
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <MapUpdater center={mapCenter} />
                {incidentsWithCoordinates.map((alert) => {
                  if (alert.latitude === null || alert.longitude === null) return null;
                  return (
                    <Marker
                      key={alert.sosId}
                      position={[alert.latitude, alert.longitude]}
                      icon={alert.status === "ACTIVE" ? activeIcon : resolvedIcon}
                      eventHandlers={{
                        click: () => setSelectedIncidentId(alert.sosId),
                      }}
                    >
                      <Popup>
                        <div className="text-sm">
                          <p className="font-semibold text-slate-950">{alert.name}</p>
                          <p className="text-slate-700 mt-1">{alert.status}</p>
                          <p className="text-xs text-slate-500 mt-1">{getDisplayLocation(alert)}</p>
                          <p className="text-xs text-slate-400 mt-1">{formatDateTime(alert.createdAt)}</p>
                          <a
                            href={getMapsUrl(alert) || "#"}
                            target="_blank"
                            rel="noreferrer"
                            className="mt-2 inline-block text-xs font-medium text-red-600 hover:underline"
                          >
                            Open in Google Maps
                          </a>
                        </div>
                      </Popup>
                    </Marker>
                  );
                })}
              </MapContainer>
            ) : (
              <div className="absolute inset-0 grid place-items-center bg-slate-50 p-6 text-center">
                <div className="max-w-md">
                  <p className="text-sm font-semibold text-slate-950">No locations to display</p>
                  <p className="mt-2 text-sm text-slate-600">
                    There are currently no SOS incidents with valid coordinates matching your filter.
                  </p>
                </div>
              </div>
            )}
          </div>
          <div className="flex flex-wrap gap-3 border-t border-slate-200 px-5 py-4 text-sm text-slate-700 shrink-0">
            <span className="font-semibold text-slate-950">Legend:</span>
            <span className="inline-flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-red-600" aria-hidden="true" /> Active SOS
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-emerald-600" aria-hidden="true" /> Resolved display
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-slate-400" aria-hidden="true" /> Coordinates unavailable
            </span>
          </div>
        </div>

        <aside className="space-y-4 xl:max-h-[600px] xl:overflow-y-auto pr-2">
          <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-950">Selected Incident</h2>
            {selectedIncident ? (
              <div className="mt-4 space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-semibold text-slate-950">{selectedIncident.name}</p>
                  <SosStatusBadge status={selectedIncident.status} />
                </div>
                <p className="text-sm text-slate-700">{getDisplayLocation(selectedIncident)}</p>
                <p className="text-sm text-slate-600">{formatCoordinates(selectedIncident)}</p>
                <p className="text-xs text-slate-500">{formatDateTime(selectedIncident.createdAt)}</p>
              </div>
            ) : (
              <p className="mt-3 text-sm text-slate-600">No incidents with coordinates match this filter.</p>
            )}
          </section>

          <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-950">Incident Locations</h2>
            <div className="mt-4 space-y-3">
              {incidentsWithCoordinates.length > 0 ? (
                incidentsWithCoordinates.map((alert) => (
                  <button
                    key={alert.sosId}
                    type="button"
                    className={`w-full rounded-md border p-3 text-left hover:bg-slate-50 ${
                      selectedIncident?.sosId === alert.sosId ? "border-red-300 bg-red-50" : "border-slate-200 bg-white"
                    }`}
                    onClick={() => setSelectedIncidentId(alert.sosId)}
                  >
                    <span className="flex items-center justify-between gap-3">
                      <span className="font-medium text-slate-950 truncate pr-2">{alert.name}</span>
                      <span className="text-xs text-slate-500 shrink-0">{alert.status}</span>
                    </span>
                    <span className="mt-1 block text-sm text-slate-600">{getDisplayLocation(alert)}</span>
                  </button>
                ))
              ) : (
                <p className="text-sm text-slate-600">No coordinate-backed incidents are available for this filter.</p>
              )}
            </div>
          </section>
        </aside>
      </section>
    </div>
  );
}

export default SafetyMapPage;
