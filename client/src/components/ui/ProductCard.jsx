import { motion } from 'framer-motion';
import Badge from './Badge';
import WeavePattern from './WeavePattern';
import { SpecText } from './Typography';
import { formatCurrency } from '../../utils/formatters';

// Mirrors the real Product model (name, category, price, specs{gsm,width,
// composition}, colors[], images[], stock/status) so this drops straight
// into Phase 3 once /products is wired up — only `supplierName` here is a
// display-only convenience, not a field the backend actually returns on
// this endpoint.
const ProductCard = ({ product, className = '' }) => {
  const { name, category, price, specs, colors = [], stock, status, supplierName } = product;
  const isOutOfStock = status === 'out_of_stock' || stock === 0;

  return (
    <motion.article
      whileHover={{ y: -6 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className={`group relative overflow-hidden rounded-2xl border border-border bg-surface shadow-card
        hover:shadow-elevated ${className}`}
    >
      {/* Swatch-card corner fold — the recurring physical-catalogue detail */}
      <div
        className="absolute right-0 top-0 z-10 h-9 w-9 bg-accent-300"
        style={{ clipPath: 'polygon(100% 0, 0 0, 100% 100%)' }}
        aria-hidden="true"
      />

      <div className="relative h-40 w-full overflow-hidden bg-primary-50">
        <WeavePattern color="#6B4F3B" cell={14} opacity={0.14} className="absolute inset-0" />
        {isOutOfStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-ink/40">
            <Badge variant="danger">Out of Stock</Badge>
          </div>
        )}
      </div>

      <div className="p-4">
        <p className="mb-1 font-mono text-[11px] uppercase tracking-widest text-accent-600">
          {category}
        </p>
        <h3 className="mb-0.5 truncate font-display text-lg font-medium text-ink">{name}</h3>
        {supplierName && <p className="mb-2 truncate text-xs text-muted">by {supplierName}</p>}

        {specs && (
          <SpecText className="mb-3 block">
            {specs.gsm && `${specs.gsm} GSM`}
            {specs.gsm && specs.composition && ' · '}
            {specs.composition}
          </SpecText>
        )}

        {colors.length > 0 && (
          <div className="mb-3 flex items-center gap-1.5">
            {colors.slice(0, 5).map((color, i) => (
              <span
                key={i}
                className="h-4 w-4 rounded-full border border-border"
                style={{ backgroundColor: color }}
                title={color}
              />
            ))}
            {colors.length > 5 && (
              <span className="text-xs text-muted">+{colors.length - 5}</span>
            )}
          </div>
        )}

        <div className="flex items-end justify-between border-t border-border pt-3">
          <div>
            <p className="font-display text-lg font-semibold text-primary-700">
              {formatCurrency(price)}
              <span className="text-xs font-sans font-normal text-muted"> /metre</span>
            </p>
          </div>
          {!isOutOfStock && <Badge variant="success">In Stock</Badge>}
        </div>
      </div>
    </motion.article>
  );
};

export default ProductCard;
