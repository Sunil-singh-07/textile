// A dashed "stitch" line stands in for the plain hairline dividers most
// pages use — a small, content-true nod to the subject (a seam) rather than
// decoration for its own sake.
const StitchDivider = ({ className = '' }) => (
  <div className={`flex items-center justify-center ${className}`} aria-hidden="true">
    <svg width="100%" height="2" className="max-w-6xl px-4">
      <line
        x1="0"
        y1="1"
        x2="100%"
        y2="1"
        stroke="#B08968"
        strokeWidth="1.5"
        strokeDasharray="2 6"
        strokeLinecap="round"
      />
    </svg>
  </div>
);

export default StitchDivider;
