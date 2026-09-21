import { useMemo, useState } from "react";
import EmptyState from "../components/common/EmptyState";
import StatusBadge from "../components/common/StatusBadge";
import { useAdminData } from "../context/AdminDataContext";
import { filterUserSummaries } from "../utils/users";

const displayOptional = (value: string | number | null) => (value === null || value === "" ? "Unavailable" : String(value));

function UsersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [incidentFilter, setIncidentFilter] = useState<"all" | "active-only">("all");
  const { users } = useAdminData();

  const filteredUsers = useMemo(
    () => filterUserSummaries(users, searchTerm, incidentFilter),
    [incidentFilter, searchTerm, users],
  );

  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-xl font-semibold text-slate-950">Users</h1>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
              Read-only operational view of tourist profiles when admin user access is safely authorized.
            </p>
          </div>
          <StatusBadge tone="success">{`${filteredUsers.length} users shown`}</StatusBadge>
        </div>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm" aria-label="User filters">
        <div className="grid gap-4 lg:grid-cols-[1fr_220px]">
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Search users</span>
            <input
              className="mt-2 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-950 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100"
              type="search"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search by name, user ID, profile status"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-slate-700">Incident filter</span>
            <select
              className="mt-2 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-950 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100"
              value={incidentFilter}
              onChange={(event) => setIncidentFilter(event.target.value as "all" | "active-only")}
            >
              <option value="all">All users</option>
              <option value="active-only">With active SOS</option>
            </select>
          </label>
        </div>
      </section>

      {filteredUsers.length === 0 ? (
        <EmptyState
          badge="No matching users"
          title="No user records are available"
          description="Users are not displayed until a safe admin authorization model allows reading the users collection."
        />
      ) : (
        <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
              <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-600">
                <tr>
                  <th scope="col" className="px-4 py-3">
                    User
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Age
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Profile
                  </th>
                  <th scope="col" className="px-4 py-3">
                    SOS incidents
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Latest incident
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredUsers.map((user) => (
                  <tr key={user.userId}>
                    <td className="px-4 py-4">
                      <p className="font-medium text-slate-950">{user.name}</p>
                      <p className="mt-1 text-xs text-slate-500">{user.userId}</p>
                    </td>
                    <td className="px-4 py-4 text-slate-700">{displayOptional(user.age)}</td>
                    <td className="px-4 py-4">
                      <StatusBadge tone={user.profileStatus === "COMPLETE" ? "success" : "warning"}>
                        {user.profileStatus === "COMPLETE" ? "Complete" : "Incomplete"}
                      </StatusBadge>
                    </td>
                    <td className="px-4 py-4 text-slate-700">
                      <span className="font-medium text-slate-950">{user.incidentCount}</span>
                      <span className="ml-2 text-xs text-slate-500">{user.activeIncidentCount} active</span>
                    </td>
                    <td className="px-4 py-4 text-slate-700">{user.latestIncidentTime}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default UsersPage;
