"use client";

import { useState } from "react";
import { Heart, Plus, Check } from "lucide-react";
import type { Product } from "@/lib/types";
import { useMarketplace } from "@/components/app-provider";
import { formatPrice } from "@/lib/format";

export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const { addToCart } = useMarketplace();
  const [liked, setLiked] = useState(false);
  const [added, setAdded] = useState(false);
  const handleAdd = () => {
    addToCart(product.id);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1250);
  };

  return (
    <article className="group min-w-0 animate-enter overflow-hidden rounded-[14px] border border-[#dbe4f0] bg-[#fffdf5] p-2 shadow-sm transition-shadow hover:shadow-md" style={{ animationDelay: `${Math.min(index, 7) * 55}ms` }}>
      <div className="relative aspect-[4/4.5] overflow-hidden rounded-[10px] bg-[#e0f2fe]">
        <img src={product.image} alt={product.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.035]" />
        <span className="absolute left-3 top-3 rounded-full bg-[#fffdf5]/90 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[.12em] text-[#1e293b] backdrop-blur-sm">
          {product.condition}
        </span>
        <button
          aria-label={liked ? `Unlike ${product.title}` : `Like ${product.title}`}
          onClick={() => setLiked((current) => !current)}
          className={`absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full border transition ${liked ? "border-[#ff6b6b] bg-[#ff6b6b] text-white" : "border-white/70 bg-[#fffdf5]/90 text-[#1e293b] hover:bg-white"}`}
        >
          <Heart size={16} fill={liked ? "currentColor" : "none"} strokeWidth={1.8} />
        </button>
        {product.negotiable && <span className="absolute bottom-3 left-3 rounded-full bg-[#ff6b6b] px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[.11em] text-white">Open to offers</span>}
        <button onClick={handleAdd} aria-label={`Add ${product.title} to cart`} className={`absolute bottom-3 right-3 grid h-10 w-10 place-items-center rounded-full text-white shadow-sm transition-all ${added ? "bg-[#1e40af]" : "bg-[#ff6b6b] hover:bg-[#f25757]"}`}>
          {added ? <Check size={18} /> : <Plus size={19} />}
        </button>
      </div>
      <div className="flex items-start justify-between gap-2 px-1 pb-1 pt-3">
        <div className="min-w-0">
          <h3 className="truncate text-[14px] font-extrabold tracking-[-.03em]">{product.title}</h3>
          <p className="mt-1 text-[11px] font-medium text-[#64748b]">{product.sellerName} <span className="px-1 text-[#94a3b8]">·</span> {product.location}</p>
        </div>
        <span className="mono shrink-0 pt-0.5 text-[13px] font-medium">{formatPrice(product.price)}</span>
      </div>
    </article>
  );
}
