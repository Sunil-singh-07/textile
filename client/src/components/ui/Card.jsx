const VARIANT_CLASSES = {
  flat: 'bg-surface border border-border',
  elevated: 'bg-surface border border-border/60 shadow-card hover:shadow-elevated',
};

const Card = ({ children, className = '', padded = true, variant = 'flat', ...props }) => (
  <div
    className={`rounded-2xl transition-shadow duration-300 ${VARIANT_CLASSES[variant]} ${
      padded ? 'p-5' : ''
    } ${className}`}
    {...props}
  >
    {children}
  </div>
);

export default Card;
