import { useState } from "react";
import type { AdminSection } from "../../types/navigation";
import { useFirebaseAuth } from "../../hooks/useFirebaseAuth";
import { signOutAdminUser } from "../../services/authService";

type TopbarProps = {
  section: AdminSection;
};

function Topbar({ section }: TopbarProps) {
  const { user, role } = useFirebaseAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await signOutAdminUser();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const displayRole = role === "superadmin" ? "Superadmin" : "Administrator";
  const userInitials = user?.email ? user.email.substring(0, 2).toUpperCase() : "YA";

  return (
    <header className="border-b border-slate-200 bg-white px-4 py-4 sm:px-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">Admin Dashboard</p>
          <h2 className="text-2xl font-bold text-slate-950">{section.label}</h2>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => alert("Notifications feature will be implemented in a future update.")}
            className="rounded-md border border-slate-300 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-400 cursor-not-allowed"
            title="Notifications coming soon"
          >
            Notifications
          </button>

          <div className="relative">
            <button 
              type="button"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-3 rounded-md border border-slate-200 bg-slate-50 px-3 py-2 hover:bg-slate-100 transition-colors w-full sm:w-auto"
            >
              <div className="grid h-9 w-9 place-items-center rounded-full bg-slate-900 text-sm font-semibold text-white shrink-0">
                {userInitials}
              </div>
              <div className="hidden text-left sm:block">
                <p className="text-sm font-semibold text-slate-950 max-w-[150px] truncate">{user?.email || "Admin User"}</p>
                <p className="text-xs text-slate-500">{displayRole}</p>
              </div>
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5 z-50">
                <div className="p-3 border-b border-slate-100 sm:hidden">
                  <p className="text-sm font-medium text-slate-900 truncate">{user?.email || "Admin User"}</p>
                  <p className="text-xs text-slate-500">{displayRole}</p>
                </div>
                <div className="p-1">
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="block w-full text-left rounded-md px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 font-medium"
                  >
                    Sign out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Topbar;
