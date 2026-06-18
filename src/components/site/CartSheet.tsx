import { Link } from "@tanstack/react-router";
import { Minus, Plus, Trash2, X } from "lucide-react";
import { useCart } from "@/lib/cart";
import { formatPKR, whatsappLink } from "@/lib/site";

export function CartSheet({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const { detailed, subtotal, setQty, remove, clear } = useCart();

  if (!open) return null;

  const waMessage = `Hello Alburj, I'd like to order:\n${detailed
    .map((d) => `• ${d.product.name} ${d.item.ml}ml × ${d.item.qty} — ${formatPKR(d.size.price * d.item.qty)}`)
    .join("\n")}\n\nSubtotal: ${formatPKR(subtotal)}`;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/70" onClick={() => onOpenChange(false)} />
      <aside className="absolute right-0 top-0 h-full w-full max-w-md bg-[color:var(--ink)] border-l border-[color:var(--gold)]/20 flex flex-col animate-float-up">
        <div className="flex items-center justify-between p-6 border-b border-[color:var(--gold)]/15">
          <div>
            <div className="text-eyebrow">Your Selection</div>
            <h3 className="font-display text-2xl">Cart</h3>
          </div>
          <button onClick={() => onOpenChange(false)} aria-label="Close cart" className="hover:text-[color:var(--gold)]">
            <X className="size-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {detailed.length === 0 && (
            <div className="text-center py-20">
              <p className="font-display text-2xl mb-2">Your cart awaits</p>
              <p className="text-sm text-muted-foreground mb-6">Discover our curated fragrances.</p>
              <Link to="/shop" onClick={() => onOpenChange(false)} className="btn-luxe btn-luxe-hover">
                Browse Shop
              </Link>
            </div>
          )}

          {detailed.map(({ item, product, size }) => (
            <div key={`${item.productId}-${item.ml}`} className="flex gap-4 pb-5 border-b border-[color:var(--gold)]/10 last:border-0">
              <img src={product.image} alt={product.name} className="w-20 h-24 object-cover bg-[color:var(--plum)]" loading="lazy" />
              <div className="flex-1 min-w-0">
                <div className="font-display text-lg leading-tight">{product.name}</div>
                <div className="text-xs text-muted-foreground uppercase tracking-widest mt-1">{item.ml}ml · {product.subtitle}</div>
                <div className="mt-2 text-sm text-[color:var(--gold)]">{formatPKR(size.price * item.qty)}</div>
                <div className="flex items-center justify-between mt-3">
                  <div className="inline-flex items-center border border-[color:var(--gold)]/30">
                    <button onClick={() => setQty(item.productId, item.ml, item.qty - 1)} className="px-2 py-1 hover:text-[color:var(--gold)]" aria-label="Decrease"><Minus className="size-3" /></button>
                    <span className="px-3 text-sm">{item.qty}</span>
                    <button onClick={() => setQty(item.productId, item.ml, item.qty + 1)} className="px-2 py-1 hover:text-[color:var(--gold)]" aria-label="Increase"><Plus className="size-3" /></button>
                  </div>
                  <button onClick={() => remove(item.productId, item.ml)} aria-label="Remove" className="text-muted-foreground hover:text-destructive">
                    <Trash2 className="size-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {detailed.length > 0 && (
          <div className="p-6 border-t border-[color:var(--gold)]/15 space-y-4">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground uppercase tracking-widest">Subtotal</span>
              <span className="font-display text-xl text-[color:var(--gold)]">{formatPKR(subtotal)}</span>
            </div>
            <p className="text-xs text-muted-foreground">Shipping & taxes calculated at checkout.</p>
            <a href={whatsappLink(waMessage)} target="_blank" rel="noreferrer" className="btn-luxe btn-luxe-hover w-full">
              Order via WhatsApp
            </a>
            <button onClick={clear} className="w-full text-xs uppercase tracking-[0.22em] text-muted-foreground hover:text-[color:var(--gold)]">
              Clear cart
            </button>
          </div>
        )}
      </aside>
    </div>
  );
}
