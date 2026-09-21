import { useMemo, useState } from "react";
import AuthPanel from "../components/auth/AuthPanel";
import DataStateNotice from "../components/common/DataStateNotice";
import Sidebar from "../components/layout/Sidebar";
import Topbar from "../components/layout/Topbar";
import { useAdminData } from "../context/AdminDataContext";
import DashboardPage from "../pages/DashboardPage";
import ReportsPage from "../pages/ReportsPage";
import SafetyMapPage from "../pages/SafetyMapPage";
import SosAlertsPage from "../pages/SosAlertsPage";
import UsersPage from "../pages/UsersPage";
import AdminManagementPage from "../pages/AdminManagementPage";
import type { AdminSectionId } from "../types/navigation";
import { adminSections, getAdminSection } from "../utils/navigation";

function AdminLayout() {
  const [activeSection, setActiveSection] = useState<AdminSectionId>("dashboard");
  const { status, message, isSuperAdmin } = useAdminData();
  const section = useMemo(() => getAdminSection(activeSection), [activeSection]);
  const shouldShowAuthPanel = status === "unauthorized";
  const shouldShowOnlyNotice = status === "loading" || status === "config-missing" || status === "error";

  const allowedSections = useMemo(() => {
    return adminSections.filter(sec => !sec.requiresSuperAdmin || isSuperAdmin);
  }, [isSuperAdmin]);

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <div className="lg:flex">
        <Sidebar activeSection={activeSection} sections={allowedSections} onSectionChange={setActiveSection} />
        <div className="min-w-0 flex-1">
          <Topbar section={section} />
          <main className="px-4 py-6 sm:px-6 lg:px-8">
            {shouldShowAuthPanel ? <AuthPanel /> : null}
            {shouldShowOnlyNotice ? <DataStateNotice status={status} message={message} /> : null}
            {status === "restricted" ? <DataStateNotice status={status} message={message} /> : null}

            {!shouldShowAuthPanel && !shouldShowOnlyNotice ? (
              <div className="mt-6 first:mt-0">
                {activeSection === "dashboard" ? <DashboardPage /> : null}
                {activeSection === "sos-alerts" ? <SosAlertsPage /> : null}
                {activeSection === "safety-map" ? <SafetyMapPage /> : null}
                {activeSection === "users" ? <UsersPage /> : null}
                {activeSection === "reports" ? <ReportsPage /> : null}
                {activeSection === "admin-management" && isSuperAdmin ? <AdminManagementPage /> : null}
              </div>
            ) : null}
          </main>
        </div>
      </div>
    </div>
  );
}

export default AdminLayout;
