import { commerceBackendConfigured, getSupabaseAdmin } from "@/lib/supabase/admin";

type OrderItem = { product_name: string; quantity: number; line_total_ngn: number };
type OrderRow = {
  reference: string;
  email: string;
  customer_name: string;
  total_ngn: number;
  discount_ngn?: number | null;
  coupon_code?: string | null;
  status: string;
  payment_status: string;
  paid_at?: string | null;
  created_at: string;
  order_items?: OrderItem[];
};

export type SalesAnalytics = {
  backend: boolean;
  paidRevenue30: number;
  paidRevenue7: number;
  paidOrders30: number;
  averageOrderValue30: number;
  discounts30: number;
  couponOrders30: number;
  daily: Array<{ date: string; revenue: number; orders: number }>;
  topProducts: Array<{ name: string; quantity: number; revenue: number }>;
};

export type CustomerSummary = {
  email: string;
  name: string;
  orders: number;
  paidOrders: number;
  spend: number;
  lastOrderAt: string;
};

async function getOrders(): Promise<OrderRow[]> {
  if (!commerceBackendConfigured()) return [];
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase.from("orders")
    .select("reference,email,customer_name,total_ngn,discount_ngn,coupon_code,status,payment_status,paid_at,created_at,order_items(product_name,quantity,line_total_ngn)")
    .order("created_at", { ascending: false })
    .limit(1000);
  if (error) throw new Error(error.message);
  return (data ?? []) as OrderRow[];
}

export async function getSalesAnalytics(): Promise<SalesAnalytics> {
  if (!commerceBackendConfigured()) return {
    backend: false, paidRevenue30: 0, paidRevenue7: 0, paidOrders30: 0, averageOrderValue30: 0,
    discounts30: 0, couponOrders30: 0, daily: [], topProducts: [],
  };

  const orders = await getOrders();
  const now = Date.now();
  const day = 24 * 60 * 60 * 1000;
  const paid = orders.filter((order) => order.payment_status === "paid");
  const paid30 = paid.filter((order) => new Date(order.paid_at || order.created_at).getTime() >= now - 30 * day);
  const paid7 = paid.filter((order) => new Date(order.paid_at || order.created_at).getTime() >= now - 7 * day);

  const dailyMap = new Map<string, { revenue: number; orders: number }>();
  for (let i = 13; i >= 0; i--) {
    const date = new Date(now - i * day).toISOString().slice(0,10);
    dailyMap.set(date, { revenue: 0, orders: 0 });
  }

  for (const order of paid) {
    const date = new Date(order.paid_at || order.created_at).toISOString().slice(0,10);
    const slot = dailyMap.get(date);
    if (slot) {
      slot.revenue += Number(order.total_ngn || 0);
      slot.orders += 1;
    }
  }

  const productMap = new Map<string, { quantity: number; revenue: number }>();
  for (const order of paid30) {
    for (const item of order.order_items ?? []) {
      const current = productMap.get(item.product_name) || { quantity: 0, revenue: 0 };
      current.quantity += Number(item.quantity || 0);
      current.revenue += Number(item.line_total_ngn || 0);
      productMap.set(item.product_name, current);
    }
  }

  const paidRevenue30 = paid30.reduce((sum, order) => sum + Number(order.total_ngn || 0), 0);
  return {
    backend: true,
    paidRevenue30,
    paidRevenue7: paid7.reduce((sum, order) => sum + Number(order.total_ngn || 0), 0),
    paidOrders30: paid30.length,
    averageOrderValue30: paid30.length ? Math.round(paidRevenue30 / paid30.length) : 0,
    discounts30: paid30.reduce((sum, order) => sum + Number(order.discount_ngn || 0), 0),
    couponOrders30: paid30.filter((order) => Boolean(order.coupon_code)).length,
    daily: Array.from(dailyMap.entries()).map(([date, value]) => ({ date, ...value })),
    topProducts: Array.from(productMap.entries())
      .map(([name, value]) => ({ name, ...value }))
      .sort((a,b) => b.quantity - a.quantity)
      .slice(0,8),
  };
}

export async function getCustomerSummaries(): Promise<{ backend: boolean; customers: CustomerSummary[] }> {
  if (!commerceBackendConfigured()) return { backend: false, customers: [] };
  const orders = await getOrders();
  const map = new Map<string, CustomerSummary>();

  for (const order of orders) {
    const email = order.email.toLowerCase();
    const current = map.get(email) || {
      email,
      name: order.customer_name,
      orders: 0,
      paidOrders: 0,
      spend: 0,
      lastOrderAt: order.created_at,
    };

    current.orders += 1;
    if (order.payment_status === "paid") {
      current.paidOrders += 1;
      current.spend += Number(order.total_ngn || 0);
    }
    if (new Date(order.created_at) > new Date(current.lastOrderAt)) {
      current.lastOrderAt = order.created_at;
      current.name = order.customer_name;
    }
    map.set(email, current);
  }

  return { backend: true, customers: Array.from(map.values()).sort((a,b) => b.spend - a.spend) };
}
