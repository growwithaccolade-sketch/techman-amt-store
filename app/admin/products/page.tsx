import { redirect } from "next/navigation";
import AdminNav from "@/components/admin-nav";
import { hasAdminSession } from "@/app/admin/actions";
import { getAdminProducts } from "@/lib/admin-data";
import { createProduct, deleteProduct, updateProduct } from "./actions";
import { money } from "@/lib/products";

type Row = {
  id: string;
  name: string;
  brand: string;
  category: string;
  price_ngn: number;
  old_price_ngn?: number | null;
  stock: number;
  image_url?: string | null;
  blurb?: string | null;
  badge?: string | null;
  warranty?: string | null;
  condition?: string | null;
  active: boolean;
};

export default async function AdminProductsPage({ searchParams }: { searchParams: Promise<{ error?: string; success?: string }> }) {
  if (!(await hasAdminSession())) redirect("/admin");
  const { error, success } = await searchParams;
  const { backend, products } = await getAdminProducts();
  const rows = products as Row[];

  return (
    <main className="adminShell">
      <AdminNav active="products"/>
      <section className="adminMain">
        <div className="adminTop"><div><span className="kicker">CATALOG</span><h1>Products & Inventory</h1></div><a className="secondaryAction" href="/">View storefront</a></div>
        {!backend && <div className="adminNotice warning">Supabase is not connected yet. The storefront demo catalog still works, but database product editing is disabled until the environment variables and migrations are configured.</div>}
        {error && <div className="adminNotice error">Could not complete that change: {error}</div>}
        {success && <div className="adminNotice success">Product change saved successfully.</div>}

        <div className="adminCatalogLayout">
          <section className="adminCard">
            <span className="kicker">ADD PRODUCT</span>
            <h2>Create a catalog item</h2>
            <form className="adminForm" action={createProduct}>
              <div className="fieldGrid"><label>Product name<input name="name" required/></label><label>Brand<input name="brand" required/></label></div>
              <div className="fieldGrid"><label>Category<input name="category" placeholder="Phones" required/></label><label>Slug<input name="slug" placeholder="auto-generated if blank"/></label></div>
              <div className="fieldGrid"><label>Price in ₦<input name="price" type="number" min="0" step="1" required/></label><label>Old price in ₦<input name="oldPrice" type="number" min="0" step="1"/></label></div>
              <div className="fieldGrid"><label>Stock quantity<input name="stock" type="number" min="0" step="1" required/></label><label>Condition<select name="condition"><option>New</option><option>UK Used</option></select></label></div>
              <label>Upload product image<input name="imageFile" type="file" accept="image/jpeg,image/png,image/webp,image/avif"/></label><label>Or image URL<input name="image" type="url" placeholder="https://..."/></label>
              <label>Short selling description<textarea name="blurb" rows={3}/></label>
              <div className="fieldGrid"><label>Badge<input name="badge" placeholder="Bestseller"/></label><label>Warranty<input name="warranty" placeholder="1 year seller warranty"/></label></div>
              <button className="primaryAction" type="submit" disabled={!backend}>Create product</button>
            </form>
          </section>

          <section className="adminCard">
            <div className="adminListHead"><div><span className="kicker">LIVE DATABASE</span><h2>{rows.length} products</h2></div><span>Stock ≤ 5 needs attention</span></div>
            {!backend ? <div className="adminEmpty"><h3>Database catalog not connected.</h3><p>Apply the Supabase migrations and configure the server environment variables to manage products here.</p></div> :
            rows.length === 0 ? <div className="adminEmpty"><h3>No database products yet.</h3><p>Create the first product with the form beside this panel.</p></div> :
            <div className="adminProductList">
              {rows.map((product) => <details key={product.id} className="adminProductRow">
                <summary>
                  <div><strong>{product.name}</strong><span>{product.brand} · {product.category}</span></div>
                  <div><b>{money(Number(product.price_ngn))}</b><span className={product.stock <= 5 ? "stockDanger" : ""}>{product.stock} in stock</span><em className={product.active ? "statusLive" : "statusOff"}>{product.active ? "Live" : "Hidden"}</em></div>
                </summary>
                <div className="adminProductEdit">
                  <form className="adminForm" action={updateProduct}>
                    <input type="hidden" name="id" value={product.id}/>
                    <div className="fieldGrid"><label>Name<input name="name" defaultValue={product.name} required/></label><label>Brand<input name="brand" defaultValue={product.brand} required/></label></div>
                    <div className="fieldGrid"><label>Category<input name="category" defaultValue={product.category} required/></label><label>Stock<input name="stock" type="number" min="0" defaultValue={product.stock} required/></label></div>
                    <div className="fieldGrid"><label>Price<input name="price" type="number" min="0" defaultValue={product.price_ngn} required/></label><label>Old price<input name="oldPrice" type="number" min="0" defaultValue={product.old_price_ngn ?? ""}/></label></div>
                    <label>Replace image<input name="imageFile" type="file" accept="image/jpeg,image/png,image/webp,image/avif"/></label><label>Current / fallback image URL<input name="image" type="url" defaultValue={product.image_url ?? ""}/></label>
                    <label>Description<textarea name="blurb" rows={3} defaultValue={product.blurb ?? ""}/></label>
                    <div className="fieldGrid"><label>Badge<input name="badge" defaultValue={product.badge ?? ""}/></label><label>Warranty<input name="warranty" defaultValue={product.warranty ?? ""}/></label></div>
                    <div className="fieldGrid"><label>Condition<select name="condition" defaultValue={product.condition ?? "New"}><option>New</option><option>UK Used</option></select></label><label className="checkLabel"><input name="active" type="checkbox" defaultChecked={product.active}/> Visible on storefront</label></div>
                    <div className="adminRowActions"><button className="primaryAction" type="submit">Save changes</button></div>
                  </form>
                  <form action={deleteProduct}><input type="hidden" name="id" value={product.id}/><button className="dangerButton" type="submit">Delete product</button></form>
                </div>
              </details>)}
            </div>}
          </section>
        </div>
      </section>
    </main>
  );
}
