import { cn } from "@/lib/utils";

export function Divider({ className }: { className?: string }) {
  return <div aria-hidden="true" className={cn("editorial-rule", className)} />;
}
