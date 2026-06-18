import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "../api/client";
import type { Product } from "../types";

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  useEffect(() => { if (id) api.get<Product>(`/products/${id}`).then((response) => setProduct(response.data)); }, [id]);
  if (!product) return <p>Loading product...</p>;
  return <section className="details-layout"><img src={product.imageUrl} alt={product.name} /><div><p className="eyebrow">{product.category?.name ?? "Menu item"}</p><h1>{product.name}</h1><p>{product.description}</p><strong className="price-large">${product.price.toFixed(2)}</strong><Link to="/menu" className="primary-action">Back to Menu</Link></div></section>;
}
