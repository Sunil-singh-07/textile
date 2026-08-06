import { Link } from 'react-router-dom';

// A tiny interlaced-thread monogram instead of a generic wordmark icon —
// echoes WeavePattern/WeaveHeroGraphic at brand-mark scale.
const Logo = ({ className = '' }) => (
  <Link to="/" className={`flex items-center gap-2 ${className}`}>
    <svg width="28" height="28" viewBox="0 0 28 28" aria-hidden="true">
      <rect width="28" height="28" rx="8" fill="#6B4F3B" />
      <rect x="6" y="8" width="16" height="3" fill="#F8F5F1" />
      <rect x="6" y="17" width="16" height="3" fill="#F8F5F1" />
      <rect x="8" y="6" width="3" height="16" fill="#B08968" />
      <rect x="17" y="6" width="3" height="16" fill="#B08968" />
    </svg>
    <span className="font-display text-lg font-semibold tracking-tight text-ink">
      Textile<span className="text-accent-600">Market</span>
    </span>
  </Link>
);

export default Logo;
