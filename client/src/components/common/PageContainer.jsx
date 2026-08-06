const PageContainer = ({ children, className = '', title, description }) => (
  <div className={`mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-8 ${className}`}>
    {(title || description) && (
      <div className="mb-6">
        {title && <h1 className="font-display text-xl font-semibold text-ink">{title}</h1>}
        {description && <p className="mt-1 text-sm text-muted">{description}</p>}
      </div>
    )}
    {children}
  </div>
);

export default PageContainer;
