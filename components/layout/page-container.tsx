import { cn } from "@/lib/utils";

export function PageContainer({ children, className }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("container mx-auto w-full", className)}>{children}</div>;
}
