import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { formatPKR } from "@/lib/site";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin/resellers")({
  component: AdminResellers,
});

function AdminResellers() {
  const [tab, setTab] = useState<"applications" | "active" | "commissions">("applications");
  const [apps, setApps] = useState<any[]>([]);
  const [active, setActive] = useState<any[]>([]);
  const [commissions, setCommissions] = useState<any[]>([]);
  const [tiers, setTiers] = useState<any[]>([]);

  async function load() {
    const [{ data: a }, { data: p }, { data: c }, { data: t }] = await Promise.all([
      supabase.from("reseller_applications").select("*").order("created_at", { ascending: false }),
      supabase.from("reseller_profiles").select("*, tier:reseller_tiers(name, margin_percent, commission_percent)").order("created_at", { ascending: false }),
      supabase.from("commissions").select("*, order:orders(order_number, customer_name)").order("created_at", { ascending: false }).limit(100),
      supabase.from("reseller_tiers").select("*").order("sort_order"),
    ]);
    setApps(a ?? []); setActive(p ?? []); setCommissions(c ?? []); setTiers(t ?? []);
  }
  useEffect(() => { load(); }, []);

  async function reviewApp(app: any, status: "approved" | "rejected") {
    if (status === "approved") {
      if (!app.user_id) { toast.error("Applicant must register first (no linked account)."); return; }
      const tierId = tiers[0]?.id;
      const refCode = "ALB-" + (app.full_name as string).slice(0, 3).toUpperCase() + Math.floor(1000 + Math.random() * 9000);
      const { error: e1 } = await supabase.from("reseller_profiles").insert({ id: app.user_id, tier_id: tierId, business_name: app.business_name, referral_code: refCode });
      if (e1) { toast.error(e1.message); return; }
      await supabase.from("user_roles").insert({ user_id: app.user_id, role: "reseller" });
    }
    await supabase.from("reseller_applications").update({ status, reviewed_at: new Date().toISOString() }).eq("id", app.id);
    toast.success(`Application ${status}`); load();
  }

  async function setTier(profileId: string, tierId: string) {
    await supabase.from("reseller_profiles").update({ tier_id: tierId }).eq("id", profileId);
    toast.success("Tier updated"); load();
  }

  async function markCommissionPaid(id: string) {
    await supabase.from("commissions").update({ status: "paid", paid_at: new Date().toISOString() }).eq("id", id);
    toast.success("Marked paid"); load();
  }

  return (
    <AdminLayout title="Resellers">
      <div className="flex gap-2 mb-6">
        {(["applications", "active", "commissions"] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 text-xs uppercase tracking-widest border ${tab === t ? "border-[color:var(--gold)] text-[color:var(--gold)]" : "border-[color:var(--gold)]/20"}`}>{t}</button>
        ))}
      </div>

      {tab === "applications" && (
        <div className="card-luxe overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-[color:var(--gold)]/20 text-eyebrow"><tr><th className="text-left p-3">Applicant</th><th className="text-left p-3">Contact</th><th className="text-left p-3">Location</th><th className="text-left p-3">Monthly</th><th className="text-left p-3">Status</th><th></th></tr></thead>
            <tbody>
              {apps.map((a) => (
                <tr key={a.id} className="border-b border-[color:var(--gold)]/10">
                  <td className="p-3"><div className="font-display">{a.full_name}</div><div className="text-xs text-muted-foreground">{a.business_name}</div></td>
                  <td className="p-3 text-xs">{a.email}<br />{a.mobile}</td>
                  <td className="p-3 text-xs">{a.city}, {a.country}</td>
                  <td className="p-3 text-xs">{a.expected_monthly_pkr ? formatPKR(a.expected_monthly_pkr) : "—"}</td>
                  <td className="p-3 text-xs uppercase tracking-widest">{a.status}</td>
                  <td className="p-3 space-x-2">
                    {a.status === "pending" && (<>
                      <button onClick={() => reviewApp(a, "approved")} className="text-xs px-3 py-1 border border-[color:var(--gold)] text-[color:var(--gold)]">Approve</button>
                      <button onClick={() => reviewApp(a, "rejected")} className="text-xs px-3 py-1 border border-destructive text-destructive">Reject</button>
                    </>)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === "active" && (
        <div className="card-luxe overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-[color:var(--gold)]/20 text-eyebrow"><tr><th className="text-left p-3">Business</th><th className="text-left p-3">Referral Code</th><th className="text-left p-3">Tier</th><th className="text-left p-3">Sales</th><th className="text-left p-3">Unpaid</th></tr></thead>
            <tbody>
              {active.map((r) => (
                <tr key={r.id} className="border-b border-[color:var(--gold)]/10">
                  <td className="p-3 font-display">{r.business_name || "—"}</td>
                  <td className="p-3 font-mono text-xs">{r.referral_code}</td>
                  <td className="p-3"><select defaultValue={r.tier_id} onChange={(e) => setTier(r.id, e.target.value)} className="bg-background border border-[color:var(--gold)]/30 px-2 py-1 text-xs">{tiers.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}</select></td>
                  <td className="p-3">{formatPKR(r.total_sales)}</td>
                  <td className="p-3 text-[color:var(--gold)]">{formatPKR(r.unpaid_commission)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === "commissions" && (
        <div className="card-luxe overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-[color:var(--gold)]/20 text-eyebrow"><tr><th className="text-left p-3">Order</th><th className="text-left p-3">Customer</th><th className="text-left p-3">Order Total</th><th className="text-left p-3">%</th><th className="text-left p-3">Commission</th><th className="text-left p-3">Status</th><th></th></tr></thead>
            <tbody>
              {commissions.map((c) => (
                <tr key={c.id} className="border-b border-[color:var(--gold)]/10">
                  <td className="p-3 font-display">{c.order?.order_number}</td>
                  <td className="p-3">{c.order?.customer_name}</td>
                  <td className="p-3">{formatPKR(c.order_total)}</td>
                  <td className="p-3">{c.commission_percent}%</td>
                  <td className="p-3 text-[color:var(--gold)]">{formatPKR(c.commission_amount)}</td>
                  <td className="p-3 text-xs uppercase tracking-widest">{c.status}</td>
                  <td className="p-3">{c.status !== "paid" && <button onClick={() => markCommissionPaid(c.id)} className="text-xs px-3 py-1 border border-[color:var(--gold)] text-[color:var(--gold)]">Mark Paid</button>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  );
}
