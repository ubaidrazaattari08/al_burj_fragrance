import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { PRODUCTS, CATEGORIES, type Category } from "@/data/products";
import { ProductCard } from "@/components/site/ProductCard";
import { PageHero } from "@/components/site/PageHero";

export const Route = createFileRoute("/shop")({
  head: () => ({
    meta: [
      { title: "Shop All Fragrances — Alburj Fragrance" },
      { name: "description", content: "Browse all 20 hand-composed Alburj fragrances. Filter by olfactive family, longevity and projection." },
      { property: "og:title", content: "Shop All Fragrances — Alburj" },
      { property: "og:url", content: "/shop" },
    ],
    links: [{ rel: "canonical", href: "/shop" }],
  }),
  component: Shop,
});

function Shop() {
  const [active, setActive] = useState<Category | "All">("All");
  const [sort, setSort] = useState<"featured" | "price-asc" | "price-desc" | "rating">("featured");

  const filtered = useMemo(() => {
    let list = active === "All" ? PRODUCTS : PRODUCTS.filter((p) => p.categories.includes(active));
    const price = (p: typeof PRODUCTS[number]) => Math.min(...p.sizes.map((s) => s.price));
    if (sort === "price-asc") list = [...list].sort((a, b) => price(a) - price(b));
    if (sort === "price-desc") list = [...list].sort((a, b) => price(b) - price(a));
    if (sort === "rating") list = [...list].sort((a, b) => b.rating - a.rating);
    return list;
  }, [active, sort]);

  return (
    <>
      <PageHero
        eyebrow="The Collection"
        title="Shop"
        subtitle="Twenty compositions, four olfactive movements, one obsession with craft."
      />
      <section className="container-luxe py-16">
        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="lg:w-60 shrink-0">
            <div className="text-eyebrow mb-4">Olfactive Family</div>
            <div className="flex flex-wrap lg:flex-col gap-2">
              <button onClick={() => setActive("All")} className={`text-left px-3 py-2 text-xs uppercase tracking-[0.2em] border transition ${active === "All" ? "bg-[color:var(--gold)] text-[color:var(--ink)] border-[color:var(--gold)]" : "border-[color:var(--gold)]/20 hover:border-[color:var(--gold)]"}`}>All</button>
              {CATEGORIES.map((c) => (
                <button key={c} onClick={() => setActive(c)} className={`text-left px-3 py-2 text-xs uppercase tracking-[0.2em] border transition ${active === c ? "bg-[color:var(--gold)] text-[color:var(--ink)] border-[color:var(--gold)]" : "border-[color:var(--gold)]/20 hover:border-[color:var(--gold)]"}`}>{c}</button>
              ))}
            </div>
          </aside>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-8">
              <div className="text-xs uppercase tracking-widest text-muted-foreground">{filtered.length} fragrances</div>
              <select value={sort} onChange={(e) => setSort(e.target.value as any)} className="bg-transparent border border-[color:var(--gold)]/30 px-3 py-2 text-xs uppercase tracking-widest focus:outline-none">
                <option value="featured">Featured</option>
                <option value="price-asc">Price · Low to High</option>
                <option value="price-desc">Price · High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>
            {filtered.length === 0 ? (
              <div className="text-center py-20 text-muted-foreground">No fragrances in this family yet.</div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {filtered.map((p) => <ProductCard key={p.id} product={p} />)}
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
