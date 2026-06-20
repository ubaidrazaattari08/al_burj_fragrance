import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { formatPKR } from "@/lib/site";
import { toast } from "sonner";
import { Trash2, Plus, Pencil, Upload, X } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/products")({
  component: AdminProducts,
});

type Variant = { size_ml: number; price_retail: number; stock: number };
type P = {
  id: string; slug: string; name: string; tagline: string | null; description: string | null;
  status: string; is_featured: boolean | null; is_best_seller: boolean | null; is_new_arrival: boolean | null;
  hero_image: string | null; variants: Variant[];
};

type DraftShape = { slug: string; name: string; tagline: string; description: string; hero_image: string; price30: number; price50: number; price100: number };

const EMPTY_DRAFT: DraftShape = { slug: "", name: "", tagline: "", description: "", hero_image: "/products/bottle-1.jpg", price30: 2000, price50: 3600, price100: 6200 };

function AdminProducts() {
  const [products, setProducts] = useState<P[]>([]);
  const [search, setSearch] = useState("");
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState<DraftShape>(EMPTY_DRAFT);

  // Editing state: which product id is being edited, and its editable copy
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState<DraftShape>(EMPTY_DRAFT);

  // Track in-progress image uploads so we can disable buttons / show feedback
  const [uploadingNew, setUploadingNew] = useState(false);
  const [uploadingEdit, setUploadingEdit] = useState(false);
  const newFileInputRef = useRef<HTMLInputElement>(null);
  const editFileInputRef = useRef<HTMLInputElement>(null);

  async function load() {
    const { data } = await supabase.from("products").select("id, slug, name, tagline, description, status, is_featured, is_best_seller, is_new_arrival, hero_image, variants:product_variants(size_ml, price_retail, stock)").order("created_at", { ascending: false });
    setProducts((data ?? []) as P[]);
  }
  useEffect(() => { load(); }, []);

  async function toggleFlag(id: string, key: "is_featured" | "is_best_seller" | "is_new_arrival" | "status", current: any) {
    const newVal: any = key === "status" ? (current === "active" ? "archived" : "active") : !current;
    const patch: any = { [key]: newVal };
    const { error } = await supabase.from("products").update(patch).eq("id", id);
    if (error) { toast.error(error.message); return; }
    load();
  }

  async function remove(id: string) {
    if (!confirm("Delete this product?")) return;
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) { toast.error(error.message); return; }
    toast.success("Deleted"); load();
  }

  // Uploads a file to the "product-images" Supabase Storage bucket and
  // returns a public URL that can be saved straight into hero_image.
  async function uploadImage(file: File): Promise<string | null> {
    const ext = file.name.split(".").pop() || "jpg";
    const path = `${crypto.randomUUID()}.${ext}`;
    const { error } = await supabase.storage.from("product-images").upload(path, file, { cacheControl: "3600", upsert: false });
    if (error) { toast.error(`Image upload failed: ${error.message}`); return null; }
    const { data } = supabase.storage.from("product-images").getPublicUrl(path);
    return data.publicUrl;
  }

  async function handleNewFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingNew(true);
    const url = await uploadImage(file);
    setUploadingNew(false);
    if (url) { setDraft((d) => ({ ...d, hero_image: url })); toast.success("Image uploaded"); }
    e.target.value = "";
  }

  async function handleEditFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingEdit(true);
    const url = await uploadImage(file);
    setUploadingEdit(false);
    if (url) { setEditDraft((d) => ({ ...d, hero_image: url })); toast.success("Image uploaded"); }
    e.target.value = "";
  }

  async function create(e: React.FormEvent) {
    e.preventDefault();
    if (!draft.slug || !draft.name) { toast.error("Slug & name required"); return; }
    const { data, error } = await supabase.from("products").insert({
      slug: draft.slug, name: draft.name, tagline: draft.tagline, description: draft.description,
      hero_image: draft.hero_image, status: "active",
    }).select("id").single();
    if (error) { toast.error(error.message); return; }
    await supabase.from("product_variants").insert([
      { product_id: data.id, size_ml: 30, price_retail: draft.price30, price_wholesale: Math.round(draft.price30 * 0.7), stock: 50 },
      { product_id: data.id, size_ml: 50, price_retail: draft.price50, price_wholesale: Math.round(draft.price50 * 0.7), stock: 50 },
      { product_id: data.id, size_ml: 100, price_retail: draft.price100, price_wholesale: Math.round(draft.price100 * 0.7), stock: 50 },
    ]);
    toast.success("Product added");
    setAdding(false); setDraft(EMPTY_DRAFT);
    load();
  }

  function startEdit(p: P) {
    const v30 = p.variants.find((v) => v.size_ml === 30)?.price_retail ?? 2000;
    const v50 = p.variants.find((v) => v.size_ml === 50)?.price_retail ?? 3600;
    const v100 = p.variants.find((v) => v.size_ml === 100)?.price_retail ?? 6200;
    setEditDraft({
      slug: p.slug, name: p.name, tagline: p.tagline ?? "", description: p.description ?? "",
      hero_image: p.hero_image ?? "", price30: v30, price50: v50, price100: v100,
    });
    setEditingId(p.id);
    setAdding(false);
  }

  function cancelEdit() {
    setEditingId(null);
    setEditDraft(EMPTY_DRAFT);
  }

  async function saveEdit(id: string) {
    if (!editDraft.slug || !editDraft.name) { toast.error("Slug & name required"); return; }
    const { error } = await supabase.from("products").update({
      slug: editDraft.slug, name: editDraft.name, tagline: editDraft.tagline,
      description: editDraft.description, hero_image: editDraft.hero_image,
    }).eq("id", id);
    if (error) { toast.error(error.message); return; }

    // Upsert each variant's price (size_ml + product_id is unique, so this updates existing rows
    // or creates them if a variant for that size doesn't exist yet).
    const variantUpserts = [
      { product_id: id, size_ml: 30, price_retail: editDraft.price30, price_wholesale: Math.round(editDraft.price30 * 0.7) },
      { product_id: id, size_ml: 50, price_retail: editDraft.price50, price_wholesale: Math.round(editDraft.price50 * 0.7) },
      { product_id: id, size_ml: 100, price_retail: editDraft.price100, price_wholesale: Math.round(editDraft.price100 * 0.7) },
    ];
    const { error: vError } = await supabase.from("product_variants").upsert(variantUpserts, { onConflict: "product_id,size_ml" });
    if (vError) { toast.error(vError.message); return; }

    toast.success("Product updated");
    cancelEdit();
    load();
  }

  const filtered = products.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <AdminLayout title="Products">
      <div className="flex flex-wrap gap-3 mb-6">
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search products..." className="flex-1 min-w-[200px] bg-transparent border border-[color:var(--gold)]/30 px-4 py-2.5 text-sm focus:outline-none focus:border-[color:var(--gold)]" />
        <button onClick={() => { setAdding(!adding); cancelEdit(); }} className="btn-luxe btn-luxe-hover flex items-center gap-2"><Plus className="size-4" />{adding ? "Cancel" : "New Product"}</button>
      </div>

      {adding && (
        <form onSubmit={create} className="card-luxe p-6 mb-8 grid md:grid-cols-2 gap-4">
          <input placeholder="Slug (unique-url-name)" value={draft.slug} onChange={(e) => setDraft({ ...draft, slug: e.target.value })} className="bg-transparent border border-[color:var(--gold)]/30 px-3 py-2 text-sm" />
          <input placeholder="Product Name" value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} className="bg-transparent border border-[color:var(--gold)]/30 px-3 py-2 text-sm" />
          <input placeholder="Tagline" value={draft.tagline} onChange={(e) => setDraft({ ...draft, tagline: e.target.value })} className="bg-transparent border border-[color:var(--gold)]/30 px-3 py-2 text-sm md:col-span-2" />
          <textarea placeholder="Description" value={draft.description} onChange={(e) => setDraft({ ...draft, description: e.target.value })} className="bg-transparent border border-[color:var(--gold)]/30 px-3 py-2 text-sm md:col-span-2" rows={3} />

          <div className="md:col-span-2 flex items-center gap-4">
            {draft.hero_image && <img src={draft.hero_image} alt="" className="size-16 object-cover border border-[color:var(--gold)]/30" />}
            <button type="button" onClick={() => newFileInputRef.current?.click()} disabled={uploadingNew} className="btn-luxe flex items-center gap-2 text-xs disabled:opacity-50">
              <Upload className="size-4" />{uploadingNew ? "Uploading..." : "Upload Image"}
            </button>
            <input ref={newFileInputRef} type="file" accept="image/*" className="hidden" onChange={handleNewFileChange} />
          </div>

          <input type="number" placeholder="Price 30ml" value={draft.price30} onChange={(e) => setDraft({ ...draft, price30: +e.target.value })} className="bg-transparent border border-[color:var(--gold)]/30 px-3 py-2 text-sm" />
          <input type="number" placeholder="Price 50ml" value={draft.price50} onChange={(e) => setDraft({ ...draft, price50: +e.target.value })} className="bg-transparent border border-[color:var(--gold)]/30 px-3 py-2 text-sm" />
          <input type="number" placeholder="Price 100ml" value={draft.price100} onChange={(e) => setDraft({ ...draft, price100: +e.target.value })} className="bg-transparent border border-[color:var(--gold)]/30 px-3 py-2 text-sm md:col-span-2" />
          <button className="btn-luxe btn-luxe-hover md:col-span-2">Create Product</button>
        </form>
      )}

      <div className="card-luxe overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b border-[color:var(--gold)]/20 text-eyebrow">
            <tr><th className="text-left p-3">Product</th><th className="text-left p-3">Prices</th><th className="text-left p-3">Stock</th><th className="text-left p-3">Flags</th><th className="text-left p-3">Status</th><th className="p-3"></th></tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <>
                <tr key={p.id} className="border-b border-[color:var(--gold)]/10">
                  <td className="p-3 flex items-center gap-3"><img src={p.hero_image || ""} alt="" className="size-12 object-cover" /><div><div className="font-display">{p.name}</div><div className="text-xs text-muted-foreground">{p.slug}</div></div></td>
                  <td className="p-3 text-xs">{p.variants.sort((a, b) => a.size_ml - b.size_ml).map((v) => <div key={v.size_ml}>{v.size_ml}ml — {formatPKR(v.price_retail)}</div>)}</td>
                  <td className="p-3 text-xs">{p.variants.reduce((s, v) => s + v.stock, 0)}</td>
                  <td className="p-3 space-x-1">
                    <button onClick={() => toggleFlag(p.id, "is_featured", p.is_featured)} className={`px-2 py-1 text-[10px] uppercase tracking-widest border ${p.is_featured ? "border-[color:var(--gold)] text-[color:var(--gold)]" : "border-[color:var(--gold)]/20 text-muted-foreground"}`}>Feat</button>
                    <button onClick={() => toggleFlag(p.id, "is_best_seller", p.is_best_seller)} className={`px-2 py-1 text-[10px] uppercase tracking-widest border ${p.is_best_seller ? "border-[color:var(--gold)] text-[color:var(--gold)]" : "border-[color:var(--gold)]/20 text-muted-foreground"}`}>Best</button>
                    <button onClick={() => toggleFlag(p.id, "is_new_arrival", p.is_new_arrival)} className={`px-2 py-1 text-[10px] uppercase tracking-widest border ${p.is_new_arrival ? "border-[color:var(--gold)] text-[color:var(--gold)]" : "border-[color:var(--gold)]/20 text-muted-foreground"}`}>New</button>
                  </td>
                  <td className="p-3"><button onClick={() => toggleFlag(p.id, "status", p.status)} className={`text-xs uppercase tracking-widest ${p.status === "active" ? "text-[color:var(--gold)]" : "text-muted-foreground"}`}>{p.status}</button></td>
                  <td className="p-3 flex items-center gap-2">
                    <button onClick={() => (editingId === p.id ? cancelEdit() : startEdit(p))} className="text-[color:var(--gold)] hover:opacity-70" title="Edit"><Pencil className="size-4" /></button>
                    <button onClick={() => remove(p.id)} className="text-destructive hover:text-destructive/80" title="Delete"><Trash2 className="size-4" /></button>
                  </td>
                </tr>
                {editingId === p.id && (
                  <tr key={`${p.id}-edit`} className="border-b border-[color:var(--gold)]/10 bg-[color:var(--gold)]/5">
                    <td colSpan={6} className="p-6">
                      <div className="grid md:grid-cols-2 gap-4">
                        <input placeholder="Slug" value={editDraft.slug} onChange={(e) => setEditDraft({ ...editDraft, slug: e.target.value })} className="bg-transparent border border-[color:var(--gold)]/30 px-3 py-2 text-sm" />
                        <input placeholder="Product Name" value={editDraft.name} onChange={(e) => setEditDraft({ ...editDraft, name: e.target.value })} className="bg-transparent border border-[color:var(--gold)]/30 px-3 py-2 text-sm" />
                        <input placeholder="Tagline" value={editDraft.tagline} onChange={(e) => setEditDraft({ ...editDraft, tagline: e.target.value })} className="bg-transparent border border-[color:var(--gold)]/30 px-3 py-2 text-sm md:col-span-2" />
                        <textarea placeholder="Description" value={editDraft.description} onChange={(e) => setEditDraft({ ...editDraft, description: e.target.value })} className="bg-transparent border border-[color:var(--gold)]/30 px-3 py-2 text-sm md:col-span-2" rows={3} />

                        <div className="md:col-span-2 flex items-center gap-4">
                          {editDraft.hero_image && <img src={editDraft.hero_image} alt="" className="size-16 object-cover border border-[color:var(--gold)]/30" />}
                          <button type="button" onClick={() => editFileInputRef.current?.click()} disabled={uploadingEdit} className="btn-luxe flex items-center gap-2 text-xs disabled:opacity-50">
                            <Upload className="size-4" />{uploadingEdit ? "Uploading..." : "Replace Image"}
                          </button>
                          <input ref={editFileInputRef} type="file" accept="image/*" className="hidden" onChange={handleEditFileChange} />
                        </div>

                        <input type="number" placeholder="Price 30ml" value={editDraft.price30} onChange={(e) => setEditDraft({ ...editDraft, price30: +e.target.value })} className="bg-transparent border border-[color:var(--gold)]/30 px-3 py-2 text-sm" />
                        <input type="number" placeholder="Price 50ml" value={editDraft.price50} onChange={(e) => setEditDraft({ ...editDraft, price50: +e.target.value })} className="bg-transparent border border-[color:var(--gold)]/30 px-3 py-2 text-sm" />
                        <input type="number" placeholder="Price 100ml" value={editDraft.price100} onChange={(e) => setEditDraft({ ...editDraft, price100: +e.target.value })} className="bg-transparent border border-[color:var(--gold)]/30 px-3 py-2 text-sm md:col-span-2" />

                        <div className="md:col-span-2 flex gap-3">
                          <button type="button" onClick={() => saveEdit(p.id)} className="btn-luxe btn-luxe-hover flex-1">Save Changes</button>
                          <button type="button" onClick={cancelEdit} className="px-4 py-2 border border-[color:var(--gold)]/30 text-xs uppercase tracking-widest flex items-center gap-2"><X className="size-4" />Cancel</button>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
