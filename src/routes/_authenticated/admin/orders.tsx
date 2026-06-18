import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { formatPKR } from "@/lib/site";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin/orders")({
  component: AdminOrders,
});

const STATUSES = ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled", "refunded"] as const;
const PAYMENT_STATUSES = ["unpaid", "awaiting_verification", "paid", "refunded", "failed"] as const;

function AdminOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [filter, setFilter] = useState<string>("all");
  const [open, setOpen] = useState<string | null>(null);

  async function load() {
    let q = supabase.from("orders").select("*, items:order_items(*)").order("created_at", { ascending: false }).limit(100);
    if (filter !== "all") q = q.eq("status", filter as any);
    const { data } = await q;
    setOrders(data ?? []);
  }
  useEffect(() => { load(); }, [filter]);

  async function updateOrder(id: string, patch: any) {
    const { error } = await supabase.from("orders").update(patch).eq("id", id);
    if (error) { toast.error(error.message); return; }
    toast.success("Updated"); load();
  }

  return (
    <AdminLayout title="Orders">
      <div className="flex gap-2 mb-6 flex-wrap">
        <button onClick={() => setFilter("all")} className={`px-3 py-1.5 text-xs uppercase tracking-widest border ${filter === "all" ? "border-[color:var(--gold)] text-[color:var(--gold)]" : "border-[color:var(--gold)]/20"}`}>All</button>
        {STATUSES.map((s) => <button key={s} onClick={() => setFilter(s)} className={`px-3 py-1.5 text-xs uppercase tracking-widest border ${filter === s ? "border-[color:var(--gold)] text-[color:var(--gold)]" : "border-[color:var(--gold)]/20"}`}>{s}</button>)}
      </div>
      <div className="card-luxe overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b border-[color:var(--gold)]/20 text-eyebrow">
            <tr><th className="text-left p-3">Order</th><th className="text-left p-3">Customer</th><th className="text-left p-3">Total</th><th className="text-left p-3">Payment</th><th className="text-left p-3">Status</th><th className="text-left p-3">Date</th><th></th></tr>
          </thead>
          <tbody>
            {orders.length === 0 && <tr><td colSpan={7} className="p-8 text-center text-muted-foreground">No orders.</td></tr>}
            {orders.map((o) => (
              <>
                <tr key={o.id} className="border-b border-[color:var(--gold)]/10 cursor-pointer" onClick={() => setOpen(open === o.id ? null : o.id)}>
                  <td className="p-3 font-display">{o.order_number}</td>
                  <td className="p-3">{o.customer_name}<div className="text-xs text-muted-foreground">{o.customer_phone}</div></td>
                  <td className="p-3">{formatPKR(o.total)}</td>
                  <td className="p-3 text-xs uppercase tracking-widest">{o.payment_status}</td>
                  <td className="p-3 text-xs uppercase tracking-widest text-[color:var(--gold)]">{o.status}</td>
                  <td className="p-3 text-muted-foreground text-xs">{new Date(o.created_at).toLocaleString()}</td>
                  <td className="p-3 text-[color:var(--gold)]">{open === o.id ? "−" : "+"}</td>
                </tr>
                {open === o.id && (
                  <tr key={o.id + "-d"}><td colSpan={7} className="p-5 bg-[color:var(--gold)]/5">
                    <div className="grid md:grid-cols-3 gap-6">
                      <div>
                        <div className="text-eyebrow mb-2">Items</div>
                        {(o.items ?? []).map((it: any) => <div key={it.id} className="text-sm">{it.product_name} ({it.size_label}) × {it.quantity} = {formatPKR(it.line_total)}</div>)}
                      </div>
                      <div>
                        <div className="text-eyebrow mb-2">Shipping</div>
                        <div className="text-sm whitespace-pre-line">{o.shipping_address_line1}{o.shipping_address_line2 ? "\n" + o.shipping_address_line2 : ""}{"\n"}{o.shipping_city}{o.shipping_postal_code ? " " + o.shipping_postal_code : ""}{"\n"}{o.shipping_country}</div>
                        {o.notes && <div className="text-xs text-muted-foreground mt-2">Note: {o.notes}</div>}
                      </div>
                      <div className="space-y-3">
                        <div>
                          <label className="text-eyebrow block mb-1">Status</label>
                          <select defaultValue={o.status} onChange={(e) => updateOrder(o.id, { status: e.target.value })} className="w-full bg-background border border-[color:var(--gold)]/30 px-2 py-1.5 text-sm">{STATUSES.map((s) => <option key={s}>{s}</option>)}</select>
                        </div>
                        <div>
                          <label className="text-eyebrow block mb-1">Payment</label>
                          <select defaultValue={o.payment_status} onChange={(e) => updateOrder(o.id, { payment_status: e.target.value })} className="w-full bg-background border border-[color:var(--gold)]/30 px-2 py-1.5 text-sm">{PAYMENT_STATUSES.map((s) => <option key={s}>{s}</option>)}</select>
                        </div>
                        <div>
                          <label className="text-eyebrow block mb-1">Tracking #</label>
                          <input defaultValue={o.tracking_number || ""} onBlur={(e) => updateOrder(o.id, { tracking_number: e.target.value })} className="w-full bg-background border border-[color:var(--gold)]/30 px-2 py-1.5 text-sm" />
                        </div>
                      </div>
                    </div>
                  </td></tr>
                )}
              </>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
