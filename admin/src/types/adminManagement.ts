export type SystemRole = "admin" | "superadmin";

export type SystemAdministrator = {
  uid: string;
  email: string;
  role: SystemRole;
  createdAt: Date | string | null;
};
