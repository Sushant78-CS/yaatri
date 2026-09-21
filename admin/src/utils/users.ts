import type { SosAlert } from "../types/sos";
import type { AdminUser } from "../types/user";
import { formatDateTime, sortByCreatedAtDesc } from "./sos";

export type UserIncidentSummary = AdminUser & {
  incidentCount: number;
  activeIncidentCount: number;
  latestIncidentTime: string;
};

export const getUserIncidentSummaries = (users: AdminUser[], alerts: SosAlert[]): UserIncidentSummary[] =>
  users.map((user) => {
    const userAlerts = alerts.filter((alert) => alert.userId === user.userId);
    const latestAlert = sortByCreatedAtDesc(userAlerts)[0];

    return {
      ...user,
      incidentCount: userAlerts.length,
      activeIncidentCount: userAlerts.filter((alert) => alert.status === "ACTIVE").length,
      latestIncidentTime: latestAlert ? formatDateTime(latestAlert.createdAt) : "No incidents",
    };
  });

export const filterUserSummaries = (users: UserIncidentSummary[], searchTerm: string, status: "all" | "active-only") => {
  const normalizedSearch = searchTerm.trim().toLowerCase();

  return users.filter((user) => {
    const matchesSearch = normalizedSearch
      ? [user.userId, user.name, user.profileStatus].some((value) => value.toLowerCase().includes(normalizedSearch))
      : true;
    const matchesStatus = status === "active-only" ? user.activeIncidentCount > 0 : true;

    return matchesSearch && matchesStatus;
  });
};
