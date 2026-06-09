function HoneyDrop({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 48" className={className} aria-hidden="true">
      <path
        d="M20 2 C 30 18, 36 26, 36 34 a16 16 0 0 1 -32 0 C 4 26, 10 18, 20 2 Z"
        fill="currentColor"
      />
      <ellipse cx="15" cy="30" rx="4" ry="6" fill="#fff" opacity="0.35" />
    </svg>
  );
}

function Bee({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 48" className={className} aria-hidden="true">
      <ellipse cx="22" cy="14" rx="16" ry="12" fill="#fdf6e8" opacity="0.85" transform="rotate(-18 22 14)" />
      <ellipse cx="42" cy="14" rx="16" ry="12" fill="#fdf6e8" opacity="0.85" transform="rotate(18 42 14)" />
      <ellipse cx="32" cy="26" rx="16" ry="12" fill="currentColor" />
      <path d="M19 22 a16 6 0 0 0 26 0" fill="none" stroke="#3a2a1e" strokeWidth="2.5" />
      <path d="M22 20 h20 M20 27 h24 M23 34 h18" stroke="#3a2a1e" strokeWidth="3" strokeLinecap="round" />
      <circle cx="20" cy="22" r="2.4" fill="#3a2a1e" />
      <path d="M16 18 q-6 -8 -10 -6" stroke="#3a2a1e" strokeWidth="2" fill="none" strokeLinecap="round" />
    </svg>
  );
}

function Whisk({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 56" className={className} aria-hidden="true">
      <path d="M20 4 v16" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <path
        d="M12 20 C 6 30, 6 42, 20 50 C 34 42, 34 30, 28 20"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.4"
      />
      <path
        d="M16 20 C 12 30, 12 42, 20 48"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        opacity="0.6"
      />
      <path
        d="M24 20 C 28 30, 28 42, 20 48"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        opacity="0.6"
      />
    </svg>
  );
}

interface AccentSpec {
  el: typeof HoneyDrop;
  className: string;
  wrapperClassName: string;
}

const ACCENTS: AccentSpec[] = [
  {
    el: HoneyDrop,
    wrapperClassName: "left-[6%] top-[18%] h-10 w-8 text-honey animate-float-slow",
    className: "h-full w-full drop-shadow-md",
  },
  {
    el: Bee,
    wrapperClassName: "right-[10%] top-[24%] h-10 w-14 text-honey-dark animate-float",
    className: "h-full w-full drop-shadow-md",
  },
  {
    el: HoneyDrop,
    wrapperClassName: "right-[20%] bottom-[16%] h-8 w-6 text-honey-light animate-float-slower",
    className: "h-full w-full drop-shadow",
  },
  {
    el: Whisk,
    wrapperClassName: "left-[14%] bottom-[12%] h-12 w-9 text-espresso-light/70 animate-float-slow",
    className: "h-full w-full drop-shadow",
  },
  {
    el: Bee,
    wrapperClassName: "left-[42%] top-[8%] h-7 w-10 text-honey/80 animate-float-slower",
    className: "h-full w-full",
  },
];

export default function FloatingAccents({ className = "" }: { className?: string }) {
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden="true">
      {ACCENTS.map(({ el: Accent, wrapperClassName, className: innerClassName }, i) => (
        <span key={i} className={`absolute ${wrapperClassName}`} style={{ animationDelay: `${i * 0.6}s` }}>
          <Accent className={innerClassName} />
        </span>
      ))}
    </div>
  );
}
