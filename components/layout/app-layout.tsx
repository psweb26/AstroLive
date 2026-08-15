import { Sidebar } from "@/components/layout/sidebar";
import { ThemeToggle } from "@/components/theme-toggle";

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-canvas md:flex">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-[4.25rem] items-center justify-between border-b border-line px-4 md:justify-end md:px-8">
          <span className="font-display text-xl font-semibold md:hidden">AstroLive</span>
          <ThemeToggle />
        </header>
        <main className="flex-1 p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}
