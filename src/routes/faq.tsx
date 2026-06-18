import { createFileRoute } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";

const FAQS = [
  { q: "Are Alburj fragrances authentic?", a: "Yes. Every bottle is batch-coded and registered in our atelier ledger. We offer lifetime authentication." },
  { q: "How long do your fragrances last on skin?", a: "Extrait de Parfum: 8–12 hours. Eau de Parfum: 6–8 hours. Eau de Toilette: 4–6 hours. Results vary by skin chemistry." },
  { q: "Do you ship outside Pakistan?", a: "Yes — international shipping is available on request via WhatsApp." },
  { q: "How long does delivery take?", a: "Lahore: same day. Major cities in Pakistan: 1–3 business days. Smaller cities: 3–5 business days." },
  { q: "Can I return a fragrance?", a: "Sealed bottles can be returned within 7 days of delivery. Opened or used bottles cannot be returned for hygiene reasons." },
  { q: "Do you offer samples?", a: "Yes — 2ml decants of any fragrance can be ordered through WhatsApp." },
  { q: "What payment methods are accepted?", a: "Cash on Delivery, JazzCash, EasyPaisa and bank transfer. Card payments are coming soon." },
  { q: "How do I become a reseller?", a: "Apply through our Reseller Program page. Approvals typically take 2–3 business days." },
];

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "FAQ — Alburj Fragrance" },
      { name: "description", content: "Frequently asked questions about Alburj fragrances, shipping, returns, authenticity and the reseller program." },
      { property: "og:url", content: "/faq" },
    ],
    links: [{ rel: "canonical", href: "/faq" }],
    scripts: [{
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: FAQS.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      }),
    }],
  }),
  component: () => (
    <>
      <PageHero eyebrow="Considered Answers" title="Frequently Asked" />
      <section className="container-luxe py-16 max-w-3xl mx-auto space-y-3">
        {FAQS.map((f) => (
          <details key={f.q} className="card-luxe p-6 group">
            <summary className="flex items-center justify-between cursor-pointer list-none">
              <span className="font-display text-lg pr-4">{f.q}</span>
              <Plus className="size-4 text-[color:var(--gold)] group-open:rotate-45 transition shrink-0" />
            </summary>
            <p className="mt-4 text-sm text-muted-foreground leading-relaxed">{f.a}</p>
          </details>
        ))}
      </section>
    </>
  ),
});
