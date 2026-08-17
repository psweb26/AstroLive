import Link from "next/link";

import { ProductShell } from "@/components/layout/product-shell";
import { Button } from "@/components/ui/button";

type PrototypeScopePageProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export function PrototypeScopePage({ eyebrow, title, description }: PrototypeScopePageProps) {
  return (
    <ProductShell>
      <main className="product-page page-frame">
        <section className="mx-auto max-w-2xl py-12 sm:py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-signal-secondary">{eyebrow}</p>
          <h1 className="mt-5 text-5xl font-semibold leading-[0.94] tracking-[-0.04em] text-ink sm:text-6xl">{title}</h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-ink-secondary">{description}</p>
          <Button asChild variant="signal" className="mt-8">
            <Link href="/understanding-you">Start an insight</Link>
          </Button>
        </section>
      </main>
    </ProductShell>
  );
}
