import { cn } from "@/lib/utils";

export function ProgressIndicator({ value, label, className }: { value: number; label: string; className?: string }) {
  const safeValue = Math.max(0, Math.min(100, Math.round(value)));
  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-baseline justify-between gap-4"><span className="text-sm font-semibold text-ink">{label}</span><span className="text-sm tabular-nums text-ink-secondary">{safeValue}%</span></div>
      <div className="h-1.5 overflow-hidden rounded-full bg-surface-muted" role="progressbar" aria-label={label} aria-valuemin={0} aria-valuemax={100} aria-valuenow={safeValue}>
        <div className="h-full rounded-full bg-signal-secondary transition-[width] duration-300 motion-reduce:transition-none" style={{ width: `${safeValue}%` }} />
      </div>
    </div>
  );
}
