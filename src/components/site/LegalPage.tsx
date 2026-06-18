import type { ReactNode } from "react";
import { PageHero } from "./PageHero";

export function LegalPage({ eyebrow, title, sections }: {
  eyebrow: string;
  title: string;
  sections: Array<{ heading: string; body: ReactNode }>;
}) {
  return (
    <>
      <PageHero eyebrow={eyebrow} title={title} />
      <section className="container-luxe py-16 max-w-3xl mx-auto space-y-10 text-foreground/85 leading-relaxed">
        {sections.map((s) => (
          <div key={s.heading}>
            <h2 className="font-display text-2xl text-[color:var(--gold)] mb-3">{s.heading}</h2>
            <div className="space-y-3 text-sm">{s.body}</div>
          </div>
        ))}
        <p className="text-xs text-muted-foreground pt-8 border-t border-[color:var(--gold)]/10">Last updated: June 2026</p>
      </section>
    </>
  );
}
