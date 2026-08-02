import { AppLayout } from "@/components/layout/app-layout";
import { PageContainer } from "@/components/layout/page-container";

export default function ProfilePage() {
  return (
    <AppLayout>
      <PageContainer className="max-w-6xl px-0">
        <h1 className="text-2xl font-semibold">Profile</h1>
        <p className="mt-2 text-muted-foreground">Profile content will go here.</p>
      </PageContainer>
    </AppLayout>
  );
}
