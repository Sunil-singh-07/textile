import { MapPin, ShieldCheck } from 'lucide-react';
import Badge from './Badge';

// Mirrors GET /suppliers/:id (public profile): businessName, categories[],
// fabricTypes[], moq. `verified` and `location` are optional display-only
// props — the current backend model doesn't expose them, so this renders
// fine without either until/unless the API adds them.
const SupplierCard = ({ supplier, className = '' }) => {
  const { businessName, categories = [], fabricTypes = [], moq, verified, location } = supplier;

  return (
    <div className={`rounded-2xl border border-border bg-surface p-5 shadow-card ${className}`}>
      <div className="mb-2 flex items-start justify-between gap-2">
        <h3 className="font-display text-lg font-medium text-ink">{businessName}</h3>
        {verified && <Badge variant="success" icon={ShieldCheck}>Verified</Badge>}
      </div>

      {location && (
        <p className="mb-3 flex items-center gap-1 text-xs text-muted">
          <MapPin className="h-3 w-3" />
          {location}
        </p>
      )}

      {(categories.length > 0 || fabricTypes.length > 0) && (
        <div className="mb-3 flex flex-wrap gap-1.5">
          {[...categories, ...fabricTypes].slice(0, 4).map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-primary-50 px-2.5 py-1 text-xs font-medium text-primary-700"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {moq && (
        <p className="border-t border-border pt-3 font-mono text-xs text-muted">
          MOQ: {moq}
        </p>
      )}
    </div>
  );
};

export default SupplierCard;
