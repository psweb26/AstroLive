import { ProgressIndicator } from "@/components/ui/progress-indicator";

export function TrustIndicator({ score, className }: { score: number; className?: string }) {
  return <ProgressIndicator value={score} label="Trust score" className={className} />;
}
