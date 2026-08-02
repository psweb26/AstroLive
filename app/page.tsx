import Link from "next/link";

import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { PageContainer } from "@/components/layout/page-container";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex flex-1 items-center py-16 md:py-24">
        <PageContainer className="max-w-3xl text-center">
          <p className="mb-4 text-sm font-medium text-muted-foreground">Next.js starter</p>
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">Build your next idea.</h1>
          <p className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground">A clean foundation for your hackathon prototype.</p>
          <div className="mt-8 flex justify-center gap-3">
            <Button asChild><Link href="/signup">Get started</Link></Button>
            <Button asChild variant="outline"><Link href="/dashboard">View dashboard</Link></Button>
          </div>
        </PageContainer>
      </main>
      <Footer />
    </div>
  );
}
