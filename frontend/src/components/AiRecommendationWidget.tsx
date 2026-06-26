import { useState } from "react";
import { Sparkles, X } from "lucide-react";
import type { Product } from "../types";

export default function AiRecommendationWidget({
  product,
  onAdd
}: {
  product?: Product;
  onAdd: (product: Product) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);

  if (!product) return null;

  return (
    <div className="ai-widget-container">
      {isOpen && (
        <div className="ai-widget-popover">
          <button 
            className="ai-widget-close" 
            onClick={() => setIsOpen(false)} 
            title="Close recommendation"
            aria-label="Close recommendation"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="ai-widget-content">
            <div className="ai-widget-title-badge">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI recommendation</span>
            </div>
            <h3>{product.name}</h3>
            <p>Good choice to complete your order. Fits well with popular orders.</p>
            <button 
              className="ai-widget-add-btn" 
              onClick={() => {
                onAdd(product);
                setIsOpen(false);
              }}
            >
              Add for ${product.price.toFixed(2)}
            </button>
          </div>
        </div>
      )}
      
      <button 
        className="ai-widget-trigger-btn"
        onClick={() => setIsOpen(!isOpen)}
        title="AI Recommendation"
        aria-label="Toggle AI Recommendation"
      >
        <Sparkles className="w-6 h-6" />
      </button>
    </div>
  );
}
