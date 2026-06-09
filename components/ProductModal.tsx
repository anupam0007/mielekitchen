"use client";

import { useEffect } from "react";
import { type MenuItem } from "@/lib/mock-data";
import { dishEnquiryLink, INSTAGRAM_URL, PHONE_DISPLAY, PHONE_TEL_LINK } from "@/lib/whatsapp";
import DishImage from "@/components/DishImage";

interface ProductModalProps {
  item: MenuItem | null;
  onClose: () => void;
}

export default function ProductModal({ item, onClose }: ProductModalProps) {
  useEffect(() => {
    if (!item) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [item, onClose]);

  if (!item) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6">
      <button
        type="button"
        aria-label="Close dish details"
        onClick={onClose}
        className="absolute inset-0 bg-espresso/45 backdrop-blur-sm animate-fade-in"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label={item.name}
        className="relative flex max-h-[92vh] w-full max-w-3xl animate-scale-in flex-col overflow-hidden rounded-t-3xl bg-cream shadow-warm-lg sm:rounded-3xl md:flex-row"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/70 text-espresso shadow-sm backdrop-blur transition-colors hover:bg-white"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
          </svg>
        </button>

        <div className="h-64 shrink-0 md:h-auto md:w-2/5">
          <DishImage src={item.image} name={item.name} gradient={item.gradient} />
        </div>

        <div className="flex flex-1 flex-col overflow-y-auto p-5 sm:p-7">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-forest/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-forest">
              {item.category}
            </span>
          </div>

          <h2 className="font-display text-2xl font-semibold leading-tight text-espresso sm:text-3xl">
            {item.name}
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-espresso-light">{item.description}</p>

          <p className="mt-5 text-xs leading-relaxed text-espresso-soft">
            This is a showcase menu — flavours, sizes and customisations are arranged directly with
            our kitchen. Tap below to chat with us on WhatsApp and we'll take it from there.
          </p>

          <div className="mt-6 flex flex-col gap-3 border-t border-honey/15 pt-5">
            <a
              href={dishEnquiryLink(item.name)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-honey px-6 py-3.5 text-center font-display text-sm font-semibold text-espresso shadow-warm transition-transform duration-200 hover:-translate-y-0.5 active:translate-y-0"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
                <path d="M12.04 2c-5.5 0-9.96 4.46-9.96 9.96 0 1.76.46 3.45 1.33 4.95L2 22l5.25-1.38a9.93 9.93 0 0 0 4.79 1.22h.01c5.5 0 9.96-4.46 9.96-9.96S17.54 2 12.04 2Zm0 18.13a8.2 8.2 0 0 1-4.18-1.14l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.34c0-4.54 3.7-8.23 8.24-8.23 4.54 0 8.23 3.7 8.23 8.24a8.23 8.23 0 0 1-8.24 8.18Zm4.51-6.16c-.25-.12-1.46-.72-1.69-.8-.23-.08-.39-.12-.56.12-.16.25-.64.8-.78.96-.14.16-.29.18-.54.06-.25-.12-1.04-.38-1.98-1.22-.73-.65-1.23-1.46-1.37-1.7-.14-.25-.02-.38.11-.5.11-.11.25-.29.37-.43.12-.14.16-.25.25-.41.08-.16.04-.31-.02-.43-.06-.12-.56-1.35-.77-1.85-.2-.48-.41-.42-.56-.42h-.48c-.16 0-.43.06-.65.31-.23.25-.86.84-.86 2.04s.88 2.37 1 2.53c.12.16 1.73 2.64 4.19 3.7.59.25 1.04.4 1.4.52.59.19 1.12.16 1.55.1.47-.07 1.46-.6 1.66-1.18.21-.58.21-1.07.14-1.18-.06-.1-.22-.16-.47-.28Z" />
              </svg>
              Order &ldquo;{item.name}&rdquo; on WhatsApp
            </a>

            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-espresso-light">
              <a href={PHONE_TEL_LINK} className="inline-flex items-center gap-1.5 transition-colors hover:text-espresso">
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M6.6 10.8a15.5 15.5 0 0 0 6.6 6.6l2.2-2.2a1.5 1.5 0 0 1 1.5-.36 11 11 0 0 0 3.5.56 1.5 1.5 0 0 1 1.5 1.5V20a1.5 1.5 0 0 1-1.5 1.5C10.6 21.5 2.5 13.4 2.5 4.5A1.5 1.5 0 0 1 4 3h2.6A1.5 1.5 0 0 1 8 4.5a11 11 0 0 0 .56 3.5 1.5 1.5 0 0 1-.36 1.5l-2.2 2.2Z" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Call {PHONE_DISPLAY}
              </a>
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 transition-colors hover:text-espresso"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <rect x="3" y="3" width="18" height="18" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
                </svg>
                @mielekitchen_
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
