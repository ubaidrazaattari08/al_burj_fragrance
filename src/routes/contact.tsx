import { createFileRoute } from "@tanstack/react-router";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { SITE, whatsappLink } from "@/lib/site";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Alburj Fragrance" },
      { name: "description", content: "Get in touch with the Alburj concierge. WhatsApp, phone, email and our Lahore atelier." },
      { property: "og:url", content: "/contact" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: () => (
    <>
      <PageHero eyebrow="Concierge" title="Contact" subtitle="Our team responds within a few hours, every day." />
      <section className="container-luxe py-20 grid lg:grid-cols-2 gap-12">
        <div className="space-y-5">
          {[
            { icon: MessageCircle, label: "WhatsApp", value: SITE.phone, href: whatsappLink("Hello Alburj") },
            { icon: Phone, label: "Phone", value: SITE.phone, href: `tel:${SITE.phone.replace(/\s/g, "")}` },
            { icon: Mail, label: "Email", value: SITE.email, href: `mailto:${SITE.email}` },
            { icon: MapPin, label: "Atelier", value: SITE.address },
          ].map((c) => (
            <a key={c.label} href={c.href ?? "#"} className="card-luxe p-6 flex items-start gap-4">
              <c.icon className="size-5 text-[color:var(--gold)] mt-1" />
              <div>
                <div className="text-eyebrow text-[color:var(--gold-soft)]">{c.label}</div>
                <div className="font-display text-xl mt-1">{c.value}</div>
              </div>
            </a>
          ))}
        </div>
        <form onSubmit={(e) => e.preventDefault()} className="card-luxe p-8 space-y-5">
          <div>
            <label className="text-eyebrow block mb-2">Name</label>
            <input required className="w-full bg-transparent border border-[color:var(--gold)]/30 px-4 py-3 focus:outline-none focus:border-[color:var(--gold)]" />
          </div>
          <div>
            <label className="text-eyebrow block mb-2">Email</label>
            <input type="email" required className="w-full bg-transparent border border-[color:var(--gold)]/30 px-4 py-3 focus:outline-none focus:border-[color:var(--gold)]" />
          </div>
          <div>
            <label className="text-eyebrow block mb-2">Message</label>
            <textarea required rows={5} className="w-full bg-transparent border border-[color:var(--gold)]/30 px-4 py-3 focus:outline-none focus:border-[color:var(--gold)]" />
          </div>
          <button className="btn-luxe btn-luxe-hover w-full">Send Message</button>
        </form>
      </section>
    </>
  ),
});
