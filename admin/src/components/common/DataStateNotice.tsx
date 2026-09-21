import type { AdminDataStatus } from "../../context/AdminDataContext";

type DataStateNoticeProps = {
  status: AdminDataStatus;
  message: string;
};

const titleByStatus: Record<AdminDataStatus, string> = {
  loading: "Loading Firebase data",
  ready: "Data loaded",
  empty: "No records available",
  restricted: "Admin authorization required",
  unauthorized: "Firebase sign-in required",
  "config-missing": "Firebase configuration missing",
  error: "Firebase data unavailable",
};

function DataStateNotice({ status, message }: DataStateNoticeProps) {
  return (
    <section className="rounded-lg border border-amber-200 bg-amber-50 p-5 text-amber-950 shadow-sm">
      <p className="text-sm font-semibold">{titleByStatus[status]}</p>
      <p className="mt-2 text-sm leading-6">{message}</p>
    </section>
  );
}

export default DataStateNotice;
