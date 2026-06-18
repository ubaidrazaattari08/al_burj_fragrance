import { Link } from "@tanstack/react-router";
import type { Product } from "@/data/products";
import { formatPKR } from "@/lib/site";

export function ProductCard({ product }: { product: Product }) {
  const startPrice = Math.min(...product.sizes.map((s) => s.price));
  return (
    <Link
      to="/product/$slug"
      params={{ slug: product.slug }}
      className="group block card-luxe overflow-hidden"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-[color:var(--ink)]">
        <img
          src={product.image}
          alt={product.name}
          width={896}
          height={1152}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.bestSeller && (
            <span className="text-[0.6rem] tracking-[0.22em] uppercase px-2 py-1 bg-[color:var(--gold)] text-[color:var(--ink)]">Best Seller</span>
          )}
          {product.newArrival && (
            <span className="text-[0.6rem] tracking-[0.22em] uppercase px-2 py-1 bg-[color:var(--ink)] text-[color:var(--gold)] border border-[color:var(--gold)]/50">New</span>
          )}
        </div>
      </div>
      <div className="p-5 text-center">
        <div className="text-[0.65rem] uppercase tracking-[0.28em] text-muted-foreground">{product.subtitle}</div>
        <h3 className="font-display text-xl mt-1.5 group-hover:text-[color:var(--gold)] transition-colors">{product.name}</h3>
        <div className="mt-3 text-sm text-[color:var(--gold)]">From {formatPKR(startPrice)}</div>
      </div>
    </Link>
  );
}
