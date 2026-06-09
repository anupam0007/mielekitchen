"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/browser";

const GROUPS = [
  {
    title: "Hero",
    fields: [
      { key: "hero_eyebrow", label: "Eyebrow text" },
      { key: "hero_title", label: "Site name" },
      { key: "hero_tagline", label: "Tagline" },
      { key: "hero_description", label: "Description", long: true },
    ],
  },
  {
    title: "Stats row",
    fields: [
      { key: "stat_bakes_count", label: "Bakes — count" },
      { key: "stat_bakes_label", label: "Bakes — label" },
      { key: "stat_categories_count", label: "Categories — count" },
      { key: "stat_categories_label", label: "Categories — label" },
      { key: "stat_handfinished_count", label: "Hand-finished — count" },
      { key: "stat_handfinished_label", label: "Hand-finished — label" },
    ],
  },
  {
    title: "Kitchen section",
    fields: [
      { key: "kitchen_section_heading", label: "Heading" },
      { key: "kitchen_section_subtext", label: "Subtext", long: true },
    ],
  },
  {
    title: "CTA section",
    fields: [
      { key: "cta_section_heading", label: "Heading" },
      { key: "cta_section_body", label: "Body", long: true },
    ],
  },
  {
    title: "Customizable intro",
    fields: [{ key: "customizable_intro", label: "Intro text", long: true }],
  },
  {
    title: "Footer",
    fields: [
      { key: "footer_tagline", label: "Tagline", long: true },
      { key: "footer_address", label: "Address" },
      { key: "footer_phone", label: "Phone" },
      { key: "footer_email", label: "Email" },
      { key: "footer_instagram", label: "Instagram handle" },
    ],
  },
];

type Field = { key: string; label: string; long?: boolean };

export default function SiteTextPage() {
  const [content, setContent] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ ok: boolean; msg: string } | null>(null);

  useEffect(() => {
    createClient()
      .from("site_content")
      .select("key, value")
      .then(({ data, error }) => {
        if (data) {
          const map: Record<string, string> = {};
          data.forEach(({ key, value }) => (map[key] = value));
          setContent(map);
        }
        if (error) setToast({ ok: false, msg: error.message });
        setLoading(false);
      });
  }, []);

  async function saveAll() {
    setSaving(true);
    const rows = Object.entries(content).map(([key, value]) => ({
      key,
      value,
      updated_at: new Date().toISOString(),
    }));
    const { error } = await createClient()
      .from("site_content")
      .upsert(rows, { onConflict: "key" });
    setSaving(false);
    setToast(error ? { ok: false, msg: error.message } : { ok: true, msg: "Saved!" });
    setTimeout(() => setToast(null), 3500);
  }

  function Field({ key, label, long }: Field) {
    const cls =
      "w-full rounded-lg border border-[#e8d5c0] bg-[#faf8f5] px-4 py-2.5 text-sm text-[#2d1b0e] outline-none focus:border-[#c8873a] focus:ring-2 focus:ring-[#c8873a]/20";
    return (
      <div>
        <label className="mb-1.5 block text-sm font-medium text-[#2d1b0e]">{label}</label>
        {long ? (
          <textarea
            rows={3}
            value={content[key] ?? ""}
            onChange={(e) => setContent((p) => ({ ...p, [key]: e.target.value }))}
            className={`${cls} resize-y`}
          />
        ) : (
          <input
            type="text"
            value={content[key] ?? ""}
            onChange={(e) => setContent((p) => ({ ...p, [key]: e.target.value }))}
            className={cls}
          />
        )}
      </div>
    );
  }

  if (loading) {
    return <div className="flex h-40 items-center justify-center text-sm text-[#9a7c5c]">Loading…</div>;
  }

  return (
    <div className="mx-auto max-w-2xl px-8 py-10">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl text-[#2d1b0e]">Site Text</h1>
          <p className="mt-1 text-sm text-[#9a7c5c]">Edit the copy shown on the public site.</p>
        </div>
        <button
          onClick={saveAll}
          disabled={saving}
          className="rounded-lg bg-[#c8873a] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#b07530] disabled:opacity-60"
        >
          {saving ? "Saving…" : "Save all"}
        </button>
      </div>

      {toast && (
        <div
          className={`mb-6 rounded-lg px-4 py-2.5 text-sm ${
            toast.ok ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"
          }`}
        >
          {toast.msg}
        </div>
      )}

      <div className="space-y-8">
        {GROUPS.map((group) => (
          <section key={group.title}>
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-[#9a7c5c]">
              {group.title}
            </h2>
            <div className="space-y-4 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5">
              {group.fields.map((f) => (
                <Field key={f.key} {...f} />
              ))}
            </div>
          </section>
        ))}
      </div>

      <div className="mt-8 flex justify-end">
        <button
          onClick={saveAll}
          disabled={saving}
          className="rounded-lg bg-[#c8873a] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#b07530] disabled:opacity-60"
        >
          {saving ? "Saving…" : "Save all"}
        </button>
      </div>
    </div>
  );
}
