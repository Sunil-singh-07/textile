import { SlidersHorizontal } from 'lucide-react';
import Input from '../ui/Input';
import Badge from '../ui/Badge';
import Button from '../ui/Button';

const FilterSection = ({ title, children, className = '' }) => (
  <div className={`border-b border-border py-5 first:pt-0 last:border-b-0 last:pb-0 ${className}`}>
    <h3 className="mb-3 font-mono text-xs font-medium uppercase tracking-widest text-muted">
      {title}
    </h3>
    {children}
  </div>
);

// Controlled filter panel — MarketplacePage owns all filter state and query
// syncing; this component only renders it and reports intent up via
// callbacks. Keeping it dumb makes the same panel reusable in a mobile
// drawer without duplicating any state logic.
const MarketplaceFilters = ({
  priceMin,
  priceMax,
  onPriceMinChange,
  onPriceMaxChange,
  materialOptions = [],
  selectedMaterials = [],
  onToggleMaterial,
  gsmMin,
  gsmMax,
  onGsmMinChange,
  onGsmMaxChange,
  inStockOnly,
  onToggleInStock,
  hasActiveFilters,
  onClearAll,
  className = '',
}) => (
  <div className={`rounded-2xl border border-border bg-surface p-5 ${className}`}>
    <div className="mb-1 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <SlidersHorizontal className="h-4 w-4 text-primary-600" />
        <h2 className="font-display text-base font-medium text-ink">Filters</h2>
      </div>
      {hasActiveFilters && (
        <Button variant="ghost" size="sm" className="px-2 py-1 text-xs" onClick={onClearAll}>
          Clear all
        </Button>
      )}
    </div>

    <FilterSection title="Price / metre (₹)">
      <div className="flex items-center gap-2">
        <Input
          type="number"
          inputMode="numeric"
          min="0"
          placeholder="Min"
          aria-label="Minimum price"
          value={priceMin}
          onChange={(e) => onPriceMinChange(e.target.value)}
        />
        <span className="shrink-0 text-sm text-muted">–</span>
        <Input
          type="number"
          inputMode="numeric"
          min="0"
          placeholder="Max"
          aria-label="Maximum price"
          value={priceMax}
          onChange={(e) => onPriceMaxChange(e.target.value)}
        />
      </div>
    </FilterSection>

    <FilterSection title="Material">
      {materialOptions.length === 0 ? (
        <p className="text-sm text-muted">Composition will appear once fabrics load.</p>
      ) : (
        <div className="flex max-h-40 flex-col gap-2 overflow-y-auto pr-1">
          {materialOptions.map((material) => (
            <label
              key={material}
              className="flex cursor-pointer items-center gap-2.5 text-sm text-ink"
            >
              <input
                type="checkbox"
                checked={selectedMaterials.includes(material)}
                onChange={() => onToggleMaterial(material)}
                className="h-4 w-4 rounded border-border text-primary accent-primary-600 focus-visible:outline-accent-500"
              />
              {material}
            </label>
          ))}
        </div>
      )}
    </FilterSection>

    <FilterSection title="GSM">
      <div className="flex items-center gap-2">
        <Input
          type="number"
          inputMode="numeric"
          min="0"
          placeholder="Min"
          aria-label="Minimum GSM"
          value={gsmMin}
          onChange={(e) => onGsmMinChange(e.target.value)}
        />
        <span className="shrink-0 text-sm text-muted">–</span>
        <Input
          type="number"
          inputMode="numeric"
          min="0"
          placeholder="Max"
          aria-label="Maximum GSM"
          value={gsmMax}
          onChange={(e) => onGsmMaxChange(e.target.value)}
        />
      </div>
    </FilterSection>

    {/* MOQ isn't a field on the Product model yet (server/models/Product.js
        has no minimum-order-quantity data), so this stays a visible-but-
        disabled placeholder rather than filtering against numbers we'd
        have to invent. */}
    <FilterSection title="MOQ">
      <div className="flex items-center justify-between rounded-lg border border-dashed border-border bg-background px-3 py-2.5">
        <span className="text-sm text-muted">Minimum order qty</span>
        <Badge variant="neutral">Coming soon</Badge>
      </div>
    </FilterSection>

    <FilterSection title="Availability">
      <label className="flex cursor-pointer items-center gap-2.5 text-sm text-ink">
        <input
          type="checkbox"
          checked={inStockOnly}
          onChange={onToggleInStock}
          className="h-4 w-4 rounded border-border text-primary accent-primary-600 focus-visible:outline-accent-500"
        />
        In stock only
      </label>
    </FilterSection>
  </div>
);

export default MarketplaceFilters;
