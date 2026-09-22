import { useState } from "react";
import EmptyState from "../components/common/EmptyState";
import StatusBadge from "../components/common/StatusBadge";
import { useAdminData } from "../context/AdminDataContext";
import { useFirebaseAuth } from "../hooks/useFirebaseAuth";
import type { SystemAdministrator } from "../types/adminManagement";

function AdminManagementPage() {
  const { administrators } = useAdminData();
  const { user } = useFirebaseAuth();
  const [modalType, setModalType] = useState<"add" | "remove" | null>(null);
  const [selectedAdmin, setSelectedAdmin] = useState<SystemAdministrator | null>(null);

  const handleOpenAdd = () => {
    setModalType("add");
  };

  const handleOpenRemove = (admin: SystemAdministrator) => {
    setSelectedAdmin(admin);
    setModalType("remove");
  };

  const handleCloseModal = () => {
    setModalType(null);
    setSelectedAdmin(null);
  };

  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-xl font-semibold text-slate-950">Admin Management</h1>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
              Manage system administrators and assign access roles. Restricted to superadmin accounts.
            </p>
          </div>
          <StatusBadge tone="success">Superadmin access</StatusBadge>
        </div>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <h2 className="text-lg font-semibold text-slate-950">System Administrators</h2>
          <button
            type="button"
            onClick={handleOpenAdd}
            className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
          >
            Add Administrator
          </button>
        </div>
        
        <div className="mt-6">
          {administrators.length === 0 ? (
            <EmptyState
              badge="No records"
              title="No administrators found"
              description="Use the secure local console to provision administrators."
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="border-b border-slate-200 bg-slate-50 text-slate-700">
                  <tr>
                    <th className="px-4 py-3 font-medium">Email</th>
                    <th className="px-4 py-3 font-medium">Role</th>
                    <th className="px-4 py-3 font-medium">Joined</th>
                    <th className="px-4 py-3 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  {administrators.map((admin) => (
                    <tr key={admin.uid} className="hover:bg-slate-50">
                      <td className="px-4 py-3 font-medium text-slate-950">
                        {admin.email}
                        {user?.uid === admin.uid && (
                          <span className="ml-2 inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700">
                            You
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge tone={admin.role === "superadmin" ? "success" : "neutral"}>
                          {admin.role}
                        </StatusBadge>
                      </td>
                      <td className="px-4 py-3">
                        {admin.createdAt instanceof Date ? admin.createdAt.toLocaleDateString() : "Unknown"}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          type="button"
                          onClick={() => handleOpenRemove(admin)}
                          disabled={admin.role === "superadmin"}
                          className="text-sm font-medium text-red-600 hover:text-red-700 disabled:opacity-30"
                        >
                          Revoke
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>

      {modalType === "add" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <div className="w-full max-w-lg rounded-lg border border-slate-200 bg-white p-6 shadow-lg">
            <h3 className="text-lg font-semibold text-slate-950">Add Administrator</h3>
            <p className="mt-2 text-sm text-slate-600">
              Because assigning administrator roles requires secure backend permissions, the dashboard does not store passwords or manage user creation directly.
            </p>
            <p className="mt-2 text-sm font-medium text-slate-950">
              Run this command in the secure local terminal:
            </p>
            <div className="mt-3 rounded-md bg-slate-950 p-4 text-xs font-mono text-slate-300 overflow-x-auto">
              bun run scripts/manage-admins.ts add {"<email>"} {"<password>"} admin
            </div>
            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={handleCloseModal}
                className="rounded-md bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {modalType === "remove" && selectedAdmin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <div className="w-full max-w-lg rounded-lg border border-slate-200 bg-white p-6 shadow-lg">
            <h3 className="text-lg font-semibold text-slate-950">Revoke Administrator</h3>
            <p className="mt-2 text-sm text-slate-600">
              You are about to revoke access for <strong className="text-slate-900">{selectedAdmin.email}</strong>.
            </p>
            <p className="mt-2 text-sm text-slate-600">
              Because revoking access modifies secure backend claims, you must run this via the secure local terminal. This will revoke admin privileges but preserve their Firebase account:
            </p>
            <div className="mt-3 rounded-md bg-slate-950 p-4 text-xs font-mono text-slate-300 overflow-x-auto">
              bun run scripts/manage-admins.ts remove {selectedAdmin.email}
            </div>
            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={handleCloseModal}
                className="rounded-md bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminManagementPage;
