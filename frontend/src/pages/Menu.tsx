import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import AiRecommendationWidget from "../components/AiRecommendationWidget";
import CategoryList from "../components/CategoryList";
import ProductCard from "../components/ProductCard";
import { api } from "../api/client";
import type { CartLine, Category, Product } from "../types";
import { readGuestCart, saveGuestCart } from "../utils/guestStorage";

type RestaurantTable = { id: string; number: number };

const categoryLabels: Record<string, string> = {
  Breakfast: "Raňajky",
  Lunch: "Obed",
  Drinks: "Nápoje"
};

const cafeCategoryOrder = ["Káva", "Čaje", "Nealkoholické nápoje", "Nealkoholické miešané nápoje", "Pivo", "Víno", "Miešané nápoje", "Dezerty"];

function localizeCategories(categories: Category[]) {
  return categories
    .map((category) => ({ ...category, name: categoryLabels[category.name] ?? category.name }))
    .sort((a, b) => {
      const orderA = cafeCategoryOrder.indexOf(a.name);
      const orderB = cafeCategoryOrder.indexOf(b.name);
      if (orderA !== -1 || orderB !== -1) return (orderA === -1 ? 999 : orderA) - (orderB === -1 ? 999 : orderB);
      return a.name.localeCompare(b.name, "sk");
    });
}

export default function Menu() {
  const location = useLocation();
  const isAdminPreview = new URLSearchParams(location.search).get("preview") === "admin";
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [cartNotice, setCartNotice] = useState("");

  useEffect(() => {
    const tableId = new URLSearchParams(window.location.search).get("tableId");
    if (tableId) {
      localStorage.setItem("smartmenuai_table_id", tableId);
      api.get<RestaurantTable>(`/tables/${tableId}`).then((response) => {
        localStorage.setItem("smartmenuai_table_number", String(response.data.number));
        window.dispatchEvent(new Event("smartmenuai-table-updated"));
      });
    }
    Promise.all([api.get<Product[]>("/products"), api.get<Category[]>("/categories")]).then(([productResponse, categoryResponse]) => {
      setProducts(productResponse.data);
      setCategories(categoryResponse.data);
    });
  }, []);

  const localizedCategories = useMemo(() => {
    const categoryIdsWithProducts = new Set(products.map((product) => product.categoryId));
    return localizeCategories(categories.filter((category) => categoryIdsWithProducts.has(category.id)));
  }, [categories, products]);
  const filteredProducts = useMemo(() => activeCategory === "all" ? products : products.filter((product) => product.categoryId === activeCategory), [activeCategory, products]);
  const recommendation = products.find((product) => product.available && product.category?.name.toLowerCase().includes("drink")) ?? products[0];
  const activeCategoryName = localizedCategories.find((category) => category.id === activeCategory)?.name ?? "Menu";

  useEffect(() => {
    if (activeCategory === "all" && localizedCategories.length > 0) setActiveCategory(localizedCategories[0].id);
  }, [activeCategory, localizedCategories]);

  function addToCart(product: Product) {
    const cart = readGuestCart() as CartLine[];
    const existing = cart.find((line) => line.product.id === product.id);
    const nextCart = existing ? cart.map((line) => line.product.id === product.id ? { ...line, quantity: line.quantity + 1 } : line) : [...cart, { product, quantity: 1 }];
    saveGuestCart(nextCart);
    setCartNotice(`${product.name} je v košíku`);
    window.setTimeout(() => setCartNotice(""), 2600);
  }

  return (
    <section className={isAdminPreview ? "menu-page admin-preview-mode" : "menu-page"}>
      {isAdminPreview && (
        <div className="admin-preview-bar">
          <div>
            <strong>Admin náhľad menu</strong>
            <span>Takto zákazník vidí ponuku po naskenovaní QR kódu.</span>
          </div>
          <Link to="/admin/dashboard" className="admin-preview-link">Späť do adminu</Link>
        </div>
      )}

      <div className="section-heading menu-heading">
        <div>
          <p className="eyebrow">Aktuálne menu</p>
          <h1>{activeCategoryName}</h1>
        </div>
        <p className="recommendation">Objednávka priamo od stola</p>
      </div>

      <div className="sticky-category-bar">
        <CategoryList categories={localizedCategories} activeId={activeCategory} onSelect={setActiveCategory} />
      </div>

      {cartNotice && (
        <div className="add-toast" role="status">
          <strong>Pridané do košíka</strong>
          <span>{cartNotice}</span>
        </div>
      )}

      <div className="product-grid">
        {filteredProducts.map((product) => <ProductCard key={product.id} product={product} onAdd={addToCart} />)}
      </div>

      <AiRecommendationWidget product={recommendation} onAdd={addToCart} />
    </section>
  );
}
