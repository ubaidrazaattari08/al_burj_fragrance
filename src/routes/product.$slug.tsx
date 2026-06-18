import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { Heart, Share2, ShieldCheck, Truck, Star, Plus } from "lucide-react";
import { getProduct, PRODUCTS, type Product } from "@/data/products";
import { ProductCard } from "@/components/site/ProductCard";
import { Meter } from "@/components/site/Meter";
import { useCart } from "@/lib/cart";
import { formatPKR, whatsappLink } from "@/lib/site";

export const Route = createFileRoute("/product/$slug")({
  loader: ({ params }) => {
    const product = getProduct(params.slug);
    if (!product) throw notFound();
    return { product };
  },
  head: ({ params, loaderData }) => {
    const p = loaderData?.product;
    if (!p) return { meta: [{ title: "Fragrance — Alburj" }] };
    return {
      meta: [
        { title: `${p.name} — ${p.subtitle} — Alburj Fragrance` },
        { name: "description", content: `${p.description} Notes: ${[...p.notes.top, ...p.notes.heart, ...p.notes.base].join(", ")}.` },
        { property: "og:title", content: `${p.name} — Alburj Fragrance` },
        { property: "og:description", content: p.description },
        { property: "og:type", content: "product" },
        { property: "og:url", content: `/product/${params.slug}` },
        { property: "og:image", content: p.image },
      ],
      links: [{ rel: "canonical", href: `/product/${params.slug}` }],
      scripts: [{
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Product",
          name: p.name,
          description: p.description,
          brand: { "@type": "Brand", name: "Alburj Fragrance" },
          aggregateRating: { "@type": "AggregateRating", ratingValue: p.rating.toFixed(1), reviewCount: p.reviews },
          offers: p.sizes.map((s) => ({
            "@type": "Offer",
            priceCurrency: "PKR",
            price: s.price,
            availability: "https://schema.org/InStock",
          })),
        }),
      }],
    };
  },
  errorComponent: () => (
    <div className="container-luxe py-32 text-center">
      <h1 className="font-display text-4xl">Fragrance unavailable</h1>
      <Link to="/shop" className="btn-luxe btn-luxe-hover mt-8 inline-flex">Back to Shop</Link>
    </div>
  ),
  notFoundComponent: () => (
    <div className="container-luxe py-32 text-center">
      <h1 className="font-display text-4xl">Fragrance not found</h1>
      <Link to="/shop" className="btn-luxe btn-luxe-hover mt-8 inline-flex">Browse Collection</Link>
    </div>
  ),
  component: ProductPage,
});

function ProductPage() {
  const { product } = Route.useLoaderData() as { product: Product };
  const [size, setSize] = useState(product.sizes[1]);
  const [qty, setQty] = useState(1);
  const { add } = useCart();
  const related = PRODUCTS.filter((p) => p.id !== product.id && p.categories.some((c) => product.categories.includes(c))).slice(0, 4);

  const waMsg = `Hello Alburj, I'd like to order ${product.name} ${size.ml}ml × ${qty} (${formatPKR(size.price * qty)}).`;

  return (
    <>
      <section className="container-luxe py-12 md:py-16">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
          <div>
            <div className="aspect-square bg-[color:var(--plum)]/40 overflow-hidden">
              <img src={product.image} alt={product.name} width={896} height={1152} className="w-full h-full object-cover" />
            </div>
            <div className="grid grid-cols-4 gap-3 mt-3">
              {[product.image, product.image, product.image, product.image].map((src, i) => (
                <div key={i} className="aspect-square bg-[color:var(--plum)]/40 overflow-hidden cursor-pointer border border-transparent hover:border-[color:var(--gold)] transition">
                  <img src={src} alt="" loading="lazy" className="w-full h-full object-cover opacity-80" />
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="text-eyebrow">{product.subtitle}</div>
            <h1 className="heading-display text-4xl md:text-5xl mt-3">{product.name}</h1>
            <div className="mt-3 flex items-center gap-3 text-sm">
              <span className="flex items-center gap-1 text-[color:var(--gold)]">
                {Array.from({ length: 5 }).map((_, i) => <Star key={i} className={`size-3.5 ${i < Math.round(product.rating) ? "fill-[color:var(--gold)]" : ""}`} />)}
              </span>
              <span className="text-muted-foreground">{product.rating.toFixed(1)} · {product.reviews} reviews</span>
            </div>

            <p className="mt-6 text-foreground/85 leading-relaxed">{product.description}</p>

            <div className="mt-8">
              <div className="text-eyebrow mb-3">Size</div>
              <div className="grid grid-cols-3 gap-2">
                {product.sizes.map((s) => (
                  <button key={s.ml} onClick={() => setSize(s)} className={`py-4 text-sm uppercase tracking-[0.2em] border transition ${size.ml === s.ml ? "bg-[color:var(--gold)] text-[color:var(--ink)] border-[color:var(--gold)]" : "border-[color:var(--gold)]/30 hover:border-[color:var(--gold)]"}`}>
                    <div className="font-display text-base normal-case tracking-normal">{s.ml}ml</div>
                    <div className="text-xs mt-1">{formatPKR(s.price)}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6 flex items-center gap-4">
              <div className="inline-flex items-center border border-[color:var(--gold)]/30">
                <button onClick={() => setQty(Math.max(1, qty - 1))} className="px-4 py-3">−</button>
                <span className="px-4 text-sm">{qty}</span>
                <button onClick={() => setQty(qty + 1)} className="px-4 py-3">+</button>
              </div>
              <div className="font-display text-3xl gold-gradient-text">{formatPKR(size.price * qty)}</div>
            </div>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button onClick={() => add({ productId: product.id, ml: size.ml, qty })} className="btn-luxe btn-luxe-hover">Add to Cart</button>
              <a href={whatsappLink(waMsg)} target="_blank" rel="noreferrer" className="btn-ghost-gold">Order via WhatsApp</a>
            </div>

            <div className="mt-8 grid gap-5">
              <Meter label="Longevity" value={product.longevity} />
              <Meter label="Projection" value={product.projection} />
            </div>

            <div className="mt-8 grid grid-cols-2 gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-2"><ShieldCheck className="size-4 text-[color:var(--gold)]" /> Authenticity Guaranteed</div>
              <div className="flex items-center gap-2"><Truck className="size-4 text-[color:var(--gold)]" /> Free over PKR 7,500</div>
            </div>
          </div>
        </div>
      </section>

      {/* NOTES PYRAMID */}
      <section className="container-luxe py-20 border-t border-[color:var(--gold)]/10">
        <div className="text-eyebrow text-center mb-3">The Composition</div>
        <h2 className="heading-display text-3xl md:text-4xl text-center">Olfactive Pyramid</h2>
        <div className="grid md:grid-cols-3 gap-5 mt-12">
          {([
            ["Top Notes", product.notes.top],
            ["Heart Notes", product.notes.heart],
            ["Base Notes", product.notes.base],
          ] as const).map(([label, list]) => (
            <div key={label} className="card-luxe p-7 text-center">
              <div className="text-eyebrow text-[color:var(--gold-soft)]">{label}</div>
              <div className="mt-4 space-y-1.5">
                {list.map((n) => <div key={n} className="font-display text-xl">{n}</div>)}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* REVIEWS */}
      <section className="container-luxe py-20 border-t border-[color:var(--gold)]/10">
        <div className="text-eyebrow text-center mb-3">Verified Wearers</div>
        <h2 className="heading-display text-3xl md:text-4xl text-center mb-12">Customer Reviews</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { name: "Ahmed S.", rating: 5, text: "Compliment magnet. Lasts all day, projects beautifully without being loud." },
            { name: "Sara K.", rating: 5, text: "Worth every rupee. The packaging alone feels like a luxury gift." },
            { name: "Bilal H.", rating: 4, text: "Beautiful scent, would have loved a 100ml size in stock more often." },
          ].map((r) => (
            <div key={r.name} className="card-luxe p-6">
              <div className="flex items-center gap-2 text-[color:var(--gold)]">
                {Array.from({ length: 5 }).map((_, i) => <Star key={i} className={`size-3.5 ${i < r.rating ? "fill-[color:var(--gold)]" : ""}`} />)}
              </div>
              <p className="mt-3 text-sm leading-relaxed">{r.text}</p>
              <div className="mt-4 text-xs uppercase tracking-[0.22em] text-muted-foreground">{r.name}</div>
            </div>
          ))}
        </div>
      </section>

      {/* RELATED */}
      {related.length > 0 && (
        <section className="container-luxe py-20 border-t border-[color:var(--gold)]/10">
          <div className="text-eyebrow text-center mb-3">You may also adore</div>
          <h2 className="heading-display text-3xl md:text-4xl text-center mb-12">Related Fragrances</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {related.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}
    </>
  );
}
