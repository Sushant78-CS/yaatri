export type AdminSectionId = "dashboard" | "sos-alerts" | "safety-map" | "users" | "reports" | "admin-management";

export type AdminSection = {
  id: AdminSectionId;
  label: string;
  description: string;
  requiresSuperAdmin?: boolean;
};
