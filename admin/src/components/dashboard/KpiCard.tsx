type KpiCardProps = {
  label: string;
  value: number;
  helperText: string;
  tone?: "danger" | "warning" | "success" | "neutral";
};

const toneClasses: Record<NonNullable<KpiCardProps["tone"]>, string> = {
  danger: "border-red-200 bg-red-50 text-red-800",
  warning: "border-amber-200 bg-amber-50 text-amber-800",
  success: "border-emerald-200 bg-emerald-50 text-emerald-800",
  neutral: "border-slate-200 bg-white text-slate-950",
};

function KpiCard({ label, value, helperText, tone = "neutral" }: KpiCardProps) {
  return (
    <article className={`rounded-lg border p-5 shadow-sm ${toneClasses[tone]}`}>
      <p className="text-sm font-medium opacity-80">{label}</p>
      <p className="mt-3 text-3xl font-bold">{value}</p>
      <p className="mt-2 text-sm opacity-80">{helperText}</p>
    </article>
  );
}

export default KpiCard;
