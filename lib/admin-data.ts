import { commerceBackendConfigured, getSupabaseAdmin } from "@/lib/supabase/admin";
import { products as demoProducts } from "@/lib/products";

export type AdminMetrics = {
  products: number;
  orders: number;
  revenue: number;
  lowStock: number;
  backend: boolean;
};

export async function getAdminMetrics(): Promise<AdminMetrics> {
  if (!commerceBackendConfigured()) {
    return {
      products: demoProducts.length,
      orders: 0,
      revenue: 0,
      lowStock: demoProducts.filter((product) => product.stock <= 5).length,
      backend: false,
    };
  }

  const supabase = getSupabaseAdmin();
  const [{ count: productCount }, { count: orderCount }, paidOrders, lowStock] = await Promise.all([
    supabase.from("products").select("*", { count: "exact", head: true }),
    supabase.from("orders").select("*", { count: "exact", head: true }),
    supabase.from("orders").select("total_ngn").eq("payment_status", "paid"),
    supabase.from("products").select("external_id").lte("stock", 5).eq("active", true),
  ]);

  return {
    products: productCount ?? 0,
    orders: orderCount ?? 0,
    revenue: (paidOrders.data ?? []).reduce((sum, order) => sum + Number(order.total_ngn || 0), 0),
    lowStock: lowStock.data?.length ?? 0,
    backend: true,
  };
}

export async function getAdminProducts() {
  if (!commerceBackendConfigured()) return { backend: false, products: [] as Record<string, unknown>[] };
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase.from("products").select("*").order("updated_at", { ascending: false });
  if (error) throw new Error(error.message);
  return { backend: true, products: data ?? [] };
}

export async function getAdminOrders() {
  if (!commerceBackendConfigured()) return { backend: false, orders: [] as Record<string, unknown>[] };
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("orders")
    .select("id,reference,email,customer_name,phone,city,state,total_ngn,status,payment_status,admin_note,created_at,order_items(product_name,quantity)")
    .order("created_at", { ascending: false })
    .limit(100);
  if (error) throw new Error(error.message);
  return { backend: true, orders: data ?? [] };
}
