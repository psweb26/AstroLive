import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";

export default function SignupPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex flex-1 items-center justify-center p-6">
        <section className="w-full max-w-sm rounded-lg border bg-card p-6 shadow-sm">
          <h1 className="text-2xl font-semibold">Create an account</h1>
          <p className="mt-2 text-sm text-muted-foreground">Sign-up UI will go here.</p>
        </section>
      </main>
      <Footer />
    </div>
  );
}
