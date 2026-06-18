import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AdminLayout } from "@/components/admin/AdminLayout";

export const Route = createFileRoute("/_authenticated/admin/customers")({
  component: AdminCustomers,
});

function AdminCustomers() {
  const [rows, setRows] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    supabase.from("profiles").select("*").order("created_at", { ascending: false }).limit(200)
      .then(({ data }) => setRows(data ?? []));
  }, []);

  const filtered = rows.filter((r) => (r.full_name + " " + r.email + " " + (r.phone || "")).toLowerCase().includes(search.toLowerCase()));

  return (
    <AdminLayout title="Customers">
      <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name, email, phone..." className="w-full max-w-md mb-6 bg-transparent border border-[color:var(--gold)]/30 px-4 py-2.5 text-sm" />
      <div className="card-luxe overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b border-[color:var(--gold)]/20 text-eyebrow">
            <tr><th className="text-left p-3">Name</th><th className="text-left p-3">Email</th><th className="text-left p-3">Phone</th><th className="text-left p-3">City</th><th className="text-left p-3">Joined</th></tr>
          </thead>
          <tbody>
            {filtered.map((r) => (
              <tr key={r.id} className="border-b border-[color:var(--gold)]/10">
                <td className="p-3 font-display">{r.full_name || "—"}</td>
                <td className="p-3">{r.email}</td>
                <td className="p-3">{r.phone || "—"}</td>
                <td className="p-3">{r.city || "—"}</td>
                <td className="p-3 text-xs text-muted-foreground">{new Date(r.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
