const VARIANT_CLASSES = {
  neutral: 'bg-primary-50 text-primary-700',
  accent: 'bg-accent-100 text-accent-600',
  success: 'bg-success-100 text-success',
  warning: 'bg-warning-100 text-warning',
  danger: 'bg-danger-100 text-danger',
};

// Used for things like "Verified Supplier", "In Stock", "New Arrival" —
// keep labels short (1-3 words); this is a label, not a description.
const Badge = ({ children, variant = 'neutral', icon: Icon, className = '' }) => (
  <span
    className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium tracking-wide
      ${VARIANT_CLASSES[variant] ?? VARIANT_CLASSES.neutral} ${className}`}
  >
    {Icon && <Icon className="h-3 w-3" />}
    {children}
  </span>
);

export default Badge;
