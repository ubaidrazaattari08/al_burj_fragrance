import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/coupons")({
  component: AdminCoupons,
});

function AdminCoupons() {
  const [coupons, setCoupons] = useState<any[]>([]);
  const [draft, setDraft] = useState({ code: "", discount_type: "percent", discount_value: 10, min_order_amount: 0, usage_limit: "", is_active: true });

  async function load() {
    const { data } = await supabase.from("coupons").select("*").order("created_at", { ascending: false });
    setCoupons(data ?? []);
  }
  useEffect(() => { load(); }, []);

  async function create(e: React.FormEvent) {
    e.preventDefault();
    const { error } = await supabase.from("coupons").insert({
      code: draft.code.toUpperCase(), discount_type: draft.discount_type as any, discount_value: draft.discount_value,
      min_order_amount: draft.min_order_amount || 0, usage_limit: draft.usage_limit ? +draft.usage_limit : null, is_active: draft.is_active,
    });
    if (error) { toast.error(error.message); return; }
    toast.success("Coupon created");
    setDraft({ code: "", discount_type: "percent", discount_value: 10, min_order_amount: 0, usage_limit: "", is_active: true });
    load();
  }

  async function toggle(id: string, current: boolean) {
    await supabase.from("coupons").update({ is_active: !current }).eq("id", id);
    load();
  }
  async function remove(id: string) {
    if (!confirm("Delete coupon?")) return;
    await supabase.from("coupons").delete().eq("id", id); load();
  }

  return (
    <AdminLayout title="Coupons">
      <form onSubmit={create} className="card-luxe p-6 mb-8 grid md:grid-cols-3 gap-3">
        <input required placeholder="CODE" value={draft.code} onChange={(e) => setDraft({ ...draft, code: e.target.value })} className="bg-transparent border border-[color:var(--gold)]/30 px-3 py-2 text-sm uppercase" />
        <select value={draft.discount_type} onChange={(e) => setDraft({ ...draft, discount_type: e.target.value })} className="bg-background border border-[color:var(--gold)]/30 px-3 py-2 text-sm"><option value="percent">% percent</option><option value="fixed">PKR fixed</option></select>
        <input type="number" placeholder="Value" value={draft.discount_value} onChange={(e) => setDraft({ ...draft, discount_value: +e.target.value })} className="bg-transparent border border-[color:var(--gold)]/30 px-3 py-2 text-sm" />
        <input type="number" placeholder="Min order PKR" value={draft.min_order_amount} onChange={(e) => setDraft({ ...draft, min_order_amount: +e.target.value })} className="bg-transparent border border-[color:var(--gold)]/30 px-3 py-2 text-sm" />
        <input type="number" placeholder="Usage limit (blank = ∞)" value={draft.usage_limit} onChange={(e) => setDraft({ ...draft, usage_limit: e.target.value })} className="bg-transparent border border-[color:var(--gold)]/30 px-3 py-2 text-sm" />
        <button className="btn-luxe btn-luxe-hover">Create Coupon</button>
      </form>

      <div className="card-luxe overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b border-[color:var(--gold)]/20 text-eyebrow"><tr><th className="text-left p-3">Code</th><th className="text-left p-3">Discount</th><th className="text-left p-3">Min Order</th><th className="text-left p-3">Used</th><th className="text-left p-3">Limit</th><th className="text-left p-3">Active</th><th></th></tr></thead>
          <tbody>
            {coupons.map((c) => (
              <tr key={c.id} className="border-b border-[color:var(--gold)]/10">
                <td className="p-3 font-mono text-[color:var(--gold)]">{c.code}</td>
                <td className="p-3">{c.discount_type === "percent" ? `${c.discount_value}%` : `PKR ${c.discount_value}`}</td>
                <td className="p-3">{c.min_order_amount}</td>
                <td className="p-3">{c.usage_count}</td>
                <td className="p-3">{c.usage_limit ?? "∞"}</td>
                <td className="p-3"><button onClick={() => toggle(c.id, c.is_active)} className={`text-xs uppercase tracking-widest ${c.is_active ? "text-[color:var(--gold)]" : "text-muted-foreground"}`}>{c.is_active ? "active" : "inactive"}</button></td>
                <td className="p-3"><button onClick={() => remove(c.id)} className="text-destructive"><Trash2 className="size-4" /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
