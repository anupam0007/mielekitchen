"use client";

import { useMemo, useState, useEffect } from "react";
import ProductCard from "@/components/ProductCard";
import ProductModal from "@/components/ProductModal";
import HoneycombPattern from "@/components/HoneycombPattern";
import { CATEGORIES, MENU_ITEMS, type Category, type MenuItem } from "@/lib/mock-data";
import { createClient } from "@/lib/supabase/browser";
import { toMenuItem, type DbProduct } from "@/lib/supabase/public";

const FILTERS: Array<Category | "All"> = ["All", ...CATEGORIES];

export default function MenuPage() {
  const [activeFilter, setActiveFilter] = useState<Category | "All">("All");
  const [activeItem, setActiveItem] = useState<MenuItem | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>(MENU_ITEMS);

  useEffect(() => {
    createClient()
      .from("products")
      .select("*, product_images(*)")
      .eq("status", "active")
      .order("category")
      .order("sort_order")
      .then(({ data }) => {
        const rows = data as DbProduct[] | null;
        if (rows && rows.length > 0) setMenuItems(rows.map(toMenuItem));
      });
  }, []);

  const categoriesToShow = activeFilter === "All" ? CATEGORIES : [activeFilter];

  const eagerIds = useMemo(() => {
    const firstRow = menuItems.filter((item) => categoriesToShow.includes(item.category as Category)).slice(0, 3);
    return new Set(firstRow.map((item) => item.id));
  }, [categoriesToShow, menuItems]);

  return (
    <div className="relative overflow-hidden">
      <section className="relative overflow-hidden bg-gradient-to-b from-honey-light/30 via-cream to-cream">
        <HoneycombPattern className="text-honey/60" opacity={0.14} />
        <div className="relative mx-auto max-w-6xl px-4 pb-10 pt-14 text-center sm:px-6 sm:pt-20 lg:px-8">
          <p className="mb-2 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-honey-dark">
            <span className="h-1.5 w-1.5 rounded-full bg-honey" />
            The full spread
          </p>
          <h1 className="font-display text-4xl font-semibold tracking-tight text-espresso sm:text-5xl">
            Our Menu
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-espresso-light sm:text-base">
            A look at what comes out of our kitchen — every photo is a real bake from Miele.
            This is a showcase menu: tap any dish to chat with us on WhatsApp about flavours,
            sizes and dates.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-wrap items-center justify-center gap-2">
          {FILTERS.map((filter) => {
            const active = activeFilter === filter;
            return (
              <button
                key={filter}
                type="button"
                onClick={() => setActiveFilter(filter)}
                className={`rounded-full border px-4 py-2 font-body text-sm font-medium transition-colors duration-200 ${
                  active
                    ? "border-honey bg-honey text-espresso shadow-warm-sm"
                    : "border-espresso/15 bg-white/50 text-espresso-light hover:border-honey/50 hover:text-espresso"
                }`}
              >
                {filter}
              </button>
            );
          })}
        </div>

        <div className="flex flex-col gap-14">
          {categoriesToShow.map((category) => {
            const items = menuItems.filter((item) => item.category === category);
            if (items.length === 0) return null;

            return (
              <div key={category}>
                <div className="mb-5 flex items-center gap-3">
                  <h2 className="font-display text-2xl font-semibold tracking-tight text-espresso sm:text-3xl">
                    {category}
                  </h2>
                  <span className="h-px flex-1 bg-honey/20" />
                  <span className="font-body text-xs font-medium uppercase tracking-wide text-espresso-soft">
                    {items.length} {items.length === 1 ? "bake" : "bakes"}
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {items.map((item, i) => (
                    <ProductCard
                      key={item.id}
                      item={item}
                      onOpen={setActiveItem}
                      priority={eagerIds.has(item.id)}
                      className="animate-fade-up"
                      style={{ animationDelay: `${i * 70}ms` }}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <ProductModal item={activeItem} onClose={() => setActiveItem(null)} />
    </div>
  );
}
