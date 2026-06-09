"use client";

import { useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/browser";

type CusImage = { id: string; url: string; sort_order: number };
type CusItem = {
  id: string;
  gallery: "cakes" | "bento";
  code: string;
  sort_order: number;
  customizable_images: CusImage[];
};

type SectionProps = {
  title: string;
  gallery: "cakes" | "bento";
  items: CusItem[];
  uploading: string | null;
  fileRefs: React.MutableRefObject<Record<string, HTMLInputElement | null>>;
  onAdd: (gallery: "cakes" | "bento") => void;
  onUpload: (item: CusItem, file: File) => void;
  onDelete: (id: string) => void;
};

function GallerySection({ title, gallery, items, uploading, fileRefs, onAdd, onUpload, onDelete }: SectionProps) {
  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-[#9a7c5c]">
          {title} — {items.length} slots
        </h2>
        <button
          onClick={() => onAdd(gallery)}
          className="rounded-lg border border-[#e8d5c0] px-3 py-1.5 text-xs text-[#5c4030] transition hover:bg-[#faf8f5] hover:border-[#c8873a]"
        >
          + Add slot
        </button>
      </div>

      {items.length === 0 ? (
        <p className="rounded-xl bg-white px-4 py-3 text-sm text-[#9a7c5c] ring-1 ring-black/5">
          No slots yet — add one above.
        </p>
      ) : (
        <div className="grid grid-cols-4 gap-3 sm:grid-cols-6 md:grid-cols-8">
          {items.map((item) => {
            const img = item.customizable_images?.[0];
            const isUploading = uploading === item.id;
            return (
              <div
                key={item.id}
                className="group relative aspect-square overflow-hidden rounded-xl bg-[#f5ece0]"
              >
                {img ? (
                  <img src={img.url} alt={item.code} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full flex-col items-center justify-center gap-1 text-[#c8b499]">
                    <span className="text-2xl">🐝</span>
                    <span className="text-[10px]">{item.code}</span>
                  </div>
                )}

                {/* Hover overlay */}
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 bg-black/55 opacity-0 transition group-hover:opacity-100">
                  <span className="text-xs font-bold text-white">{item.code}</span>
                  <button
                    onClick={() => fileRefs.current[item.id]?.click()}
                    disabled={isUploading}
                    className="rounded-full bg-white px-2.5 py-0.5 text-xs font-medium text-[#2d1b0e] transition hover:bg-[#fdf3e8]"
                  >
                    {isUploading ? "…" : "Upload"}
                  </button>
                  <button
                    onClick={() => onDelete(item.id)}
                    className="rounded-full bg-red-500 px-2.5 py-0.5 text-xs font-medium text-white transition hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>

                <input
                  ref={(el) => { fileRefs.current[item.id] = el; }}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) onUpload(item, f);
                    e.target.value = "";
                  }}
                />
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

export default function CustomizablePage() {
  const [items, setItems] = useState<CusItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState<string | null>(null);
  const fileRefs = useRef<Record<string, HTMLInputElement | null>>({});

  async function load() {
    const { data } = await createClient()
      .from("customizable_items")
      .select("*, customizable_images(*)")
      .order("gallery")
      .order("sort_order");
    setItems((data as CusItem[]) ?? []);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function addSlot(gallery: "cakes" | "bento") {
    const existing = items.filter((i) => i.gallery === gallery);
    const prefix = gallery === "cakes" ? "C" : "B";
    const code = `${prefix}${existing.length + 1}`;
    const { error } = await createClient()
      .from("customizable_items")
      .insert({ gallery, code, sort_order: existing.length });
    if (!error) load();
  }

  async function uploadImage(item: CusItem, file: File) {
    setUploading(item.id);
    const supabase = createClient();
    const ext = file.name.split(".").pop() ?? "jpg";
    const path = `customizable/${item.gallery}/${item.code}-${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("media").upload(path, file);
    if (!error) {
      const { data: { publicUrl } } = supabase.storage.from("media").getPublicUrl(path);
      if (item.customizable_images?.length > 0) {
        await supabase.from("customizable_images").delete().eq("item_id", item.id);
      }
      await supabase.from("customizable_images").insert({ item_id: item.id, url: publicUrl, sort_order: 0 });
      await load();
    }
    setUploading(null);
  }

  async function deleteSlot(id: string) {
    if (!confirm("Delete this design slot?")) return;
    await createClient().from("customizable_items").delete().eq("id", id);
    setItems((prev) => prev.filter((i) => i.id !== id));
  }

  const cakes = items.filter((i) => i.gallery === "cakes");
  const bento = items.filter((i) => i.gallery === "bento");

  return (
    <div className="px-8 py-10">
      <div className="mb-8">
        <h1 className="font-serif text-3xl text-[#2d1b0e]">Customizable Cakes</h1>
        <p className="mt-1 text-sm text-[#9a7c5c]">
          Hover a tile to upload an image or delete a slot. Add new slots with the button above each grid.
        </p>
      </div>

      {loading ? (
        <div className="text-sm text-[#9a7c5c]">Loading…</div>
      ) : (
        <div className="space-y-10">
          <GallerySection
            title="Custom Cakes"
            gallery="cakes"
            items={cakes}
            uploading={uploading}
            fileRefs={fileRefs}
            onAdd={addSlot}
            onUpload={uploadImage}
            onDelete={deleteSlot}
          />
          <GallerySection
            title="Bento Cakes"
            gallery="bento"
            items={bento}
            uploading={uploading}
            fileRefs={fileRefs}
            onAdd={addSlot}
            onUpload={uploadImage}
            onDelete={deleteSlot}
          />
        </div>
      )}
    </div>
  );
}
