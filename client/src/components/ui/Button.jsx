import { forwardRef } from 'react';
import Spinner from './Spinner';

const VARIANT_CLASSES = {
  primary:
    'bg-primary text-background hover:bg-primary-700 shadow-card focus-visible:outline-accent-500',
  secondary:
    'bg-secondary-100 text-primary-800 hover:bg-secondary-100/70 focus-visible:outline-accent-500',
  outline:
    'border border-primary/30 text-primary bg-transparent hover:bg-primary-50 focus-visible:outline-accent-500',
  ghost: 'text-primary hover:bg-primary-50 focus-visible:outline-accent-500',
  accent:
    'bg-accent-500 text-background hover:bg-accent-600 shadow-card focus-visible:outline-primary',
  danger: 'bg-danger text-background hover:bg-danger/90 focus-visible:outline-danger',
};

const SIZE_CLASSES = {
  sm: 'px-3.5 py-1.5 text-sm',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-7 py-3.5 text-base',
};

const Button = forwardRef(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      disabled = false,
      className = '',
      type = 'button',
      ...props
    },
    ref
  ) => (
    <button
      ref={ref}
      type={type}
      disabled={disabled || isLoading}
      className={`inline-flex items-center justify-center gap-2 rounded-full font-medium tracking-tight
        transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50
        focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2
        ${VARIANT_CLASSES[variant]} ${SIZE_CLASSES[size]} ${className}`}
      {...props}
    >
      {isLoading && <Spinner size="sm" className="text-current" />}
      {children}
    </button>
  )
);

Button.displayName = 'Button';

export default Button;
