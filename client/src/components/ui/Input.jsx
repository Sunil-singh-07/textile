import { forwardRef } from 'react';

// Designed to be spread with react-hook-form's register(): <Input {...register('email')} />
const Input = forwardRef(({ label, error, className = '', id, ...props }, ref) => {
  const inputId = id || props.name;

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="mb-1.5 block text-sm font-medium text-ink">
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={inputId}
        className={`w-full rounded-lg border bg-surface px-3.5 py-2.5 text-sm text-ink placeholder:text-muted/70
          transition-colors focus:outline-none focus:ring-2 focus:ring-accent-500/30 focus:border-accent-500
          ${error ? 'border-danger' : 'border-border'} ${className}`}
        aria-invalid={!!error}
        {...props}
      />
      {error && <p className="mt-1.5 text-sm text-danger">{error}</p>}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
