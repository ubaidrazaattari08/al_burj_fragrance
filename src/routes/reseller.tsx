import { createFileRoute } from "@tanstack/react-router";
import { Award, Percent, Truck, Users } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";

export const Route = createFileRoute("/reseller")({
  head: () => ({
    meta: [
      { title: "Reseller Program — Alburj Fragrance" },
      { name: "description", content: "Join the Alburj Reseller Program: wholesale pricing, marketing assets, dropshipping support and tiered commissions." },
      { property: "og:url", content: "/reseller" },
    ],
    links: [{ rel: "canonical", href: "/reseller" }],
  }),
  component: Reseller,
});

function Reseller() {
  return (
    <>
      <PageHero eyebrow="Partner With Us" title="Reseller Program" subtitle="Wholesale pricing, ready-made marketing assets and end-to-end dropshipping support." />

      <section className="container-luxe py-16 grid md:grid-cols-4 gap-6">
        {[
          { icon: Percent, title: "Up to 40% Margin", text: "Tiered wholesale pricing scales with monthly volume." },
          { icon: Truck, title: "We Ship For You", text: "Optional dropshipping — we pack and dispatch under your brand." },
          { icon: Award, title: "Marketing Assets", text: "Studio photography, videos and copy ready to publish." },
          { icon: Users, title: "Dedicated Manager", text: "A direct WhatsApp line to our reseller team." },
        ].map((c) => (
          <div key={c.title} className="card-luxe p-7">
            <c.icon className="size-7 text-[color:var(--gold)]" strokeWidth={1.3} />
            <h3 className="font-display text-xl mt-4">{c.title}</h3>
            <p className="text-sm text-muted-foreground mt-2">{c.text}</p>
          </div>
        ))}
      </section>

      <section className="container-luxe py-16">
        <div className="card-luxe p-8 md:p-12 max-w-3xl mx-auto">
          <div className="text-eyebrow mb-3">Apply Now</div>
          <h2 className="heading-display text-3xl mb-2">Reseller Application</h2>
          <p className="text-sm text-muted-foreground mb-8">Approval typically takes 2–3 business days.</p>
          <form onSubmit={(e) => e.preventDefault()} className="grid md:grid-cols-2 gap-5">
            {[
              ["Full Name", "text", true],
              ["Business Name (Optional)", "text", false],
              ["Email Address", "email", true],
              ["Mobile Number", "tel", true],
              ["WhatsApp Number", "tel", true],
              ["Country", "text", true],
              ["City", "text", true],
              ["Social Media Profile", "url", false],
              ["Website (Optional)", "url", false],
              ["Expected Monthly Sales (PKR)", "number", true],
            ].map(([label, type, req]) => (
              <div key={label as string}>
                <label className="text-eyebrow block mb-2">{label}{(req as boolean) && <span className="text-[color:var(--gold)]"> *</span>}</label>
                <input type={type as string} required={req as boolean} className="w-full bg-transparent border border-[color:var(--gold)]/30 px-4 py-3 focus:outline-none focus:border-[color:var(--gold)]" />
              </div>
            ))}
            <label className="md:col-span-2 flex gap-3 items-start text-sm text-muted-foreground">
              <input type="checkbox" required className="mt-1 accent-[color:var(--gold)]" />
              <span>I agree to the Alburj Reseller Terms and confirm all information provided is accurate.</span>
            </label>
            <div className="md:col-span-2">
              <button className="btn-luxe btn-luxe-hover w-full">Submit Application</button>
            </div>
          </form>
        </div>
      </section>
    </>
  );
}
