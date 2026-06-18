import { supabase } from "@/integrations/supabase/client";

export type DbProduct = {
  id: string; slug: string; name: string; tagline: string | null; description: string | null;
  category_id: string | null; gender: string | null; family: string | null;
  notes_top: string[]; notes_heart: string[]; notes_base: string[];
  longevity: number; projection: number; hero_image: string | null; gallery: string[];
  status: "draft" | "active" | "archived";
  is_featured: boolean | null; is_best_seller: boolean | null; is_new_arrival: boolean | null;
  meta_title: string | null; meta_description: string | null;
  variants?: DbVariant[]; category?: { slug: string; name: string } | null;
};
export type DbVariant = { id: string; product_id: string; size_ml: number; sku: string | null; price_retail: number; price_wholesale: number | null; stock: number; is_active: boolean; };

export async function listProducts(opts: { featured?: boolean; bestSeller?: boolean; newArrival?: boolean; categorySlug?: string; search?: string; } = {}) {
  let q = supabase.from("products").select("*, variants:product_variants(*), category:categories(slug,name)").eq("status", "active").order("sort_order");
  if (opts.featured) q = q.eq("is_featured", true);
  if (opts.bestSeller) q = q.eq("is_best_seller", true);
  if (opts.newArrival) q = q.eq("is_new_arrival", true);
  if (opts.search) q = q.ilike("name", `%${opts.search}%`);
  const { data, error } = await q;
  if (error) throw error;
  let products = (data ?? []) as DbProduct[];
  if (opts.categorySlug) products = products.filter((p) => p.category?.slug === opts.categorySlug);
  return products;
}

export async function getProduct(slug: string) {
  const { data, error } = await supabase.from("products")
    .select("*, variants:product_variants(*), category:categories(slug,name)")
    .eq("slug", slug).maybeSingle();
  if (error) throw error;
  return data as DbProduct | null;
}

export async function listCategories() {
  const { data, error } = await supabase.from("categories").select("*").eq("is_active", true).order("sort_order");
  if (error) throw error;
  return data ?? [];
}

export function priceFor(p: DbProduct, sizeMl: number, wholesale = false) {
  const v = p.variants?.find((x) => x.size_ml === sizeMl);
  if (!v) return 0;
  return wholesale && v.price_wholesale ? v.price_wholesale : v.price_retail;
}
