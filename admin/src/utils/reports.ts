import type { SosAlert, SosStatus } from "../types/sos";
import { toDate } from "./sos";

export type StatusDistribution = {
  status: SosStatus;
  count: number;
};

export type DailyIncidentCount = {
  label: string;
  count: number;
};

export const getStatusDistribution = (alerts: SosAlert[]): StatusDistribution[] => [
  {
    status: "ACTIVE",
    count: alerts.filter((alert) => alert.status === "ACTIVE").length,
  },
  {
    status: "RESOLVED",
    count: alerts.filter((alert) => alert.status === "RESOLVED").length,
  },
];

export const getDailyIncidentCounts = (alerts: SosAlert[]): DailyIncidentCount[] => {
  const counts = alerts.reduce<Record<string, number>>((accumulator, alert) => {
    const createdAt = toDate(alert.createdAt);
    const key = createdAt ? createdAt.toISOString().slice(0, 10) : "Date unavailable";
    accumulator[key] = (accumulator[key] ?? 0) + 1;
    return accumulator;
  }, {});

  return Object.entries(counts)
    .map(([label, count]) => ({ label, count }))
    .sort((first, second) => first.label.localeCompare(second.label));
};
