// Type scale, one place. Display (Fraunces) carries personality and is used
// sparingly at large sizes; body (Karla) does the reading work; mono (IBM
// Plex Mono) is reserved for spec-sheet data — GSM, composition %, price per
// metre, order codes — the way a real textile catalogue would set them.

export const Eyebrow = ({ children, className = '' }) => (
  <span
    className={`font-display italic text-sm text-accent-600 tracking-wide ${className}`}
  >
    {children}
  </span>
);

export const Display = ({ children, as: Tag = 'h1', className = '' }) => (
  <Tag
    className={`font-display font-semibold leading-[1.05] tracking-tight text-balance text-ink
      text-4xl sm:text-5xl lg:text-6xl ${className}`}
  >
    {children}
  </Tag>
);

export const Heading = ({ children, as: Tag = 'h2', className = '' }) => (
  <Tag
    className={`font-display font-semibold leading-tight tracking-tight text-balance text-ink
      text-3xl sm:text-4xl ${className}`}
  >
    {children}
  </Tag>
);

export const Subheading = ({ children, as: Tag = 'h3', className = '' }) => (
  <Tag className={`font-display font-medium leading-snug text-ink text-lg ${className}`}>
    {children}
  </Tag>
);

export const Lede = ({ children, className = '' }) => (
  <p className={`text-lg leading-relaxed text-muted ${className}`}>{children}</p>
);

export const Text = ({ children, className = '' }) => (
  <p className={`text-sm leading-relaxed text-muted ${className}`}>{children}</p>
);

// For spec-sheet style data: "280 GSM · 60% Cotton / 40% Poly"
export const SpecText = ({ children, className = '' }) => (
  <span className={`font-mono text-xs tracking-tight text-muted ${className}`}>{children}</span>
);
