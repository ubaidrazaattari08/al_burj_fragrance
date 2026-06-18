import { createFileRoute } from "@tanstack/react-router";
import { PRODUCTS } from "@/data/products";
import { ProductCard } from "@/components/site/ProductCard";
import { PageHero } from "@/components/site/PageHero";

export const Route = createFileRoute("/best-sellers")({
  head: () => ({
    meta: [
      { title: "Best Sellers — Alburj Fragrance" },
      { name: "description", content: "The most-loved Alburj fragrances. Worn by thousands across Pakistan and the Gulf." },
      { property: "og:url", content: "/best-sellers" },
    ],
    links: [{ rel: "canonical", href: "/best-sellers" }],
  }),
  component: () => {
    const items = PRODUCTS.filter((p) => p.bestSeller);
    return (
      <>
        <PageHero eyebrow="The Most Adored" title="Best Sellers" subtitle="The compositions our patrons return to, again and again." />
        <section className="container-luxe py-16 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {items.map((p) => <ProductCard key={p.id} product={p} />)}
        </section>
      </>
    );
  },
});
