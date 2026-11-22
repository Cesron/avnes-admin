export function RecordText({
  label,
  value,
}: {
  label: string;
  value: string | null;
}) {
  if (!value) return null;

  return (
    <details className="rounded-md border px-3 text-sm">
      <summary className="min-h-11 cursor-pointer content-center rounded-sm font-medium focus-visible:outline-2 focus-visible:outline-ring">
        {label}
      </summary>
      <p className="pb-3 whitespace-pre-wrap wrap-anywhere">{value}</p>
    </details>
  );
}
