import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { formatPKR } from "@/lib/site";

export const Route = createFileRoute("/_authenticated/admin/")({
  component: AdminDashboard,
});

function AdminDashboard() {
  const [stats, setStats] = useState({ orders: 0, revenue: 0, customers: 0, resellers: 0, products: 0, pendingApps: 0 });
  const [recent, setRecent] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      const [{ data: orders }, { count: customers }, { count: resellers }, { count: products }, { count: pendingApps }, { data: recentOrders }] = await Promise.all([
        supabase.from("orders").select("total, payment_status"),
        supabase.from("profiles").select("*", { count: "exact", head: true }),
        supabase.from("reseller_profiles").select("*", { count: "exact", head: true }),
        supabase.from("products").select("*", { count: "exact", head: true }),
        supabase.from("reseller_applications").select("*", { count: "exact", head: true }).eq("status", "pending"),
        supabase.from("orders").select("id, order_number, customer_name, total, status, created_at").order("created_at", { ascending: false }).limit(8),
      ]);
      setStats({
        orders: orders?.length ?? 0,
        revenue: (orders ?? []).filter((o) => o.payment_status === "paid").reduce((s, o) => s + (o.total || 0), 0),
        customers: customers ?? 0, resellers: resellers ?? 0, products: products ?? 0, pendingApps: pendingApps ?? 0,
      });
      setRecent(recentOrders ?? []);
    })();
  }, []);

  const cards = [
    { label: "Revenue", value: formatPKR(stats.revenue) },
    { label: "Orders", value: stats.orders },
    { label: "Customers", value: stats.customers },
    { label: "Products", value: stats.products },
    { label: "Resellers", value: stats.resellers },
    { label: "Pending Reseller Apps", value: stats.pendingApps, highlight: stats.pendingApps > 0 },
  ];

  return (
    <AdminLayout title="Dashboard">
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
        {cards.map((c) => (
          <div key={c.label} className={`card-luxe p-6 ${c.highlight ? "border-[color:var(--gold)]" : ""}`}>
            <div className="text-eyebrow text-[color:var(--gold-soft)]">{c.label}</div>
            <div className="font-display text-3xl mt-2 gold-gradient-text">{c.value}</div>
          </div>
        ))}
      </div>
      <div>
        <h2 className="font-display text-2xl mb-4">Recent Orders</h2>
        <div className="card-luxe overflow-hidden">
          <table className="w-full text-sm">
            <thead className="border-b border-[color:var(--gold)]/20 text-eyebrow">
              <tr><th className="text-left p-4">Order</th><th className="text-left p-4">Customer</th><th className="text-left p-4">Total</th><th className="text-left p-4">Status</th><th className="text-left p-4">Date</th></tr>
            </thead>
            <tbody>
              {recent.length === 0 ? <tr><td colSpan={5} className="p-8 text-center text-muted-foreground">No orders yet.</td></tr> :
                recent.map((o) => (
                  <tr key={o.id} className="border-b border-[color:var(--gold)]/10">
                    <td className="p-4 font-display">{o.order_number}</td>
                    <td className="p-4">{o.customer_name}</td>
                    <td className="p-4">{formatPKR(o.total)}</td>
                    <td className="p-4 text-xs uppercase tracking-widest text-[color:var(--gold)]">{o.status}</td>
                    <td className="p-4 text-muted-foreground">{new Date(o.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
