import { PackageOpen } from 'lucide-react';
import Button from '../ui/Button';

// Empty screens are an invitation to act, not just a "nothing here" notice —
// always pair the icon/title with a concrete next step where one exists.
const EmptyState = ({
  icon: Icon = PackageOpen,
  title = 'Nothing here yet',
  description,
  actionLabel,
  onAction,
  className = '',
}) => (
  <div
    className={`flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed
      border-border bg-surface px-6 py-16 text-center ${className}`}
  >
    <div className="rounded-full bg-primary-50 p-3">
      <Icon className="h-6 w-6 text-primary-600" />
    </div>
    <h3 className="font-display text-lg font-medium text-ink">{title}</h3>
    {description && <p className="max-w-sm text-sm text-muted">{description}</p>}
    {actionLabel && onAction && (
      <Button size="sm" onClick={onAction} className="mt-2">
        {actionLabel}
      </Button>
    )}
  </div>
);

export default EmptyState;
