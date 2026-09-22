import StatusBadge from "../common/StatusBadge";
import type { SosStatus } from "../../types/sos";

type SosStatusBadgeProps = {
  status: SosStatus;
};

function SosStatusBadge({ status }: SosStatusBadgeProps) {
  return <StatusBadge tone={status === "ACTIVE" ? "danger" : "success"}>{status === "ACTIVE" ? "Active" : "Resolved"}</StatusBadge>;
}

export default SosStatusBadge;
