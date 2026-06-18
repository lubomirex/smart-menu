import type { Product } from "../types";

export default function AiRecommendationWidget({ product, onAdd }: { product?: Product; onAdd: (product: Product) => void }) {
  if (!product) return null;

  return (
    <aside className="ai-widget" aria-label="AI odporúčanie">
      <span className="ai-widget-label">AI odporúčanie</span>
      <strong>{product.name}</strong>
      <p>Dobrá voľba k aktuálnemu menu. Hodí sa k najčastejším objednávkam hostí.</p>
      <button onClick={() => onAdd(product)}>Pridať</button>
    </aside>
  );
}
