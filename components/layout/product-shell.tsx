import { AstroLiveNav } from "@/components/layout/astro-live-nav";

export function ProductShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-canvas text-ink">
      <AstroLiveNav context="product" />
      {children}
    </div>
  );
}
