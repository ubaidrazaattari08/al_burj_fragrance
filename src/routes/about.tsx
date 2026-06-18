import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/site/PageHero";
import notesImg from "@/assets/notes.jpg";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Alburj Fragrance" },
      { name: "description", content: "Composed in Lahore. The story behind Alburj Fragrance, our master perfumer, and our obsession with rare materials." },
      { property: "og:url", content: "/about" },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
  component: () => (
    <>
      <PageHero eyebrow="The House" title="About Alburj" subtitle="A contemporary Eastern perfumery house, founded on the principle that fragrance is a form of adornment." />
      <section className="container-luxe py-20 grid md:grid-cols-2 gap-16 items-center">
        <img src={notesImg} alt="Fragrance ingredients" loading="lazy" className="aspect-[4/5] object-cover w-full" />
        <div>
          <div className="text-eyebrow mb-4">Our Story</div>
          <h2 className="heading-display text-4xl">Patience, rarity, restraint.</h2>
          <p className="mt-6 text-muted-foreground leading-relaxed">
            Alburj was founded in 2021 in Lahore by a third-generation perfumer with a singular goal: to compose fragrances that hold their own against the great houses of Paris and Grasse — while remaining unmistakably rooted in Eastern olfactive tradition.
          </p>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            We source Cambodian agarwood, Bulgarian rose absolute, Madagascan vanilla bourbon and Mediterranean citrus. Every fragrance is macerated for a minimum of eight weeks before bottling.
          </p>
        </div>
      </section>
      <section className="container-luxe py-20 grid md:grid-cols-3 gap-6">
        {[
          { title: "20+ Compositions", text: "An ever-growing library spanning Oud, Citrus, Sweet and Signature scents." },
          { title: "8-Week Maceration", text: "Every batch rests for two months minimum before bottling." },
          { title: "Lifetime Authentication", text: "Every bottle is batch-coded and registered in our atelier ledger." },
        ].map((c) => (
          <div key={c.title} className="card-luxe p-8 text-center">
            <h3 className="font-display text-2xl gold-gradient-text">{c.title}</h3>
            <p className="mt-3 text-sm text-muted-foreground">{c.text}</p>
          </div>
        ))}
      </section>
    </>
  ),
});
