"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import HoneycombPattern from "@/components/HoneycombPattern";
import { whatsappLink } from "@/lib/whatsapp";
import { createClient } from "@/lib/supabase/browser";
import { toSlot, type CusDbItem, type CusSlot as Slot } from "@/lib/supabase/public";

const DEFAULT_CAKE_SLOTS: Slot[] = Array.from({ length: 17 }, (_, i) => ({
  src: `/customizable/cakes/cake-${String(i + 1).padStart(2, "0")}.jpg`,
  code: `C${i + 1}`,
}));

const DEFAULT_BENTO_SLOTS: Slot[] = Array.from({ length: 12 }, (_, i) => ({
  src: `/customizable/bento/bento-${String(i + 1).padStart(2, "0")}.jpg`,
  code: `B${i + 1}`,
}));

function PlaceholderTile() {
  return (
    <div className="aspect-square w-full select-none rounded-2xl border border-honey/20 bg-gradient-to-br from-honey-light/40 via-cream to-honey/10 flex flex-col items-center justify-center gap-2">
      <span className="text-3xl opacity-35" aria-hidden="true">🐝</span>
      <span className="px-3 text-center text-xs font-medium leading-snug text-espresso-light/50">
        Design<br />coming soon
      </span>
    </div>
  );
}

function GalleryTile({ slot, onOpen }: { slot: Slot; onOpen: (s: Slot) => void }) {
  const [missing, setMissing] = useState(false);

  if (missing) return <PlaceholderTile />;

  return (
    <button
      type="button"
      onClick={() => onOpen(slot)}
      className="group relative aspect-square w-full overflow-hidden rounded-2xl shadow-warm-sm transition-shadow hover:shadow-warm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-honey"
      aria-label={`View design ${slot.code}`}
    >
      <Image
        src={slot.src}
        alt={`Customizable cake design ${slot.code}`}
        fill
        sizes="(min-width: 1024px) 22vw, (min-width: 640px) 33vw, 50vw"
        className="object-cover transition-transform duration-500 group-hover:scale-105"
        onError={() => setMissing(true)}
      />
    </button>
  );
}

function Lightbox({ slot, onClose }: { slot: Slot | null; onClose: () => void }) {
  const close = useCallback(() => onClose(), [onClose]);

  useEffect(() => {
    if (!slot) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") close(); };
    document.addEventListener("keydown", handler);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handler);
      document.body.style.overflow = prev;
    };
  }, [slot, close]);

  if (!slot) return null;

  const link = whatsappLink(
    `Hi Miele! I'd love to order this customizable cake — design ${slot.code}. I'll attach the photo here.`
  );

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Design ${slot.code}`}
      className="fixed inset-0 z-50 flex items-center justify-center bg-espresso/80 p-4 backdrop-blur-sm"
      onClick={close}
    >
      <div
        className="relative w-full max-w-md overflow-hidden rounded-2xl bg-cream shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={close}
          aria-label="Close"
          className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-espresso/70 text-lg leading-none text-cream transition-colors hover:bg-espresso"
        >
          ✕
        </button>

        <div className="relative aspect-square w-full">
          <Image
            src={slot.src}
            alt={`Customizable cake design ${slot.code}`}
            fill
            sizes="448px"
            className="object-cover"
            priority
          />
        </div>

        <div className="flex flex-col items-center gap-3 px-6 py-5">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-espresso-light">
            Design {slot.code}
          </p>
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-honey px-6 py-3 font-display text-sm font-semibold text-espresso shadow-warm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-warm-lg"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
              <path d="M12.04 2c-5.5 0-9.96 4.46-9.96 9.96 0 1.76.46 3.45 1.33 4.95L2 22l5.25-1.38a9.93 9.93 0 0 0 4.79 1.22h.01c5.5 0 9.96-4.46 9.96-9.96S17.54 2 12.04 2Zm0 18.13a8.2 8.2 0 0 1-4.18-1.14l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.34c0-4.54 3.7-8.23 8.24-8.23 4.54 0 8.23 3.7 8.23 8.24a8.23 8.23 0 0 1-8.24 8.18Zm4.51-6.16c-.25-.12-1.46-.72-1.69-.8-.23-.08-.39-.12-.56.12-.16.25-.64.8-.78.96-.14.16-.29.18-.54.06-.25-.12-1.04-.38-1.98-1.22-.73-.65-1.23-1.46-1.37-1.7-.14-.25-.02-.38.11-.5.11-.11.25-.29.37-.43.12-.14.16-.25.25-.41.08-.16.04-.31-.02-.43-.06-.12-.56-1.35-.77-1.85-.2-.48-.41-.42-.56-.42h-.48c-.16 0-.43.06-.65.31-.23.25-.86.84-.86 2.04s.88 2.37 1 2.53c.12.16 1.73 2.64 4.19 3.7.59.25 1.04.4 1.4.52.59.19 1.12.16 1.55.1.47-.07 1.46-.6 1.66-1.18.21-.58.21-1.07.14-1.18-.06-.1-.22-.16-.47-.28Z" />
            </svg>
            Order on WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}

export default function CustomizablePage() {
  const [active, setActive] = useState<Slot | null>(null);
  const [cakeSlots, setCakeSlots] = useState<Slot[]>(DEFAULT_CAKE_SLOTS);
  const [bentoSlots, setBentoSlots] = useState<Slot[]>(DEFAULT_BENTO_SLOTS);

  useEffect(() => {
    createClient()
      .from("customizable_items")
      .select("*, customizable_images(*)")
      .order("gallery")
      .order("sort_order")
      .then(({ data }) => {
        const rows = data as CusDbItem[] | null;
        if (!rows || rows.length === 0) return;
        const cakes = rows.filter((r) => r.gallery === "cakes");
        const bento = rows.filter((r) => r.gallery === "bento");
        if (cakes.length > 0) setCakeSlots(cakes.map((item, i) => toSlot(item, i)));
        if (bento.length > 0) setBentoSlots(bento.map((item, i) => toSlot(item, i)));
      });
  }, []);

  return (
    <div className="relative overflow-hidden">
      <section className="relative overflow-hidden bg-gradient-to-b from-honey-light/30 via-cream to-cream">
        <HoneycombPattern className="text-honey/60" opacity={0.14} />
        <div className="relative mx-auto max-w-6xl px-4 pb-10 pt-14 text-center sm:px-6 sm:pt-20 lg:px-8">
          <p className="mb-2 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-honey-dark">
            <span className="h-1.5 w-1.5 rounded-full bg-honey" />
            Made just for you
          </p>
          <h1 className="font-display text-4xl font-semibold tracking-tight text-espresso sm:text-5xl">
            Customizable Cakes
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-espresso-light sm:text-base">
            Pick a design you love and we'll make it yours — message us on WhatsApp to order.
          </p>
        </div>
      </section>

      {[
        { title: "Cakes", slots: cakeSlots },
        { title: "Bento Cakes", slots: bentoSlots },
      ].map(({ title, slots }, sectionIndex) => (
        <section
          key={title}
          className={`mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8${sectionIndex > 0 ? " border-t border-espresso/10" : ""}`}
        >
          <h2 className="mb-8 font-display text-2xl font-semibold tracking-tight text-espresso sm:text-3xl">
            {title}
          </h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 lg:gap-5">
            {slots.map((slot) => (
              <GalleryTile key={slot.code} slot={slot} onOpen={setActive} />
            ))}
          </div>
        </section>
      ))}

      <Lightbox slot={active} onClose={() => setActive(null)} />
    </div>
  );
}
