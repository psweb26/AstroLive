import { cn } from "@/lib/utils";

export function LoadingState({ label = "Preparing your experience", className }: { label?: string; className?: string }) {
  return (
    <div role="status" className={cn("flex items-center gap-3 py-4 text-sm text-ink-secondary", className)}>
      <span aria-hidden="true" className="h-4 w-4 animate-spin rounded-full border-2 border-line border-t-signal-secondary motion-reduce:animate-none" />
      <span>{label}</span>
    </div>
  );
}
