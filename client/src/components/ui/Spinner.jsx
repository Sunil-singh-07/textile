import { Loader2 } from 'lucide-react';

const SIZE_CLASSES = {
  sm: 'h-4 w-4',
  md: 'h-6 w-6',
  lg: 'h-10 w-10',
};

const Spinner = ({ size = 'md', className = '' }) => (
  <Loader2
    className={`animate-spin text-accent-500 ${SIZE_CLASSES[size] ?? SIZE_CLASSES.md} ${className}`}
    aria-label="Loading"
  />
);

export default Spinner;
