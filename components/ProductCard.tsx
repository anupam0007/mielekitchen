"use client";

import { type MenuItem } from "@/lib/mock-data";
import DishImage from "@/components/DishImage";

interface ProductCardProps {
  item: MenuItem;
  onOpen: (item: MenuItem) => void;
  priority?: boolean;
  style?: React.CSSProperties;
  className?: string;
}

export default function ProductCard({ item, onOpen, priority = false, style, className = "" }: ProductCardProps) {
  return (
    <button
      type="button"
      onClick={() => onOpen(item)}
      style={style}
      className={`group flex flex-col overflow-hidden rounded-3xl border border-honey/15 bg-white/55 text-left shadow-warm-sm transition-all duration-300 ease-out hover:-translate-y-1.5 hover:border-honey/40 hover:shadow-warm focus-visible:-translate-y-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-honey ${className}`}
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <div className="h-full w-full transition-transform duration-500 ease-out group-hover:scale-[1.06]">
          <DishImage src={item.image} name={item.name} gradient={item.gradient} priority={priority} />
        </div>
        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          <span className="rounded-full bg-forest/85 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-cream backdrop-blur-sm">
            {item.category}
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4 sm:p-5">
        <h3 className="font-display text-lg font-semibold leading-snug text-espresso">{item.name}</h3>
        <p className="line-clamp-2 text-sm text-espresso-light">{item.description}</p>
        <span className="mt-auto inline-flex items-center gap-1.5 pt-2 font-display text-sm font-semibold text-honey-dark transition-colors group-hover:text-espresso">
          View &amp; enquire
          <svg viewBox="0 0 24 24" className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </div>
    </button>
  );
}
