"use client";

import { useState } from "react";

type SeedResult = {
  productsSeeded: number;
  cakesSeeded: number;
  bentoSeeded: number;
  log: string[];
};

export default function SeedPage() {
  const [status, setStatus] = useState<"idle" | "running" | "done" | "error">("idle");
  const [result, setResult] = useState<SeedResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function runSeed() {
    setStatus("running");
    setResult(null);
    setErrorMsg(null);
    try {
      const res = await fetch("/api/seed", { method: "POST" });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setErrorMsg(body.error ?? `HTTP ${res.status}`);
        setStatus("error");
        return;
      }
      const data: SeedResult = await res.json();
      setResult(data);
      setStatus("done");
    } catch (e) {
      setErrorMsg(e instanceof Error ? e.message : String(e));
      setStatus("error");
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-8 py-10">
      <div className="mb-8">
        <h1 className="font-serif text-3xl text-[#2d1b0e]">Seed Database</h1>
        <p className="mt-2 text-sm leading-relaxed text-[#9a7c5c]">
          Populates the Supabase database with your existing menu items and customizable cake gallery
          by uploading all local images to Supabase Storage and inserting the corresponding records.
        </p>
        <p className="mt-1 text-xs text-[#b8a090]">
          Already-seeded tables are skipped automatically — safe to run multiple times.
        </p>
      </div>

      <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5">
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-[#9a7c5c]">
          What this does
        </h2>
        <ul className="mb-6 space-y-1.5 text-sm text-[#5c4030]">
          <li className="flex items-start gap-2">
            <span className="mt-0.5 text-[#c8873a]">→</span>
            Inserts all {12} menu dishes into <code className="rounded bg-[#faf8f5] px-1 text-xs">products</code>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-0.5 text-[#c8873a]">→</span>
            Uploads each dish photo to Supabase Storage, stores the URL in <code className="rounded bg-[#faf8f5] px-1 text-xs">product_images</code>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-0.5 text-[#c8873a]">→</span>
            Creates 17 cake slots + 12 bento slots in <code className="rounded bg-[#faf8f5] px-1 text-xs">customizable_items</code>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-0.5 text-[#c8873a]">→</span>
            Uploads every customizable gallery image to Supabase Storage
          </li>
        </ul>

        <button
          onClick={runSeed}
          disabled={status === "running"}
          className="rounded-lg bg-[#c8873a] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[#b07530] disabled:opacity-60"
        >
          {status === "running" ? "Seeding… (this may take a minute)" : "Run seed"}
        </button>
      </div>

      {status === "running" && (
        <div className="mt-6 flex items-center gap-3 text-sm text-[#9a7c5c]">
          <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-[#c8873a] border-t-transparent" />
          Uploading images and writing to database…
        </div>
      )}

      {status === "error" && (
        <div className="mt-6 rounded-xl bg-red-50 px-5 py-4 text-sm text-red-600">
          <p className="font-semibold">Seed failed</p>
          <p className="mt-1">{errorMsg}</p>
        </div>
      )}

      {status === "done" && result && (
        <div className="mt-6 space-y-4">
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Menu dishes", value: result.productsSeeded },
              { label: "Cake slots", value: result.cakesSeeded },
              { label: "Bento slots", value: result.bentoSeeded },
            ].map(({ label, value }) => (
              <div key={label} className="rounded-xl bg-white p-4 text-center shadow-sm ring-1 ring-black/5">
                <p className="font-serif text-2xl text-[#c8873a]">{value}</p>
                <p className="mt-0.5 text-xs text-[#9a7c5c]">{label}</p>
              </div>
            ))}
          </div>

          <div className="rounded-xl bg-[#faf8f5] p-4">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[#9a7c5c]">Log</p>
            <pre className="max-h-72 overflow-y-auto text-xs leading-relaxed text-[#5c4030] whitespace-pre-wrap">
              {result.log.join("\n")}
            </pre>
          </div>

          <p className="text-sm text-green-700">
            ✓ Done. The public site will now show this data from Supabase.
          </p>
        </div>
      )}
    </div>
  );
}
