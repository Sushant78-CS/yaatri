type EmptyStateProps = {
  title: string;
  description: string;
  badge?: string;
};

function EmptyState({ title, description, badge }: EmptyStateProps) {
  return (
    <section className="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center shadow-sm">
      {badge ? (
        <p className="mx-auto mb-4 inline-flex rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600">
          {badge}
        </p>
      ) : null}
      <h2 className="text-lg font-semibold text-slate-950">{title}</h2>
      <p className="mx-auto mt-2 max-w-2xl text-sm leading-6 text-slate-600">{description}</p>
    </section>
  );
}

export default EmptyState;
