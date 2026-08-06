import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, SearchX } from 'lucide-react';
import ProductCard from '../ui/ProductCard';
import { ProductCardSkeleton } from '../ui/Skeleton';
import EmptyState from '../common/EmptyState';
import Button from '../ui/Button';

const SKELETON_COUNT = 8;

const ProductGrid = ({
  products,
  isLoading,
  isError,
  page,
  totalPages,
  onPageChange,
  onResetFilters,
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <EmptyState
        icon={SearchX}
        title="Couldn't load fabrics"
        description="Something went wrong reaching the catalog. Please try again in a moment."
      />
    );
  }

  if (products.length === 0) {
    return (
      <EmptyState
        icon={SearchX}
        title="No fabrics match your filters"
        description="Try widening your price or GSM range, or clearing a filter."
        actionLabel="Clear filters"
        onAction={onResetFilters}
      />
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {products.map((product) => (
          <Link key={product._id} to={`/product/${product._id}`} className="block">
            <ProductCard product={product} />
          </Link>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="mt-8 flex items-center justify-center gap-3">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1}
            onClick={() => onPageChange(page - 1)}
            aria-label="Previous page"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="font-mono text-xs text-muted">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= totalPages}
            onClick={() => onPageChange(page + 1)}
            aria-label="Next page"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </>
  );
};

export default ProductGrid;
