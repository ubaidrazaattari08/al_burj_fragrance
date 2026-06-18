import { Link } from "@tanstack/react-router";
import { Instagram, Music2, Mail, Phone, MapPin } from "lucide-react";
import { SITE } from "@/lib/site";

export function Footer() {
  return (
    <footer className="mt-32 border-t border-[color:var(--gold)]/15 bg-[color:var(--plum)]/40">
      <div className="container-luxe py-20 grid gap-12 md:grid-cols-4">
        <div className="md:col-span-1 space-y-4">
          <div className="font-display text-3xl gold-gradient-text">ALBURJ</div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            A house of contemporary Eastern perfumery. Composed in Lahore, dressed in gold.
          </p>
          <div className="flex gap-3 pt-2">
            <a href={SITE.instagram} aria-label="Instagram" className="size-9 grid place-items-center border border-[color:var(--gold)]/30 hover:bg-[color:var(--gold)] hover:text-[color:var(--ink)] transition">
              <Instagram className="size-4" />
            </a>
            <a href={SITE.tiktok} aria-label="TikTok" className="size-9 grid place-items-center border border-[color:var(--gold)]/30 hover:bg-[color:var(--gold)] hover:text-[color:var(--ink)] transition">
              <Music2 className="size-4" />
            </a>
          </div>
        </div>

        <div>
          <div className="text-eyebrow mb-4">Discover</div>
          <ul className="space-y-3 text-sm text-foreground/80">
            <li><Link to="/shop" className="hover:text-[color:var(--gold)]">All Fragrances</Link></li>
            <li><Link to="/collections" className="hover:text-[color:var(--gold)]">Collections</Link></li>
            <li><Link to="/best-sellers" className="hover:text-[color:var(--gold)]">Best Sellers</Link></li>
            <li><Link to="/new-arrivals" className="hover:text-[color:var(--gold)]">New Arrivals</Link></li>
            <li><Link to="/reseller" className="hover:text-[color:var(--gold)]">Reseller Program</Link></li>
          </ul>
        </div>

        <div>
          <div className="text-eyebrow mb-4">Care</div>
          <ul className="space-y-3 text-sm text-foreground/80">
            <li><Link to="/about" className="hover:text-[color:var(--gold)]">About Us</Link></li>
            <li><Link to="/contact" className="hover:text-[color:var(--gold)]">Contact</Link></li>
            <li><Link to="/faq" className="hover:text-[color:var(--gold)]">FAQ</Link></li>
            <li><Link to="/shipping" className="hover:text-[color:var(--gold)]">Shipping Policy</Link></li>
            <li><Link to="/returns" className="hover:text-[color:var(--gold)]">Return Policy</Link></li>
            <li><Link to="/privacy" className="hover:text-[color:var(--gold)]">Privacy</Link></li>
            <li><Link to="/terms" className="hover:text-[color:var(--gold)]">Terms & Conditions</Link></li>
          </ul>
        </div>

        <div>
          <div className="text-eyebrow mb-4">Atelier</div>
          <ul className="space-y-3 text-sm text-foreground/80">
            <li className="flex items-start gap-2"><MapPin className="size-4 text-[color:var(--gold)] mt-0.5" /> {SITE.address}</li>
            <li className="flex items-center gap-2"><Phone className="size-4 text-[color:var(--gold)]" /> {SITE.phone}</li>
            <li className="flex items-center gap-2"><Mail className="size-4 text-[color:var(--gold)]" /> {SITE.email}</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-[color:var(--gold)]/10">
        <div className="container-luxe py-6 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <div>© {new Date().getFullYear()} Alburj Fragrance. All rights reserved.</div>
          <div className="tracking-[0.25em] uppercase">Composed in Lahore · Worn worldwide</div>
        </div>
      </div>
    </footer>
  );
}
