import Link from "next/link";

import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { PageContainer } from "@/components/layout/page-container";

export function Navbar() {
  return (
    <header className="border-b bg-background/95 backdrop-blur">
      <PageContainer className="flex h-16 items-center justify-between">
        <Link className="text-lg font-semibold" href="/">AstroLive</Link>
        <nav className="flex items-center gap-1" aria-label="Main navigation">
          <Button asChild variant="ghost" size="sm"><Link href="/login">Log in</Link></Button>
          <Button asChild size="sm"><Link href="/signup">Get started</Link></Button>
          <ThemeToggle />
        </nav>
      </PageContainer>
    </header>
  );
}
