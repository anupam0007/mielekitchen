import Image from "next/image";
import Link from "next/link";
import HoneycombPattern from "@/components/HoneycombPattern";
import FloatingAccents from "@/components/FloatingAccents";
import { GENERAL_ENQUIRY_LINK } from "@/lib/whatsapp";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-honey-light/35 via-cream to-cream">
      <HoneycombPattern className="text-honey/70" opacity={0.18} />
      <FloatingAccents />

      <div className="relative mx-auto flex max-w-6xl flex-col items-center px-4 pb-20 pt-16 text-center sm:px-6 sm:pb-28 sm:pt-24 lg:px-8">
        <span
          className="mb-5 inline-flex animate-fade-up items-center gap-2 rounded-full border border-honey/40 bg-white/60 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-espresso-light backdrop-blur-sm"
          style={{ animationDelay: "0ms" }}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-honey" />
          Bengaluru · Freshly-made to order
        </span>

        <div
          className="relative animate-fade-up"
          style={{ animationDelay: "70ms" }}
        >
          <span className="relative mx-auto flex h-44 w-44 items-center justify-center overflow-hidden rounded-full bg-white p-3 sm:h-52 sm:w-52">
            <Image
              src="/logo.png"
              alt="Miele — Where Whisk Whips Wonders"
              width={200}
              height={200}
              priority
              className="h-full w-full object-contain"
            />
          </span>
        </div>

        <h1
          className="mt-7 animate-fade-up font-display font-semibold leading-[1.15] tracking-tight text-espresso"
          style={{ animationDelay: "150ms" }}
        >
          <span className="relative inline-block text-4xl text-honey-dark sm:text-5xl md:text-6xl">
            Miele
            <svg
              viewBox="0 0 300 24"
              className="absolute -bottom-2 left-0 h-4 w-full text-honey/70"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <path d="M2 16 C 80 4, 220 4, 298 14" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
            </svg>
          </span>
          <span className="mt-2 block font-display text-lg font-normal italic tracking-wide text-espresso-light sm:text-xl md:text-2xl">
            Where Whisk Whips Wonders
          </span>
        </h1>

        <p
          className="mt-6 max-w-xl animate-fade-up text-base leading-relaxed text-espresso-light sm:text-lg"
          style={{ animationDelay: "230ms" }}
        >
          Miele is a cloud kitchen in Vasanthnagar, Bengaluru, run by chef Anjali V Prasad, where we
          make cakes fresh to order — every cake, tart and bake is whisked up and finished by hand,
          the way good honey is made: slowly, and with care.
        </p>

        <div
          className="mt-9 flex animate-fade-up flex-col items-center gap-3 sm:flex-row"
          style={{ animationDelay: "310ms" }}
        >
          <Link
            href="/menu"
            className="group inline-flex items-center gap-2 rounded-full bg-honey px-7 py-3.5 font-display text-base font-semibold text-espresso shadow-warm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-warm-lg active:translate-y-0"
          >
            View the Menu
            <svg viewBox="0 0 24 24" className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
          <a
            href={GENERAL_ENQUIRY_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-espresso/20 bg-white/50 px-7 py-3.5 font-display text-base font-semibold text-espresso backdrop-blur-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-espresso/40"
          >
            Say hello on WhatsApp
          </a>
        </div>

        <dl
          className="mt-14 grid w-full max-w-2xl animate-fade-up grid-cols-3 gap-4 border-t border-espresso/10 pt-8 text-center sm:gap-8"
          style={{ animationDelay: "390ms" }}
        >
          {[
            ["20+", "Signature bakes"],
            ["7", "Categories to explore"],
            ["100%", "Hand-finished"],
          ].map(([stat, label]) => (
            <div key={label} className="flex flex-col items-center gap-1">
              <dt className="font-display text-2xl font-semibold text-honey-dark sm:text-3xl">{stat}</dt>
              <dd className="text-xs font-medium uppercase tracking-wide text-espresso-light sm:text-sm">{label}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
