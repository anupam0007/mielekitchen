interface HoneycombPatternProps {
  className?: string;
  opacity?: number;
}

// Flat-top hexagon grid, generated with proper tessellation math so the
// pattern tiles seamlessly as a subtle background motif.
function buildHexGrid(cols: number, rows: number, radius: number) {
  const hexW = 1.5 * radius;
  const hexH = Math.sqrt(3) * radius;
  const polygons: string[] = [];

  for (let col = 0; col < cols; col += 1) {
    for (let row = 0; row < rows; row += 1) {
      const cx = col * hexW;
      const cy = row * hexH + (col % 2 === 1 ? hexH / 2 : 0);
      const points = Array.from({ length: 6 }, (_, k) => {
        const angle = (Math.PI / 180) * (60 * k);
        const x = cx + radius * Math.cos(angle);
        const y = cy + radius * Math.sin(angle);
        return `${x.toFixed(1)},${y.toFixed(1)}`;
      }).join(" ");
      polygons.push(points);
    }
  }
  return polygons;
}

const HEX_POINTS = buildHexGrid(14, 9, 26);

export default function HoneycombPattern({ className = "", opacity = 0.16 }: HoneycombPatternProps) {
  return (
    <svg
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
      viewBox="0 0 560 360"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <g fill="none" stroke="currentColor" strokeWidth="1.4" opacity={opacity}>
        {HEX_POINTS.map((points, i) => (
          <polygon key={i} points={points} />
        ))}
      </g>
    </svg>
  );
}
