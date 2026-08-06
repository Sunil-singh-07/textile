import { forwardRef } from 'react';

// Same visual language and prop contract as Input.jsx (label/error, spread
// straight from react-hook-form's register()) — no Select existed yet in
// the design system, so this fills that gap rather than reusing Input for
// something it wasn't built for.
const Select = forwardRef(
  ({ label, error, placeholder, className = '', id, children, ...props }, ref) => {
    const selectId = id || props.name;

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={selectId} className="mb-1.5 block text-sm font-medium text-ink">
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={selectId}
          className={`w-full rounded-lg border bg-surface px-3.5 py-2.5 text-sm text-ink
            transition-colors focus:outline-none focus:ring-2 focus:ring-accent-500/30 focus:border-accent-500
            ${error ? 'border-danger' : 'border-border'} ${className}`}
          aria-invalid={!!error}
          {...props}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {children}
        </select>
        {error && <p className="mt-1.5 text-sm text-danger">{error}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';

export default Select;