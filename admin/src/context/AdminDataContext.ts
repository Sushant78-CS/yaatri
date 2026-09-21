import { createContext, useContext } from "react";
import type { SosAlert } from "../types/sos";
import type { UserIncidentSummary } from "../utils/users";
import type { SystemAdministrator } from "../types/adminManagement";

export type AdminDataStatus = "loading" | "ready" | "empty" | "restricted" | "unauthorized" | "config-missing" | "error";

export type AdminRole = "admin" | "superadmin" | null;

export type AdminDataContextValue = {
  sosAlerts: SosAlert[];
  users: UserIncidentSummary[];
  administrators: SystemAdministrator[];
  status: AdminDataStatus;
  message: string;
  role: AdminRole;
  isSuperAdmin: boolean;
};

export const AdminDataContext = createContext<AdminDataContextValue | null>(null);

export const useAdminData = () => {
  const value = useContext(AdminDataContext);

  if (!value) {
    throw new Error("useAdminData must be used inside AdminDataProvider.");
  }

  return value;
};
