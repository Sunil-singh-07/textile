import { motion, useReducedMotion } from 'framer-motion';

const WARP_COLORS = ['#6B4F3B', '#8C6A52', '#B08968', '#6B4F3B', '#8C6A52', '#B08968'];
const WEFT_COLORS = ['#463327', '#8A6D57', '#D3B599', '#463327', '#8A6D57', '#D3B599'];

const COLS = 6;
const ROWS = 6;
const CELL = 34;
const SIZE = CELL * COLS;

// Renders a small grid of horizontal (warp) and vertical (weft) bands. On
// mount, warp bands draw in left-to-right, then weft bands draw in
// top-to-bottom and overlap them — visually "weaving" the swatch, the same
// way a loom would build up cloth row by row. This is the one deliberately
// bold animated moment on the page; everything else is quiet by comparison.
const WeaveHeroGraphic = () => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="relative mx-auto aspect-square w-full max-w-[420px]">
      <svg
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        className="h-full w-full overflow-visible"
        role="img"
        aria-label="An illustration of interlacing fabric threads forming a woven swatch"
      >
        <defs>
          <clipPath id="swatchClip">
            <rect width={SIZE} height={SIZE} rx={28} />
          </clipPath>
        </defs>

        <g clipPath="url(#swatchClip)">
          <rect width={SIZE} height={SIZE} fill="#F3E7DA" />

          {/* Warp: horizontal bands */}
          {Array.from({ length: ROWS }).map((_, row) => (
            <motion.rect
              key={`warp-${row}`}
              x={0}
              y={row * CELL}
              width={SIZE}
              height={CELL - 4}
              fill={WARP_COLORS[row % WARP_COLORS.length]}
              initial={shouldReduceMotion ? false : { scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.6, delay: shouldReduceMotion ? 0 : 0.08 * row, ease: 'easeOut' }}
              style={{ transformOrigin: 'left center' }}
            />
          ))}

          {/* Weft: vertical bands, overlapping the warp to read as woven */}
          {Array.from({ length: COLS }).map((_, col) => (
            <motion.rect
              key={`weft-${col}`}
              x={col * CELL}
              y={0}
              width={CELL - 4}
              height={SIZE}
              fill={WEFT_COLORS[col % WEFT_COLORS.length]}
              opacity={0.72}
              initial={shouldReduceMotion ? false : { scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{
                duration: 0.6,
                delay: shouldReduceMotion ? 0 : 0.6 + 0.08 * col,
                ease: 'easeOut',
              }}
              style={{ transformOrigin: 'top center' }}
            />
          ))}
        </g>

        <rect
          width={SIZE}
          height={SIZE}
          rx={28}
          fill="none"
          stroke="#2F241D"
          strokeOpacity={0.08}
        />
      </svg>

      {/* Floating spec chips — echoes the ProductCard's mono spec line, so
          the hero graphic reads unmistakably as "this is a fabric". */}
      <motion.div
        className="absolute -left-6 top-6 rounded-lg border border-border bg-surface px-3 py-1.5 shadow-card sm:-left-10"
        initial={shouldReduceMotion ? false : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: shouldReduceMotion ? 0 : 1.3, duration: 0.4 }}
      >
        <span className="font-mono text-xs text-primary-700">280 GSM</span>
      </motion.div>

      <motion.div
        className="absolute -right-4 bottom-10 rounded-lg border border-border bg-surface px-3 py-1.5 shadow-card sm:-right-8"
        initial={shouldReduceMotion ? false : { opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: shouldReduceMotion ? 0 : 1.45, duration: 0.4 }}
      >
        <span className="font-mono text-xs text-primary-700">60% Cotton / 40% Linen</span>
      </motion.div>
    </div>
  );
};

export default WeaveHeroGraphic;
