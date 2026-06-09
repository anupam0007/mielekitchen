"use client";

import { useState } from "react";
import Link from "next/link";
import DishImage from "@/components/DishImage";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import ProductCard from "@/components/ProductCard";
import ProductModal from "@/components/ProductModal";
import { MENU_ITEMS, type MenuItem } from "@/lib/mock-data";
import { GENERAL_ENQUIRY_LINK } from "@/lib/whatsapp";

const MARQUEE_ITEMS = [
  "Freshly made to order",
  "Honey-kissed recipes",
  "Local delivery across Bengaluru",
  "Custom flavours on request",
  "Hand-finished, every time",
  "Please order before 2 days",
];

const KITCHEN_TOUR: Array<{ src: string; caption: string; gradient: [string, string] }> = [
  { src: "/kitchen/kitchen-1.jpg", caption: "Where the morning bakes begin", gradient: ["#dfe3d6", "#5b6e5c"] },
  { src: "/kitchen/kitchen-2.jpg", caption: "Hand-piped, one at a time", gradient: ["#e6e8da", "#4f5d47"] },
  { src: "/kitchen/kitchen-3.jpg", caption: "Fresh from the oven", gradient: ["#e2e6d8", "#6b7860"] },
  { src: "/kitchen/kitchen-4.jpg", caption: "Boxed up and ready to go", gradient: ["#e8ebdd", "#586352"] },
];

const featured = MENU_ITEMS.filter((item) => item.featured);

export default function Home() {
  const [activeItem, setActiveItem] = useState<MenuItem | null>(null);

  return (
    <>
      <Hero />
      <Marquee items={MARQUEE_ITEMS} />

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="mb-10 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <p className="mb-2 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-honey-dark">
              <span className="h-1.5 w-1.5 rounded-full bg-honey" />
              Most loved
            </p>
            <h2 className="font-display text-3xl font-semibold tracking-tight text-espresso sm:text-4xl">
              Straight from our ovens to your table
            </h2>
          </div>
          <Link
            href="/menu"
            className="group inline-flex shrink-0 items-center gap-1.5 font-display text-sm font-semibold text-espresso transition-colors hover:text-honey-dark"
          >
            View full menu
            <svg viewBox="0 0 24 24" className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((item, i) => (
            <ProductCard
              key={item.id}
              item={item}
              onOpen={setActiveItem}
              priority={i < 4}
              className="animate-fade-up"
              style={{ animationDelay: `${i * 90}ms` }}
            />
          ))}
        </div>
      </section>

      <section className="relative overflow-hidden border-y border-honey/15 bg-espresso py-16 text-cream sm:py-20">
        <div className="absolute inset-0 opacity-[0.07]">
          <svg width="100%" height="100%" aria-hidden="true">
            <defs>
              <pattern id="dots" width="22" height="22" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="1.6" fill="currentColor" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#dots)" />
          </svg>
        </div>
        <div className="relative mx-auto flex max-w-4xl flex-col items-center gap-5 px-4 text-center sm:px-6 lg:px-8">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-honey/20 text-2xl">🍯</span>
          <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            Planning a birthday, wedding, or just because?
          </h2>
          <p className="max-w-xl text-sm leading-relaxed text-cream/75 sm:text-base">
            Tell us the occasion, the flavour, and the date — we'll work out the size and design
            with you directly over WhatsApp, then have it ready for pickup or delivery anywhere
            in Bengaluru.
          </p>
          <a
            href={GENERAL_ENQUIRY_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-flex items-center gap-2 rounded-full bg-honey px-7 py-3.5 font-display text-base font-semibold text-espresso shadow-warm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-warm-lg"
          >
            Start a conversation
          </a>
        </div>
      </section>

      <section id="kitchen" className="border-b border-cream/10 bg-forest py-16 text-cream sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-10 max-w-2xl text-center">
            <p className="mb-2 inline-flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-honey-light">
              <span className="h-1.5 w-1.5 rounded-full bg-honey" />
              Kitchen tour
            </p>
            <h2 className="font-display text-3xl font-semibold tracking-tight text-cream sm:text-4xl">
              A peek inside our kitchen
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-cream/70 sm:text-base">
              Every bake starts here — freshly made to order, hand-finished with care in our
              cloud kitchen in Vasanthnagar, Bengaluru.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {KITCHEN_TOUR.map((photo, i) => (
              <div
                key={photo.src}
                className="group aspect-square animate-fade-up overflow-hidden rounded-2xl shadow-warm-sm"
                style={{ animationDelay: `${i * 90}ms` }}
              >
                <DishImage
                  src={photo.src}
                  name={photo.caption}
                  gradient={photo.gradient}
                  sizes="(min-width: 1024px) 25vw, 50vw"
                  className="transition-transform duration-500 group-hover:scale-105"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      <ProductModal item={activeItem} onClose={() => setActiveItem(null)} />
    </>
  );
}
