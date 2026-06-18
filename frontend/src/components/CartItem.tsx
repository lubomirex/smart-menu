import type { CartLine } from "../types";

export default function CartItem({ line, onQuantityChange, onRemove }: { line: CartLine; onQuantityChange: (quantity: number) => void; onRemove: () => void }) {
  return <div className="cart-item"><img src={line.product.imageUrl} alt={line.product.name} /><div><h3>{line.product.name}</h3><p>${line.product.price.toFixed(2)} each</p></div><input aria-label={`Quantity for ${line.product.name}`} type="number" min="1" value={line.quantity} onChange={(event) => onQuantityChange(Math.max(1, Number(event.target.value)))} /><strong>${(line.product.price * line.quantity).toFixed(2)}</strong><button onClick={onRemove}>Remove</button></div>;
}
