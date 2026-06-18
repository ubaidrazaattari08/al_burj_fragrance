import type { ReactNode } from "react";

export function PageHero({ eyebrow, title, subtitle }: { eyebrow: string; title: ReactNode; subtitle?: string }) {
  return (
    <section className="border-b border-[color:var(--gold)]/15 bg-[color:var(--plum)]/30">
      <div className="container-luxe py-20 md:py-28 text-center">
        <div className="text-eyebrow mb-4">{eyebrow}</div>
        <h1 className="heading-display text-5xl md:text-7xl gold-gradient-text">{title}</h1>
        {subtitle && <p className="mt-6 max-w-2xl mx-auto text-muted-foreground leading-relaxed">{subtitle}</p>}
      </div>
    </section>
  );
}
