import { useEffect, useMemo, useState } from "react";
import CategoryList from "../components/CategoryList";
import ProductCard from "../components/ProductCard";
import { api } from "../api/client";
import type { CartLine, Category, Product } from "../types";

export default function Menu() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [cartNotice, setCartNotice] = useState("");

  useEffect(() => {
    const tableId = new URLSearchParams(window.location.search).get("tableId");
    if (tableId) localStorage.setItem("smartmenuai_table_id", tableId);
    Promise.all([api.get<Product[]>("/products"), api.get<Category[]>("/categories")]).then(([productResponse, categoryResponse]) => { setProducts(productResponse.data); setCategories(categoryResponse.data); });
  }, []);

  const filteredProducts = useMemo(() => activeCategory === "all" ? products : products.filter((product) => product.categoryId === activeCategory), [activeCategory, products]);

  function addToCart(product: Product) {
    const cart = JSON.parse(localStorage.getItem("smartmenuai_cart") ?? "[]") as CartLine[];
    const existing = cart.find((line) => line.product.id === product.id);
    const nextCart = existing ? cart.map((line) => line.product.id === product.id ? { ...line, quantity: line.quantity + 1 } : line) : [...cart, { product, quantity: 1 }];
    localStorage.setItem("smartmenuai_cart", JSON.stringify(nextCart));
    setCartNotice(`${product.name} added to cart`);
  }

  const recommendation = products.find((product) => product.available && product.category?.name.toLowerCase().includes("drink")) ?? products[0];

  return <section><div className="section-heading"><div><p className="eyebrow">Guest menu</p><h1>Menu</h1></div>{recommendation && <p className="recommendation">AI pick: {recommendation.name}</p>}</div><CategoryList categories={categories} activeId={activeCategory} onSelect={setActiveCategory} />{cartNotice && <p className="notice">{cartNotice}</p>}<div className="product-grid">{filteredProducts.map((product) => <ProductCard key={product.id} product={product} onAdd={addToCart} />)}</div></section>;
}
