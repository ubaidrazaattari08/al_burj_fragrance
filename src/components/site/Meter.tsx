export function Meter({ label, value, max = 10 }: { label: string; value: number; max?: number }) {
  const pct = Math.min(100, (value / max) * 100);
  return (
    <div>
      <div className="flex items-baseline justify-between mb-2">
        <span className="text-[0.7rem] uppercase tracking-[0.28em] text-muted-foreground">{label}</span>
        <span className="text-xs text-[color:var(--gold)] font-medium">{value}/{max}</span>
      </div>
      <div className="h-[2px] bg-[color:var(--plum)] overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-[color:var(--gold-soft)] to-[color:var(--gold)]"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
