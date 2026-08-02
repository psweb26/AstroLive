import { AppLayout } from "@/components/layout/app-layout";
import { PageContainer } from "@/components/layout/page-container";

export default function SettingsPage() {
  return (
    <AppLayout>
      <PageContainer className="max-w-6xl px-0">
        <h1 className="text-2xl font-semibold">Settings</h1>
        <p className="mt-2 text-muted-foreground">Settings content will go here.</p>
      </PageContainer>
    </AppLayout>
  );
}
