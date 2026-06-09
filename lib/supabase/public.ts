// Shared adapter for converting Supabase DB rows to the MenuItem/Slot shapes
// used by the existing public-facing components (ProductCard, etc.)

import { type MenuItem, type Category } from "@/lib/mock-data";

const CATEGORY_GRADIENTS: Record<string, [string, string]> = {
  Cheesecakes: ["#f2dfb8", "#c1893f"],
  Tarts: ["#f8e9e4", "#e8b7ac"],
  "Brownies & Bars": ["#ddd0c0", "#5a4332"],
  Cookies: ["#f3e6cf", "#c9a24a"],
  Cupcakes: ["#e7ddd0", "#6b4a35"],
};

export type DbProductImage = {
  id: string;
  url: string;
  is_cover: boolean;
  sort_order: number;
};

export type DbProduct = {
  id: string;
  name: string;
  description: string;
  category: string;
  status: "active" | "draft";
  featured: boolean;
  sort_order: number;
  product_images: DbProductImage[];
};

export function toMenuItem(p: DbProduct): MenuItem {
  const cover =
    p.product_images?.find((i) => i.is_cover) ?? p.product_images?.[0];
  const slug = p.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return {
    id: p.id,
    slug,
    name: p.name,
    category: p.category as Category,
    description: p.description,
    image: cover?.url ?? `/menu/${slug}.jpg`,
    gradient: CATEGORY_GRADIENTS[p.category] ?? ["#e9d9c3", "#7a5a42"],
    featured: p.featured,
  };
}

export type CusDbItem = {
  id: string;
  gallery: "cakes" | "bento";
  code: string;
  sort_order: number;
  customizable_images: { id: string; url: string; sort_order: number }[];
};

export type CusSlot = { src: string; code: string };

export function toSlot(item: CusDbItem, indexInGallery: number): CusSlot {
  const img = item.customizable_images?.[0];
  if (img?.url) return { src: img.url, code: item.code };
  // fall back to local file (triggers onError → placeholder if file missing)
  const pad = String(indexInGallery + 1).padStart(2, "0");
  const fallback =
    item.gallery === "cakes"
      ? `/customizable/cakes/cake-${pad}.jpg`
      : `/customizable/bento/bento-${pad}.jpg`;
  return { src: fallback, code: item.code };
}
