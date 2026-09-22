import type { SosAlert, SosStatus, SosTimestamp } from "../types/sos";

export type SosDateFilter = "all" | "24h" | "7d";

export type SosDashboardStats = {
  totalSos: number;
  activeSos: number;
  recentIncidents: number;
  usersAssociated: number;
};

export const toDate = (timestamp: SosTimestamp): Date | null => {
  if (!timestamp) {
    return null;
  }

  if (timestamp instanceof Date) {
    return Number.isNaN(timestamp.getTime()) ? null : timestamp;
  }

  if (typeof timestamp === "string") {
    const parsed = new Date(timestamp);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }

  const parsed = new Date(timestamp.seconds * 1000);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

export const formatDateTime = (timestamp: SosTimestamp) => {
  const date = toDate(timestamp);

  if (!date) {
    return "Time unavailable";
  }

  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
};

export const formatCoordinates = (alert: SosAlert) => {
  if (alert.latitude === null || alert.longitude === null) {
    return "Coordinates unavailable";
  }

  return `${alert.latitude.toFixed(5)}, ${alert.longitude.toFixed(5)}`;
};

export const getDisplayLocation = (alert: SosAlert) => {
  const locationName = alert.locationName?.trim();
  const address = alert.address?.trim();

  if (locationName && locationName !== "Unknown") {
    return locationName;
  }

  if (address && address !== "Unknown") {
    return address;
  }

  if (alert.latitude !== null && alert.longitude !== null) {
    return formatCoordinates(alert);
  }

  return "Location unknown";
};

export const getMapsUrl = (alert: SosAlert) => {
  if (alert.latitude === null || alert.longitude === null) {
    return null;
  }

  return `https://www.google.com/maps/search/?api=1&query=${alert.latitude},${alert.longitude}`;
};

export const getSosDashboardStats = (alerts: SosAlert[], now = new Date()): SosDashboardStats => {
  const oneDayAgo = now.getTime() - 24 * 60 * 60 * 1000;
  const recentIncidents = alerts.filter((alert) => {
    const createdAt = toDate(alert.createdAt);
    return createdAt ? createdAt.getTime() >= oneDayAgo : false;
  }).length;

  return {
    totalSos: alerts.length,
    activeSos: alerts.filter((alert) => alert.status === "ACTIVE").length,
    recentIncidents,
    usersAssociated: new Set(alerts.map((alert) => alert.userId)).size,
  };
};

export const sortByCreatedAtDesc = (alerts: SosAlert[]) =>
  [...alerts].sort((first, second) => {
    const firstDate = toDate(first.createdAt)?.getTime() ?? 0;
    const secondDate = toDate(second.createdAt)?.getTime() ?? 0;
    return secondDate - firstDate;
  });

export const filterSosAlerts = (
  alerts: SosAlert[],
  searchTerm: string,
  status: SosStatus | "ALL",
  dateFilter: SosDateFilter,
  now = new Date(),
) => {
  const normalizedSearch = searchTerm.trim().toLowerCase();
  const minimumTime =
    dateFilter === "24h"
      ? now.getTime() - 24 * 60 * 60 * 1000
      : dateFilter === "7d"
        ? now.getTime() - 7 * 24 * 60 * 60 * 1000
        : null;

  return sortByCreatedAtDesc(alerts).filter((alert) => {
    const matchesSearch = normalizedSearch
      ? [alert.sosId, alert.userId, alert.name, alert.address, alert.locationName, alert.bloodGroup]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(normalizedSearch))
      : true;

    const matchesStatus = status === "ALL" ? true : alert.status === status;
    const createdAt = toDate(alert.createdAt);
    const matchesDate = minimumTime === null ? true : createdAt ? createdAt.getTime() >= minimumTime : false;

    return matchesSearch && matchesStatus && matchesDate;
  });
};
