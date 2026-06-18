import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { PageHero } from "@/components/site/PageHero";
import { formatPKR } from "@/lib/site";

export const Route = createFileRoute("/_authenticated/reseller-portal")({
  head: () => ({ meta: [{ title: "Reseller Portal — Alburj Fragrance" }] }),
  component: ResellerPortal,
});

function ResellerPortal() {
  const { user, isReseller, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [commissions, setCommissions] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [appStatus, setAppStatus] = useState<string | null>(null);

  useEffect(() => { if (!loading && !isReseller && !isAdmin) {
    // not a reseller — check application
    if (user) supabase.from("reseller_applications").select("status").eq("user_id", user.id).maybeSingle().then(({ data }) => setAppStatus(data?.status ?? "none"));
  } }, [loading, isReseller, isAdmin, user]);

  useEffect(() => {
    if (!user || (!isReseller && !isAdmin)) return;
    supabase.from("reseller_profiles").select("*, tier:reseller_tiers(*)").eq("id", user.id).maybeSingle().then(({ data }) => setProfile(data));
    supabase.from("commissions").select("*, order:orders(order_number, created_at)").eq("reseller_id", user.id).order("created_at", { ascending: false }).limit(20).then(({ data }) => setCommissions(data ?? []));
    supabase.from("products").select("id, slug, name, hero_image, variants:product_variants(size_ml, price_retail, price_wholesale)").eq("status", "active").limit(20).then(({ data }) => setProducts(data ?? []));
  }, [user, isReseller, isAdmin]);

  if (loading) return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Loading...</div>;

  if (!isReseller && !isAdmin) {
    return (
      <>
        <PageHero eyebrow="Partner" title="Reseller Portal" />
        <section className="container-luxe py-16 max-w-2xl mx-auto text-center">
          <div className="card-luxe p-10">
            {appStatus === "pending" && <><h2 className="font-display text-2xl mb-3">Application Under Review</h2><p className="text-muted-foreground">Our team is reviewing your reseller application. You'll receive a WhatsApp message within 2–3 business days.</p></>}
            {appStatus === "rejected" && <><h2 className="font-display text-2xl mb-3">Application Not Approved</h2><p className="text-muted-foreground">Unfortunately your application was not approved at this time.</p></>}
            {(!appStatus || appStatus === "none") && <><h2 className="font-display text-2xl mb-3">Become a Reseller</h2><p className="text-muted-foreground mb-6">Apply to join the Alburj Reseller Program for wholesale pricing and commissions.</p><Link to="/reseller" className="btn-luxe btn-luxe-hover">Apply Now</Link></>}
          </div>
        </section>
      </>
    );
  }

  const totalPaid = commissions.filter((c) => c.status === "paid").reduce((s, c) => s + c.commission_amount, 0);
  const totalPending = commissions.filter((c) => c.status !== "paid").reduce((s, c) => s + c.commission_amount, 0);

  return (
    <>
      <PageHero eyebrow={profile?.tier?.name ? `${profile.tier.name} Tier` : "Reseller"} title="Reseller Portal" />
      <section className="container-luxe py-16 space-y-12">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { l: "Referral Code", v: profile?.referral_code || "—" },
            { l: "Total Sales", v: formatPKR(profile?.total_sales ?? 0) },
            { l: "Commission Earned", v: formatPKR(profile?.total_commission ?? 0) },
            { l: "Unpaid Commission", v: formatPKR(profile?.unpaid_commission ?? 0) },
          ].map((c) => (
            <div key={c.l} className="card-luxe p-6">
              <div className="text-eyebrow text-[color:var(--gold-soft)]">{c.l}</div>
              <div className="font-display text-xl mt-2 gold-gradient-text break-all">{c.v}</div>
            </div>
          ))}
        </div>

        {profile?.tier && (
          <div className="card-luxe p-6">
            <div className="text-eyebrow mb-2">Your Tier Benefits</div>
            <div className="font-display text-2xl mb-3">{profile.tier.name} — {profile.tier.margin_percent}% margin · {profile.tier.commission_percent}% commission</div>
            <ul className="text-sm text-muted-foreground space-y-1">{(profile.tier.benefits ?? []).map((b: string) => <li key={b}>• {b}</li>)}</ul>
          </div>
        )}

        <div>
          <h2 className="font-display text-2xl mb-4">Wholesale Catalog</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {products.map((p) => {
              const v50 = p.variants?.find((v: any) => v.size_ml === 50);
              return (
                <Link key={p.id} to="/product/$slug" params={{ slug: p.slug }} className="card-luxe overflow-hidden block">
                  <img src={p.hero_image || ""} alt={p.name} loading="lazy" className="aspect-square object-cover w-full" />
                  <div className="p-3">
                    <div className="font-display text-sm">{p.name}</div>
                    {v50 && <div className="text-xs mt-1"><span className="line-through text-muted-foreground">{formatPKR(v50.price_retail)}</span> <span className="text-[color:var(--gold)]">{formatPKR(v50.price_wholesale)}</span></div>}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        <div>
          <h2 className="font-display text-2xl mb-4">Recent Commissions</h2>
          <div className="card-luxe overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-[color:var(--gold)]/20 text-eyebrow"><tr><th className="text-left p-3">Order</th><th className="text-left p-3">Amount</th><th className="text-left p-3">Commission</th><th className="text-left p-3">Status</th><th className="text-left p-3">Date</th></tr></thead>
              <tbody>
                {commissions.length === 0 ? <tr><td colSpan={5} className="p-8 text-center text-muted-foreground">No commissions yet.</td></tr> :
                  commissions.map((c) => (
                    <tr key={c.id} className="border-b border-[color:var(--gold)]/10">
                      <td className="p-3 font-display">{c.order?.order_number}</td>
                      <td className="p-3">{formatPKR(c.order_total)}</td>
                      <td className="p-3 text-[color:var(--gold)]">{formatPKR(c.commission_amount)}</td>
                      <td className="p-3 text-xs uppercase tracking-widest">{c.status}</td>
                      <td className="p-3 text-muted-foreground text-xs">{new Date(c.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
            <div className="p-4 text-xs text-muted-foreground border-t border-[color:var(--gold)]/10 flex justify-between">
              <span>Paid: <span className="text-[color:var(--gold)]">{formatPKR(totalPaid)}</span></span>
              <span>Pending: <span className="text-[color:var(--gold)]">{formatPKR(totalPending)}</span></span>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
