import { Link } from "@tanstack/react-router";
import { Menu, Search, ShoppingBag, User, X, LayoutDashboard } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/lib/cart";
import { useAuth } from "@/lib/auth";
import { CartSheet } from "./CartSheet";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/shop", label: "Shop" },
  { to: "/collections", label: "Collections" },
  { to: "/best-sellers", label: "Best Sellers" },
  { to: "/new-arrivals", label: "New Arrivals" },
  { to: "/reseller", label: "Resellers" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;

export function Header() {
  const { count } = useCart();
  const { user, isAdmin, isReseller } = useAuth();
  const [open, setOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);

  const accountLink = user ? (isAdmin ? "/admin" : isReseller ? "/reseller-portal" : "/account") : "/auth";

  return (
    <>
      <div className="bg-[color:var(--plum)]/80 border-b border-[color:var(--gold)]/15">
        <div className="container-luxe py-2 text-center text-[0.7rem] tracking-[0.28em] uppercase text-[color:var(--gold-soft)]">
          Complimentary shipping across Pakistan on orders above PKR 7,500
        </div>
      </div>

      <header className="sticky top-0 z-40 backdrop-blur-xl bg-[color:var(--ink)]/75 border-b border-[color:var(--gold)]/10">
        <div className="container-luxe flex items-center justify-between h-20">
          <button
            className="lg:hidden text-foreground"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="size-5" />
          </button>

          <Link to="/" className="flex items-center gap-2 group">
            <span className="font-display text-2xl md:text-3xl tracking-wide gold-gradient-text">
              ALBURJ
            </span>
            <span className="hidden md:inline text-[0.65rem] tracking-[0.4em] uppercase text-muted-foreground pt-1">
              Fragrance
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-8">
            {NAV.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                className="text-xs uppercase tracking-[0.22em] text-foreground/85 hover:text-[color:var(--gold)] transition-colors"
                activeProps={{ className: "text-[color:var(--gold)]" }}
              >
                {n.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4 text-foreground">
            <Link to="/shop" aria-label="Search" className="hover:text-[color:var(--gold)] transition">
              <Search className="size-5" />
            </Link>
            {isAdmin && (
              <Link to="/admin" aria-label="Admin" className="hidden md:inline hover:text-[color:var(--gold)] transition">
                <LayoutDashboard className="size-5" />
              </Link>
            )}
            <Link to={accountLink as any} aria-label="Account" className="hover:text-[color:var(--gold)] transition">
              <User className="size-5" />
            </Link>
            <button
              onClick={() => setCartOpen(true)}
              aria-label="Open cart"
              className="relative hover:text-[color:var(--gold)] transition"
            >
              <ShoppingBag className="size-5" />
              {count > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-[color:var(--gold)] text-[color:var(--ink)] text-[0.6rem] font-semibold rounded-full size-4 flex items-center justify-center">
                  {count}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {open && (
        <div className="fixed inset-0 z-50 bg-[color:var(--ink)]/95 backdrop-blur-xl lg:hidden animate-float-up">
          <div className="container-luxe flex items-center justify-between h-20">
            <span className="font-display text-2xl gold-gradient-text">ALBURJ</span>
            <button onClick={() => setOpen(false)} aria-label="Close menu">
              <X className="size-5" />
            </button>
          </div>
          <nav className="container-luxe flex flex-col gap-6 pt-8">
            {NAV.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                className="font-display text-3xl text-foreground hover:text-[color:var(--gold)] transition"
              >
                {n.label}
              </Link>
            ))}
            <div className="gold-divider mt-6" />
            <Link to={accountLink as any} onClick={() => setOpen(false)} className="text-sm uppercase tracking-[0.22em] text-muted-foreground">
              {user ? (isAdmin ? "Admin Panel" : isReseller ? "Reseller Portal" : "My Account") : "Sign in / Register"}
            </Link>
          </nav>
        </div>
      )}

      <CartSheet open={cartOpen} onOpenChange={setCartOpen} />
    </>
  );
}
