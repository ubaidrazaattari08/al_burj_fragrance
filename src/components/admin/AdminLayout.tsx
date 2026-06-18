import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import { type ReactNode, useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { LayoutDashboard, Package, ShoppingBag, Users, UserCheck, Ticket, LogOut, Home } from "lucide-react";

const NAV: { to: string; label: string; icon: typeof LayoutDashboard; exact?: boolean }[] = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/admin/products", label: "Products", icon: Package },
  { to: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { to: "/admin/customers", label: "Customers", icon: Users },
  { to: "/admin/resellers", label: "Resellers", icon: UserCheck },
  { to: "/admin/coupons", label: "Coupons", icon: Ticket },
];

export function AdminLayout({ title, children }: { title: string; children: ReactNode }) {
  const { isAdmin, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => { if (!loading && !isAdmin) navigate({ to: "/account" }); }, [loading, isAdmin, navigate]);
  if (loading) return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Loading...</div>;
  if (!isAdmin) return null;

  return (
    <div className="min-h-screen grid md:grid-cols-[240px_1fr] bg-background">
      <aside className="border-r border-[color:var(--gold)]/15 p-4 md:min-h-screen">
        <Link to="/" className="block font-display text-xl gold-gradient-text mb-8 px-2">Alburj Admin</Link>
        <nav className="space-y-1">
          {NAV.map((n) => {
            const active = n.exact ? pathname === n.to : pathname.startsWith(n.to);
            return (
              <Link key={n.to} to={n.to as any} className={`flex items-center gap-3 px-3 py-2.5 text-sm border ${active ? "border-[color:var(--gold)] text-[color:var(--gold)] bg-[color:var(--gold)]/5" : "border-transparent hover:border-[color:var(--gold)]/30 text-muted-foreground hover:text-foreground"}`}>
                <n.icon className="size-4" strokeWidth={1.4} />{n.label}
              </Link>
            );
          })}
        </nav>
        <div className="mt-8 pt-4 border-t border-[color:var(--gold)]/15 space-y-1">
          <Link to="/" className="flex items-center gap-3 px-3 py-2.5 text-sm text-muted-foreground hover:text-foreground"><Home className="size-4" />Storefront</Link>
          <button onClick={async () => { await signOut(); navigate({ to: "/" }); }} className="flex w-full items-center gap-3 px-3 py-2.5 text-sm text-muted-foreground hover:text-foreground"><LogOut className="size-4" />Sign out</button>
        </div>
      </aside>
      <main className="p-6 md:p-10">
        <h1 className="font-display text-3xl gold-gradient-text mb-8">{title}</h1>
        {children}
      </main>
    </div>
  );
}
