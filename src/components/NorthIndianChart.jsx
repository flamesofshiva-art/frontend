// Fixed North Indian diamond layout: house positions on a 400x400 grid
const HOUSE_POS = {
  1: { x: 200, y: 90 },
  2: { x: 110, y: 45 },
  3: { x: 45, y: 110 },
  4: { x: 90, y: 200 },
  5: { x: 45, y: 290 },
  6: { x: 110, y: 355 },
  7: { x: 200, y: 310 },
  8: { x: 290, y: 355 },
  9: { x: 355, y: 290 },
  10: { x: 310, y: 200 },
  11: { x: 355, y: 110 },
  12: { x: 290, y: 45 },
};

const PLANET_ABBR = {
  Sun: 'Su', Moon: 'Mo', Mars: 'Ma', Mercury: 'Me', Jupiter: 'Ju',
  Venus: 'Ve', Saturn: 'Sa', Rahu: 'Ra', Ketu: 'Ke', Lagna: 'As',
};

/**
 * Renders any varga (D1-D60) as a North Indian square chart.
 *
 * chartData: { PlanetName: { rashi, house }, ..., Lagna: { rashi, house: 1 } }
 * — this is exactly the shape returned per-varga by the backend's
 * /kundali/divisional-charts endpoint (result.vargas["D9"], etc.)
 */
export default function NorthIndianChart({ chartData, size = 400, title }) {
  const houses = {};
  for (let h = 1; h <= 12; h++) houses[h] = [];

  Object.entries(chartData || {}).forEach(([name, p]) => {
    if (!p || typeof p.house !== 'number') return;
    houses[p.house].push(name);
  });

  return (
    <svg viewBox="0 0 400 400" width={size} height={size} role="img" aria-label={title || 'North Indian chart'}>
      <rect x="2" y="2" width="396" height="396" fill="none" stroke="var(--gold-soft)" strokeWidth="1.5" />
      <g stroke="var(--gold-soft)" strokeWidth="1">
        <line x1="2" y1="2" x2="398" y2="398" />
        <line x1="398" y1="2" x2="2" y2="398" />
        <line x1="200" y1="2" x2="2" y2="200" />
        <line x1="2" y1="200" x2="200" y2="398" />
        <line x1="200" y1="398" x2="398" y2="200" />
        <line x1="398" y1="200" x2="200" y2="2" />
      </g>
      {Object.entries(HOUSE_POS).map(([house, pos]) => (
        <text
          key={house}
          x={pos.x}
          y={pos.y}
          textAnchor="middle"
          fontSize="13"
          fontFamily="var(--font-body)"
          fill="var(--vermillion)"
          fontWeight="600"
        >
          {/* Lagna always sorts first within its house */}
          {[...houses[house]].sort((a) => (a === 'Lagna' ? -1 : 0))
            .map((p) => PLANET_ABBR[p] || p)
            .join(' ')}
        </text>
      ))}
    </svg>
  );
}
