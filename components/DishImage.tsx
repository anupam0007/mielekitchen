"use client";

import { useState } from "react";
import Image from "next/image";

interface DishImageProps {
  src: string;
  name: string;
  gradient: [string, string];
  className?: string;
  priority?: boolean;
  sizes?: string;
}

/**
 * Renders a dish photo via next/image. If the file at `src` is missing
 * (or fails to load for any reason), it falls back to a soft gradient
 * tile bearing the dish name — so the menu never looks broken while
 * real photos are being added to /public/menu/.
 */
export default function DishImage({
  src,
  name,
  gradient,
  className = "",
  priority = false,
  sizes = "(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw",
}: DishImageProps) {
  const [failed, setFailed] = useState(false);
  const [from, to] = gradient;

  if (failed) {
    return (
      <div
        className={`relative flex h-full w-full items-center justify-center overflow-hidden p-5 text-center ${className}`}
        style={{ background: `linear-gradient(160deg, ${from}, ${to})` }}
        role="img"
        aria-label={name}
      >
        <div className="pointer-events-none absolute -right-8 -top-10 h-32 w-32 rounded-full bg-white/25 blur-xl" />
        <div className="pointer-events-none absolute -bottom-12 -left-10 h-36 w-36 rounded-full bg-black/10 blur-2xl" />
        <span className="relative font-display text-base font-semibold leading-snug text-espresso/85 drop-shadow-sm sm:text-lg">
          {name}
        </span>
      </div>
    );
  }

  return (
    <div className={`relative h-full w-full ${className}`}>
      <Image
        src={src}
        alt={name}
        fill
        sizes={sizes}
        priority={priority}
        className="object-cover"
        onError={() => setFailed(true)}
      />
    </div>
  );
}
