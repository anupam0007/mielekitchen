interface MarqueeProps {
  items: string[];
  className?: string;
}

export default function Marquee({ items, className = "" }: MarqueeProps) {
  const track = [...items, ...items];

  return (
    <div
      className={`relative overflow-hidden border-y border-espresso/10 bg-espresso py-3.5 text-cream ${className}`}
      aria-hidden="true"
    >
      <div className="flex w-max animate-marquee items-center gap-10 whitespace-nowrap will-change-transform">
        {track.map((item, i) => (
          <span key={i} className="flex items-center gap-10 font-display text-base tracking-wide sm:text-lg">
            <span className="text-honey-light">{item}</span>
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 text-honey" fill="currentColor" aria-hidden="true">
              <path d="M12 2c2 3 4 5.2 4 8a4 4 0 0 1-8 0c0-2.8 2-5 4-8Z" />
              <circle cx="12" cy="17" r="4.2" />
            </svg>
          </span>
        ))}
      </div>
    </div>
  );
}
