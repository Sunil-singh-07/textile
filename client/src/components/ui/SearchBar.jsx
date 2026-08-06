import { Search } from 'lucide-react';

const SearchBar = ({
  value,
  onChange,
  onSubmit,
  placeholder = 'Search cotton, linen, denim…',
  className = '',
}) => (
  <form
    onSubmit={(e) => {
      e.preventDefault();
      onSubmit?.(value);
    }}
    className={`flex w-full items-center gap-2 rounded-full border border-border bg-surface
      p-1.5 pl-5 shadow-card focus-within:border-accent-500 focus-within:ring-2
      focus-within:ring-accent-500/25 ${className}`}
    role="search"
  >
    <Search className="h-4 w-4 shrink-0 text-muted" />
    <input
      type="search"
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      placeholder={placeholder}
      aria-label="Search fabrics"
      className="w-full bg-transparent text-sm text-ink placeholder:text-muted/70 focus:outline-none"
    />
    <button
      type="submit"
      className="shrink-0 rounded-full bg-primary px-5 py-2 text-sm font-medium text-background
        transition-colors hover:bg-primary-700"
    >
      Search
    </button>
  </form>
);

export default SearchBar;
