import { ShoppingBag, Factory } from 'lucide-react';
import { ROLES } from '../../utils/constants';

const ROLE_OPTIONS = [
  {
    value: ROLES.BUYER,
    label: 'Buyer',
    description: 'Sourcing fabric for my business',
    icon: ShoppingBag,
  },
  {
    value: ROLES.SUPPLIER,
    label: 'Supplier',
    description: 'Selling fabric to buyers',
    icon: Factory,
  },
];

// Deliberately a button group, not a <select> — role is a one-time, load-
// bearing choice at signup (it decides which dashboard/permissions the
// account gets), so it earns a more visible control than a dropdown.
const RoleSelect = ({ value, onChange, error }) => (
  <div>
    <span className="mb-1.5 block text-sm font-medium text-ink">I am a…</span>
    <div className="grid grid-cols-2 gap-3">
      {ROLE_OPTIONS.map(({ value: optionValue, label, description, icon: Icon }) => {
        const selected = value === optionValue;
        return (
          <button
            key={optionValue}
            type="button"
            onClick={() => onChange(optionValue)}
            aria-pressed={selected}
            className={`flex flex-col items-start gap-2 rounded-xl border px-4 py-3.5 text-left transition-colors
              ${selected ? 'border-primary bg-primary-50' : 'border-border bg-surface hover:border-accent-500'}`}
          >
            <Icon className={`h-5 w-5 ${selected ? 'text-primary-700' : 'text-muted'}`} />
            <span className="font-display text-sm font-medium text-ink">{label}</span>
            <span className="text-xs text-muted">{description}</span>
          </button>
        );
      })}
    </div>
    {error && <p className="mt-1.5 text-sm text-danger">{error}</p>}
  </div>
);

export default RoleSelect;
