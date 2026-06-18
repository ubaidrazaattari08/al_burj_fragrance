import { createFileRoute, Link } from "@tanstack/react-router";
import { CATEGORIES, byCategory } from "@/data/products";
import { PageHero } from "@/components/site/PageHero";

export const Route = createFileRoute("/collections")({
  head: () => ({
    meta: [
      { title: "Collections — Alburj Fragrance" },
      { name: "description", content: "Explore Alburj fragrances by olfactive family: Fresh, Woody, Citrus, Oud, Sweet, Summer, Winter, Office, Formal and Signature Scents." },
      { property: "og:url", content: "/collections" },
    ],
    links: [{ rel: "canonical", href: "/collections" }],
  }),
  component: Collections,
});

function Collections() {
  return (
    <>
      <PageHero eyebrow="Olfactive Families" title="Collections" subtitle="Ten houses of scent — each with its own architecture and character." />
      <section className="container-luxe py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {CATEGORIES.map((cat) => {
          const items = byCategory(cat).slice(0, 3);
          return (
            <Link key={cat} to="/shop" className="card-luxe p-6 group">
              <div className="grid grid-cols-3 gap-2 mb-5">
                {items.map((p) => (
                  <div key={p.id} className="aspect-square overflow-hidden bg-[color:var(--ink)]">
                    <img src={p.image} alt={p.name} loading="lazy" className="w-full h-full object-cover group-hover:scale-110 transition duration-700" />
                  </div>
                ))}
              </div>
              <div className="text-eyebrow text-[color:var(--gold-soft)]">{byCategory(cat).length} compositions</div>
              <h3 className="font-display text-2xl mt-2 group-hover:text-[color:var(--gold)] transition">{cat}</h3>
            </Link>
          );
        })}
      </section>
    </>
  );
}
