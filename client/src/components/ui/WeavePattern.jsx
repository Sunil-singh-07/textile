// The recurring visual signature of this design: a basket-weave pattern —
// alternating light/dark threads suggesting warp-over-weft — standing in
// for the generic gradient-mesh/blob backgrounds AI-generated pages default
// to. Used at low opacity as texture, never as a loud foreground graphic
// (the one bold use is the animated WeaveHeroGraphic on the hero).
const WeavePattern = ({
  id = 'weave',
  color = '#6B4F3B',
  cell = 18,
  className = '',
  opacity = 0.08,
}) => (
  <svg className={className} width="100%" height="100%" aria-hidden="true">
    <defs>
      <pattern id={id} width={cell * 2} height={cell * 2} patternUnits="userSpaceOnUse">
        <rect width={cell} height={cell} x={0} y={0} fill={color} opacity={opacity} />
        <rect width={cell} height={cell} x={cell} y={cell} fill={color} opacity={opacity} />
        <rect
          width={cell}
          height={cell}
          x={cell}
          y={0}
          fill={color}
          opacity={opacity * 0.45}
        />
        <rect
          width={cell}
          height={cell}
          x={0}
          y={cell}
          fill={color}
          opacity={opacity * 0.45}
        />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill={`url(#${id})`} />
  </svg>
);

export default WeavePattern;
