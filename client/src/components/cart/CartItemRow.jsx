import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2, ImageOff } from 'lucide-react';
import Badge from '../ui/Badge';
import Spinner from '../ui/Spinner';
import WeavePattern from '../ui/WeavePattern';
import { formatCurrency } from '../../utils/formatters';

// item shape: { productId: { _id, name, price, images, stock, status } | null, quantity }
// productId can come back null if the product was deleted after being added
// to the cart — the populate() just yields null in that case, not an error.
const CartItemRow = ({ item, onQuantityChange, onRemove, isUpdating = false }) => {
  const product = item.productId;
  const thumbnail = product?.images?.[0];

  if (!product) {
    return (
      <div className="flex items-center gap-4 border-b border-border py-4 last:border-b-0">
        <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl bg-primary-50">
          <ImageOff className="h-5 w-5 text-muted" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-ink">This product is no longer available</p>
          <p className="text-xs text-muted">It may have been removed by the supplier.</p>
        </div>
        <button
          type="button"
          onClick={() => onRemove(null)}
          aria-label="Remove item"
          className="shrink-0 rounded-full p-2 text-muted transition-colors hover:bg-danger-100 hover:text-danger"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    );
  }

  const isOutOfStock = product.status === 'out_of_stock' || product.stock === 0;
  const atMaxStock = item.quantity >= product.stock;

  return (
    <div className="flex items-center gap-4 border-b border-border py-4 last:border-b-0">
      <Link
        to={`/product/${product._id}`}
        className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-border bg-primary-50"
      >
        {thumbnail ? (
          <img src={thumbnail} alt={product.name} className="h-full w-full object-cover" />
        ) : (
          <WeavePattern color="#6B4F3B" cell={10} opacity={0.14} className="absolute inset-0" />
        )}
      </Link>

      <div className="min-w-0 flex-1">
        <Link
          to={`/product/${product._id}`}
          className="truncate font-display text-sm font-medium text-ink hover:text-primary-700"
        >
          {product.name}
        </Link>
        <p className="mt-0.5 font-mono text-xs text-muted">
          {formatCurrency(product.price)} <span className="font-sans">/metre</span>
        </p>
        {isOutOfStock ? (
          <Badge variant="danger" className="mt-1.5">
            Out of Stock
          </Badge>
        ) : atMaxStock ? (
          <p className="mt-1.5 text-xs text-warning">Only {product.stock} in stock</p>
        ) : null}
      </div>

      <div className="flex shrink-0 items-center gap-1 rounded-full border border-border bg-background p-1">
        <button
          type="button"
          onClick={() => onQuantityChange(product._id, item.quantity - 1)}
          disabled={isUpdating || item.quantity <= 1}
          aria-label="Decrease quantity"
          className="rounded-full p-1.5 text-ink transition-colors hover:bg-primary-50 disabled:cursor-not-allowed disabled:opacity-30"
        >
          <Minus className="h-3.5 w-3.5" />
        </button>
        <span className="w-6 text-center font-mono text-sm text-ink">
          {isUpdating ? <Spinner size="sm" className="mx-auto" /> : item.quantity}
        </span>
        <button
          type="button"
          onClick={() => onQuantityChange(product._id, item.quantity + 1)}
          disabled={isUpdating || isOutOfStock || atMaxStock}
          aria-label="Increase quantity"
          className="rounded-full p-1.5 text-ink transition-colors hover:bg-primary-50 disabled:cursor-not-allowed disabled:opacity-30"
        >
          <Plus className="h-3.5 w-3.5" />
        </button>
      </div>

      <p className="w-24 shrink-0 text-right font-display text-sm font-semibold text-primary-700">
        {formatCurrency(product.price * item.quantity)}
      </p>

      <button
        type="button"
        onClick={() => onRemove(product._id)}
        aria-label={`Remove ${product.name} from cart`}
        className="shrink-0 rounded-full p-2 text-muted transition-colors hover:bg-danger-100 hover:text-danger"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
};

export default CartItemRow;
