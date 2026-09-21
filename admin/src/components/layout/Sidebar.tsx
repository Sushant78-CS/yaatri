import type { AdminSection, AdminSectionId } from "../../types/navigation";
import { useFirebaseAuth } from "../../hooks/useFirebaseAuth";
import { signOutAdminUser } from "../../services/authService";

type SidebarProps = {
  activeSection: AdminSectionId;
  sections: AdminSection[];
  onSectionChange: (sectionId: AdminSectionId) => void;
};

function Sidebar({ activeSection, sections, onSectionChange }: SidebarProps) {
  const { user, role } = useFirebaseAuth();
  const displayRole = role === "superadmin" ? "Superadmin" : "Administrator";

  const handleLogout = async () => {
    try {
      await signOutAdminUser();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <aside className="border-b border-slate-200 bg-white lg:min-h-screen lg:w-72 lg:border-b-0 lg:border-r">
      <div className="flex items-center justify-between px-4 py-4 lg:block lg:px-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-red-700">Yaatri</p>
          <h1 className="text-lg font-bold text-slate-950">Admin Console</h1>
        </div>
        <div className="hidden rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-xs font-medium text-slate-600 sm:block lg:mt-4 lg:inline-block">
          Phase 1 Shell
        </div>
      </div>

      <nav aria-label="Admin sections" className="flex gap-2 overflow-x-auto px-4 pb-4 lg:block lg:space-y-1 lg:px-4">
        {sections.map((section) => {
          const isActive = section.id === activeSection;

          return (
            <button
              className={`min-w-max rounded-md px-3 py-2 text-left text-sm font-medium transition-colors lg:flex lg:w-full lg:min-w-0 lg:items-center lg:justify-between ${
                isActive
                  ? "bg-red-50 text-red-800 ring-1 ring-inset ring-red-200"
                  : "text-slate-700 hover:bg-slate-100 hover:text-slate-950"
              }`}
              type="button"
              key={section.id}
              aria-current={isActive ? "page" : undefined}
              onClick={() => onSectionChange(section.id)}
            >
              <span>{section.label}</span>
              {isActive ? <span className="hidden text-xs text-red-700 lg:inline">Active</span> : null}
            </button>
          );
        })}
      </nav>

      <div className="hidden border-t border-slate-200 p-4 lg:block">
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <p className="text-sm font-semibold text-slate-950 truncate">{user?.email || "Admin User"}</p>
          <p className="mt-1 text-xs text-slate-600">{displayRole}</p>
          <button
            type="button"
            onClick={handleLogout}
            className="mt-4 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 hover:text-red-700 hover:border-red-300 transition-colors"
          >
            Sign out
          </button>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
