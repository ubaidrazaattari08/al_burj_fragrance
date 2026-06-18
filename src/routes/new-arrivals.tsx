import { createFileRoute } from "@tanstack/react-router";
import { PRODUCTS } from "@/data/products";
import { ProductCard } from "@/components/site/ProductCard";
import { PageHero } from "@/components/site/PageHero";

export const Route = createFileRoute("/new-arrivals")({
  head: () => ({
    meta: [
      { title: "New Arrivals — Alburj Fragrance" },
      { name: "description", content: "The newest compositions from the Alburj atelier in Lahore." },
      { property: "og:url", content: "/new-arrivals" },
    ],
    links: [{ rel: "canonical", href: "/new-arrivals" }],
  }),
  component: () => {
    const items = PRODUCTS.filter((p) => p.newArrival);
    return (
      <>
        <PageHero eyebrow="Just Composed" title="New Arrivals" subtitle="Freshly bottled from the atelier — be among the first to discover." />
        <section className="container-luxe py-16 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {items.map((p) => <ProductCard key={p.id} product={p} />)}
        </section>
      </>
    );
  },
});
