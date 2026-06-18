import { FormEvent, useEffect, useState } from "react";
import { api } from "../api/client";
import type { Category, Product } from "../types";

export default function ProductManagement() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState({ name: "", description: "", price: "", imageUrl: "", categoryId: "" });
  async function loadData() { const [productResponse, categoryResponse] = await Promise.all([api.get<Product[]>("/products"), api.get<Category[]>("/categories")]); setProducts(productResponse.data); setCategories(categoryResponse.data); setForm((current) => ({ ...current, categoryId: current.categoryId || categoryResponse.data[0]?.id || "" })); }
  useEffect(() => { loadData(); }, []);
  async function submit(event: FormEvent) { event.preventDefault(); await api.post("/products", { ...form, price: Number(form.price), available: true }); setForm({ name: "", description: "", price: "", imageUrl: "", categoryId: categories[0]?.id || "" }); loadData(); }
  async function remove(id: string) { await api.delete(`/products/${id}`); loadData(); }
  return <section><div className="section-heading"><h1>Product Management</h1></div><form className="management-form" onSubmit={submit}><input placeholder="Name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required /><input placeholder="Description" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} required /><input placeholder="Price" type="number" step="0.01" value={form.price} onChange={(event) => setForm({ ...form, price: event.target.value })} required /><input placeholder="Image URL" value={form.imageUrl} onChange={(event) => setForm({ ...form, imageUrl: event.target.value })} required /><select value={form.categoryId} onChange={(event) => setForm({ ...form, categoryId: event.target.value })} required>{categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</select><button>Add Product</button></form><div className="management-list">{products.map((product) => <div key={product.id}><span>{product.name}</span><strong>${product.price.toFixed(2)}</strong><button onClick={() => remove(product.id)}>Delete</button></div>)}</div></section>;
}
