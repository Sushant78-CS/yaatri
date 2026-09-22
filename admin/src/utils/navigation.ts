import type { AdminSection } from "../types/navigation";

export const adminSections: AdminSection[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    description: "Operational overview for emergency monitoring and tourist safety.",
  },
  {
    id: "sos-alerts",
    label: "SOS Alerts",
    description: "Review active and historical SOS incidents from the mobile application.",
  },
  {
    id: "safety-map",
    label: "Emergency & Safety Map",
    description: "Map-based view for incident locations and nearby safety context.",
  },
  {
    id: "users",
    label: "Users",
    description: "Tourist profile and emergency contact information for authorized review.",
  },
  {
    id: "reports",
    label: "Reports",
    description: "Basic reporting workspace for incident summaries and safety trends.",
  },
  {
    id: "admin-management",
    label: "Admin Management",
    description: "Manage system administrators and roles.",
    requiresSuperAdmin: true,
  },
];

export const getAdminSection = (sectionId: AdminSection["id"]) =>
  adminSections.find((section) => section.id === sectionId) ?? adminSections[0];
