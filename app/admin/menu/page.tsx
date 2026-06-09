"use client";

import { useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/browser";

const CATEGORIES = ["Cheesecakes", "Tarts", "Brownies & Bars", "Cookies", "Cupcakes"];

type ProductImage = { id: string; url: string; is_cover: boolean; sort_order: number };
type Product = {
  id: string;
  name: string;
  description: string;
  category: string;
  sort_order: number;
  status: "active" | "draft";
  featured: boolean;
  product_images: ProductImage[];
};

type FormState = {
  name: string;
  description: string;
  category: string;
  status: "active" | "draft";
  featured: boolean;
};

const BLANK: FormState = {
  name: "",
  description: "",
  category: "Cheesecakes",
  status: "active",
  featured: false,
};

export default function MenuPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState<string | "new" | null>(null);
  const [form, setForm] = useState<FormState>(BLANK);
  const [existingImages, setExistingImages] = useState<ProductImage[]>([]);
  const [removedIds, setRemovedIds] = useState<string[]>([]);
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  async function load() {
    const { data } = await createClient()
      .from("products")
      .select("*, product_images(*)")
      .order("category")
      .order("sort_order");
    setProducts((data as Product[]) ?? []);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  function openAdd() {
    setEditId("new");
    setForm(BLANK);
    setExistingImages([]);
    setRemovedIds([]);
    setNewFiles([]);
    setError(null);
  }

  function openEdit(p: Product) {
    setEditId(p.id);
    setForm({ name: p.name, description: p.description, category: p.category, status: p.status, featured: p.featured });
    setExistingImages(p.product_images ?? []);
    setRemovedIds([]);
    setNewFiles([]);
    setError(null);
  }

  function close() { setEditId(null); setNewFiles([]); }

  async function save() {
    if (!form.name.trim()) { setError("Name is required"); return; }
    setSaving(true);
    setError(null);
    const supabase = createClient();
    let pid = editId === "new" ? undefined : editId!;

    if (pid) {
      const { error: e } = await supabase.from("products").update({ ...form, updated_at: new Date().toISOString() }).eq("id", pid);
      if (e) { setError(e.message); setSaving(false); return; }
    } else {
      const { data, error: e } = await supabase.from("products").insert({ ...form, sort_order: 0 }).select("id").single();
      if (e || !data) { setError(e?.message ?? "Failed"); setSaving(false); return; }
      pid = data.id;
    }

    for (const id of removedIds) {
      await supabase.from("product_images").delete().eq("id", id);
    }

    const visibleExisting = existingImages.filter((i) => !removedIds.includes(i.id));
    for (let i = 0; i < newFiles.length; i++) {
      const file = newFiles[i];
      const ext = file.name.split(".").pop() ?? "jpg";
      const path = `products/${pid}/${Date.now()}-${i}.${ext}`;
      const { error: ue } = await supabase.storage.from("media").upload(path, file);
      if (ue) { setError(ue.message); setSaving(false); return; }
      const { data: { publicUrl } } = supabase.storage.from("media").getPublicUrl(path);
      await supabase.from("product_images").insert({
        product_id: pid,
        url: publicUrl,
        sort_order: visibleExisting.length + i,
        is_cover: visibleExisting.length === 0 && i === 0,
      });
    }

    await load();
    setSaving(false);
    close();
  }

  async function del(id: string) {
    if (!confirm("Delete this dish?")) return;
    await createClient().from("products").delete().eq("id", id);
    setProducts((p) => p.filter((x) => x.id !== id));
  }

  return (
    <div className="px-8 py-10">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl text-[#2d1b0e]">Menu</h1>
          <p className="mt-1 text-sm text-[#9a7c5c]">Manage dishes on the public menu.</p>
        </div>
        <button
          onClick={openAdd}
          className="rounded-lg bg-[#c8873a] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#b07530]"
        >
          + Add dish
        </button>
      </div>

      {loading ? (
        <div className="text-sm text-[#9a7c5c]">Loading…</div>
      ) : (
        <div className="space-y-8">
          {CATEGORIES.map((cat) => {
            const items = products.filter((p) => p.category === cat);
            return (
              <section key={cat}>
                <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-[#9a7c5c]">
                  {cat} ({items.length})
                </h2>
                {items.length === 0 ? (
                  <p className="rounded-xl bg-white px-4 py-3 text-sm text-[#9a7c5c] ring-1 ring-black/5">
                    No dishes yet — add one above.
                  </p>
                ) : (
                  <div className="divide-y divide-[#f0e5d8] rounded-2xl bg-white shadow-sm ring-1 ring-black/5">
                    {items.map((p) => {
                      const cover = p.product_images?.find((i) => i.is_cover) ?? p.product_images?.[0];
                      return (
                        <div key={p.id} className="flex items-center gap-4 px-4 py-3">
                          <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg bg-[#f5ece0]">
                            {cover ? (
                              <img src={cover.url} alt={p.name} className="h-full w-full object-cover" />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center text-xl">🍰</div>
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="truncate font-medium text-[#2d1b0e]">{p.name}</p>
                            <p className="truncate text-xs text-[#9a7c5c]">{p.description || "—"}</p>
                          </div>
                          <span
                            className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                              p.status === "active" ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"
                            }`}
                          >
                            {p.status}
                          </span>
                          {p.featured && (
                            <span className="rounded-full bg-[#fdf3e8] px-2 py-0.5 text-xs text-[#c8873a]">
                              Featured
                            </span>
                          )}
                          <button onClick={() => openEdit(p)} className="text-sm text-[#c8873a] hover:underline">
                            Edit
                          </button>
                          <button onClick={() => del(p.id)} className="text-sm text-red-400 hover:text-red-600">
                            Delete
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </section>
            );
          })}
        </div>
      )}

      {/* Modal */}
      {editId !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={(e) => { if (e.target === e.currentTarget) close(); }}
        >
          <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-[#f0e5d8] px-6 py-4">
              <h2 className="font-serif text-xl text-[#2d1b0e]">
                {editId === "new" ? "Add dish" : "Edit dish"}
              </h2>
              <button onClick={close} className="text-lg text-[#9a7c5c] hover:text-[#2d1b0e]">✕</button>
            </div>

            <div className="max-h-[65vh] overflow-y-auto px-6 py-5 space-y-4">
              {error && (
                <p className="rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-600">{error}</p>
              )}

              <div>
                <label className="mb-1.5 block text-sm font-medium text-[#2d1b0e]">Name *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  className="w-full rounded-lg border border-[#e8d5c0] bg-[#faf8f5] px-4 py-2.5 text-sm text-[#2d1b0e] outline-none focus:border-[#c8873a] focus:ring-2 focus:ring-[#c8873a]/20"
                  placeholder="e.g. Burnt Basque Cheesecake"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-[#2d1b0e]">Description</label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  placeholder="Short description shown on the menu card"
                  className="w-full resize-none rounded-lg border border-[#e8d5c0] bg-[#faf8f5] px-4 py-2.5 text-sm text-[#2d1b0e] outline-none focus:border-[#c8873a] focus:ring-2 focus:ring-[#c8873a]/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-[#2d1b0e]">Category</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                    className="w-full rounded-lg border border-[#e8d5c0] bg-[#faf8f5] px-4 py-2.5 text-sm text-[#2d1b0e] outline-none focus:border-[#c8873a]"
                  >
                    {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-[#2d1b0e]">Status</label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as "active" | "draft" }))}
                    className="w-full rounded-lg border border-[#e8d5c0] bg-[#faf8f5] px-4 py-2.5 text-sm text-[#2d1b0e] outline-none focus:border-[#c8873a]"
                  >
                    <option value="active">Active</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>
              </div>

              <label className="flex cursor-pointer items-center gap-2 text-sm text-[#2d1b0e]">
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={(e) => setForm((f) => ({ ...f, featured: e.target.checked }))}
                  className="accent-[#c8873a]"
                />
                Featured on homepage
              </label>

              {/* Images */}
              <div>
                <label className="mb-2 block text-sm font-medium text-[#2d1b0e]">Photos</label>
                <div className="flex flex-wrap gap-2">
                  {existingImages
                    .filter((img) => !removedIds.includes(img.id))
                    .map((img) => (
                      <div key={img.id} className="relative h-16 w-16 overflow-hidden rounded-lg">
                        <img src={img.url} alt="" className="h-full w-full object-cover" />
                        <button
                          onClick={() => setRemovedIds((r) => [...r, img.id])}
                          className="absolute right-0.5 top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  {newFiles.map((f, i) => (
                    <div key={i} className="relative h-16 w-16 overflow-hidden rounded-lg bg-[#f5ece0]">
                      <img src={URL.createObjectURL(f)} alt="" className="h-full w-full object-cover" />
                      <button
                        onClick={() => setNewFiles((files) => files.filter((_, idx) => idx !== i))}
                        className="absolute right-0.5 top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    className="flex h-16 w-16 items-center justify-center rounded-lg border-2 border-dashed border-[#e8d5c0] text-2xl text-[#c8b499] transition hover:border-[#c8873a] hover:text-[#c8873a]"
                  >
                    +
                  </button>
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={(e) => {
                      setNewFiles((p) => [...p, ...Array.from(e.target.files ?? [])]);
                      e.target.value = "";
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 border-t border-[#f0e5d8] px-6 py-4">
              <button
                onClick={close}
                className="rounded-lg border border-[#e8d5c0] px-4 py-2 text-sm text-[#5c4030] hover:bg-[#faf8f5]"
              >
                Cancel
              </button>
              <button
                onClick={save}
                disabled={saving}
                className="rounded-lg bg-[#c8873a] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#b07530] disabled:opacity-60"
              >
                {saving ? "Saving…" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
