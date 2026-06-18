import { Link } from "react-router-dom";
import type { Product } from "../types";

export default function ProductCard({ product, onAdd }: { product: Product; onAdd?: (product: Product) => void }) {
  return <article className="product-card"><img src={product.imageUrl} alt={product.name} /><div className="product-card-body"><div><h3>{product.name}</h3><p>{product.description}</p></div><div className="product-actions"><strong>${product.price.toFixed(2)}</strong><Link to={`/products/${product.id}`} className="text-link">Details</Link>{onAdd && <button onClick={() => onAdd(product)}>Add</button>}</div></div></article>;
}
