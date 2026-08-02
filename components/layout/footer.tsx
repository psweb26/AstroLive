import { PageContainer } from "@/components/layout/page-container";

export function Footer() {
  return (
    <footer className="border-t py-6 text-sm text-muted-foreground">
      <PageContainer>© {new Date().getFullYear()} AstroLive</PageContainer>
    </footer>
  );
}
