import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { PageHero } from "@/components/site/PageHero";
import { formatPKR } from "@/lib/site";

export const Route = createFileRoute("/_authenticated/account")({
  head: () => ({ meta: [{ title: "My Account — Alburj Fragrance" }] }),
  component: Account,
});

type Order = { id: string; order_number: string; created_at: string; status: string; payment_status: string; total: number; };

function Account() {
  const { user, isAdmin, isReseller, signOut } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    if (!user) return;
    supabase.from("orders").select("id, order_number, created_at, status, payment_status, total")
      .eq("user_id", user.id).order("created_at", { ascending: false }).limit(10)
      .then(({ data }) => setOrders(data ?? []));
    supabase.from("profiles").select("*").eq("id", user.id).maybeSingle()
      .then(({ data }) => setProfile(data));
  }, [user]);

  const totalSpent = orders.reduce((s, o) => s + (o.total || 0), 0);

  return (
    <>
      <PageHero eyebrow="Welcome Back" title={profile?.full_name || "Your Account"} />
      <section className="container-luxe py-16 grid lg:grid-cols-[240px_1fr] gap-10">
        <aside className="space-y-2 text-sm">
          <div className="px-4 py-3 border border-[color:var(--gold)] text-[color:var(--gold)] text-xs uppercase tracking-[0.22em]">Overview</div>
          {isAdmin && <Link to="/admin" className="block px-4 py-3 border border-[color:var(--gold)]/20 hover:border-[color:var(--gold)]/50 text-xs uppercase tracking-[0.22em]">Admin Panel →</Link>}
          {isReseller && <Link to="/reseller-portal" className="block px-4 py-3 border border-[color:var(--gold)]/20 hover:border-[color:var(--gold)]/50 text-xs uppercase tracking-[0.22em]">Reseller Portal →</Link>}
          <button onClick={async () => { await signOut(); navigate({ to: "/" }); }} className="block w-full text-left px-4 py-3 border border-[color:var(--gold)]/20 hover:border-[color:var(--gold)]/50 text-xs uppercase tracking-[0.22em]">Sign Out</button>
        </aside>
        <div className="space-y-10">
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { label: "Lifetime Orders", value: orders.length },
              { label: "Total Spent", value: formatPKR(totalSpent) },
              { label: "Member", value: isAdmin ? "Admin" : isReseller ? "Reseller" : "Customer" },
            ].map((c) => (
              <div key={c.label} className="card-luxe p-6">
                <div className="text-eyebrow text-[color:var(--gold-soft)]">{c.label}</div>
                <div className="font-display text-2xl mt-2 gold-gradient-text">{c.value}</div>
              </div>
            ))}
          </div>
          <div>
            <h2 className="font-display text-2xl mb-5">Recent Orders</h2>
            {orders.length === 0 ? (
              <div className="card-luxe p-10 text-center text-muted-foreground">No orders yet. <Link to="/shop" className="text-[color:var(--gold)]">Discover the collection →</Link></div>
            ) : (
              <div className="space-y-3">
                {orders.map((o) => (
                  <div key={o.id} className="card-luxe p-5 flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <div className="font-display text-lg">{o.order_number}</div>
                      <div className="text-xs text-muted-foreground uppercase tracking-widest mt-1">{new Date(o.created_at).toLocaleDateString()}</div>
                    </div>
                    <div className="flex items-center gap-6">
                      <span className="text-xs uppercase tracking-[0.22em] text-[color:var(--gold)]">{o.status}</span>
                      <span className="text-xs uppercase tracking-[0.22em] text-muted-foreground">{o.payment_status}</span>
                      <span className="font-display text-lg">{formatPKR(o.total)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
