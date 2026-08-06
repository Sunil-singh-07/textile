const CategoryChip = ({ label, icon: Icon, selected = false, onClick, className = '' }) => (
  <button
    type="button"
    onClick={onClick}
    aria-pressed={selected}
    className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-4 py-2 text-sm
      font-medium transition-colors ${
        selected
          ? 'border-primary bg-primary text-background'
          : 'border-border bg-surface text-ink hover:border-accent-500 hover:text-accent-600'
      } ${className}`}
  >
    {Icon && <Icon className="h-3.5 w-3.5" />}
    {label}
  </button>
);

export default CategoryChip;
