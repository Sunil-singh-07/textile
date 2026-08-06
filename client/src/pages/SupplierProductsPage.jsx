import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import {
  ChevronLeft,
  ChevronRight,
  Pencil,
  Trash2,
  Plus,
  PackageSearch,
  AlertTriangle,
} from 'lucide-react';
import { toast } from 'sonner';

import { productApi } from '../api/productApi';
import { useAuth } from '../hooks/useAuth';
import { DEFAULT_PAGE_LIMIT } from '../utils/constants';
import { POPULAR_CATEGORIES } from '../utils/mockLandingData';
import { formatCurrency } from '../utils/formatters';
import useDebouncedValue from '../hooks/useDebouncedValue';

import PageContainer from '../components/common/PageContainer';
import EmptyState from '../components/common/EmptyState';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import SearchBar from '../components/ui/SearchBar';
import CategoryChip from '../components/ui/CategoryChip';
import Skeleton from '../components/ui/Skeleton';
import WeavePattern from '../components/ui/WeavePattern';
import { SpecText } from '../components/ui/Typography';

const CATEGORY_NAMES = POPULAR_CATEGORIES.map((c) => c.name);

// A small woven swatch stands in for a thumbnail — the same catalog cue
// ProductCard uses at full size — so a product row reads as a fabric
// listing, not a spreadsheet line.
const SwatchThumb = () => (
  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-primary-50">
    <WeavePattern color="#6B4F3B" cell={9} opacity={0.16} className="absolute inset-0" />
  </div>
);

// Inline stock editor + delete confirmation for a single product row. Kept
// local to this file (not a shared UI component) since it's only ever used
// in this one list.
const ProductRow = ({ product, onDeleted }) => {
  const queryClient = useQueryClient();
  const [stockValue, setStockValue] = useState(String(product.stock));
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  const invalidateProductQueries = () => {
    queryClient.invalidateQueries({ queryKey: ['products'] });
    queryClient.invalidateQueries({ queryKey: ['dashboard', 'supplier'] });
  };

  const stockMutation = useMutation({
    mutationFn: (stock) => productApi.updateStock(product._id, stock),
    onSuccess: () => {
      toast.success('Stock updated');
      invalidateProductQueries();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => productApi.remove(product._id),
    onSuccess: () => {
      toast.success('Product deleted');
      invalidateProductQueries();
      onDeleted?.();
    },
  });

  const isOutOfStock = product.status === 'out_of_stock' || product.stock === 0;
  const stockChanged = Number(stockValue) !== product.stock;

  const handleStockSave = () => {
    const nextStock = Number(stockValue);
    if (Number.isNaN(nextStock) || nextStock < 0) {
      toast.error('Stock must be a non-negative number');
      return;
    }
    stockMutation.mutate(nextStock);
  };

  return (
    <Card variant="elevated" className="flex flex-wrap items-center gap-4">
      <SwatchThumb />

      <div className="min-w-0 flex-1">
        <p className="mb-0.5 font-mono text-[11px] uppercase tracking-widest text-accent-600">
          {product.category}
        </p>
        <p className="truncate font-display text-base font-medium text-ink">{product.name}</p>
        <div className="mt-1 flex flex-wrap items-baseline gap-x-3 gap-y-0.5">
          <p className="font-display text-sm font-semibold text-primary-700">
            {formatCurrency(product.price)}
            <span className="text-xs font-sans font-normal text-muted"> /metre</span>
          </p>
          {product.specs?.gsm && <SpecText>{product.specs.gsm} GSM</SpecText>}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Input
          type="number"
          min="0"
          value={stockValue}
          onChange={(e) => setStockValue(e.target.value)}
          className="w-24"
          aria-label={`Stock for ${product.name}`}
        />
        <Button
          variant="outline"
          size="sm"
          disabled={!stockChanged}
          isLoading={stockMutation.isPending}
          onClick={handleStockSave}
        >
          Update Stock
        </Button>
      </div>

      <Badge variant={isOutOfStock ? 'danger' : 'success'}>
        {isOutOfStock ? 'Out of Stock' : 'In Stock'}
      </Badge>

      <div className="flex items-center gap-2">
        <Link to={`/supplier/products/${product._id}/edit`}>
          <Button variant="ghost" size="sm">
            <Pencil className="h-4 w-4" />
            Edit
          </Button>
        </Link>

        {confirmingDelete ? (
          <div className="flex items-center gap-1.5">
            <Button
              variant="danger"
              size="sm"
              isLoading={deleteMutation.isPending}
              onClick={() => deleteMutation.mutate()}
            >
              Confirm
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setConfirmingDelete(false)}>
              Cancel
            </Button>
          </div>
        ) : (
          <Button variant="ghost" size="sm" onClick={() => setConfirmingDelete(true)}>
            <Trash2 className="h-4 w-4" />
            Delete
          </Button>
        )}
      </div>
    </Card>
  );
};

const ProductRowSkeleton = () => (
  <Card className="flex items-center gap-4">
    <Skeleton className="h-14 w-14 shrink-0 rounded-xl" />
    <div className="min-w-0 flex-1 space-y-2">
      <Skeleton className="h-3 w-1/4" />
      <Skeleton className="h-4 w-1/3" />
    </div>
    <Skeleton className="h-9 w-32 rounded-lg" />
    <Skeleton className="h-6 w-20 rounded-full" />
  </Card>
);

const SupplierProductsPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [category, setCategory] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const debouncedSearch = useDebouncedValue(searchInput, 400);
  const [page, setPage] = useState(1);

  useEffect(() => {
    setPage(1);
  }, [category, debouncedSearch]);

  const queryParams = useMemo(() => {
    const params = { supplierId: user?.id, page, limit: DEFAULT_PAGE_LIMIT };
    if (category) params.category = category;
    if (debouncedSearch) params.search = debouncedSearch;
    return params;
  }, [user?.id, category, debouncedSearch, page]);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['products', 'mine', queryParams],
    queryFn: () => productApi.list(queryParams),
    enabled: Boolean(user?.id),
    placeholderData: keepPreviousData,
  });

  const products = data?.products ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / DEFAULT_PAGE_LIMIT));
  const hasFilters = Boolean(category || debouncedSearch);

  const addProductButton = (
    <Link to="/supplier/products/new">
      <Button>
        <Plus className="h-4 w-4" />
        Add Product
      </Button>
    </Link>
  );

  return (
    <PageContainer
      title="My Products"
      description={isLoading ? 'Loading your catalog…' : `${total} product${total === 1 ? '' : 's'} listed`}
    >
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <SearchBar
          value={searchInput}
          onChange={setSearchInput}
          onSubmit={setSearchInput}
          placeholder="Search your products…"
          className="max-w-md"
        />
        {addProductButton}
      </div>

      <div className="mb-6 flex items-center gap-2 overflow-x-auto pb-1">
        <CategoryChip label="All Categories" selected={!category} onClick={() => setCategory('')} />
        {CATEGORY_NAMES.map((name) => (
          <CategoryChip
            key={name}
            label={name}
            selected={category === name}
            onClick={() => setCategory(name === category ? '' : name)}
          />
        ))}
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <ProductRowSkeleton key={i} />
          ))}
        </div>
      ) : isError ? (
        <EmptyState
          icon={AlertTriangle}
          title="Couldn't load your products"
          description="Something went wrong reaching the server. Please try again in a moment."
        />
      ) : products.length === 0 ? (
        <EmptyState
          icon={PackageSearch}
          title={hasFilters ? 'No products match your filters' : 'No products yet'}
          description={
            hasFilters
              ? 'Try a different search term or category.'
              : 'List your first fabric to start selling on the marketplace.'
          }
          actionLabel={hasFilters ? 'Clear filters' : 'Add Product'}
          onAction={
            hasFilters
              ? () => {
                  setCategory('');
                  setSearchInput('');
                }
              : () => navigate('/supplier/products/new')
          }
        />
      ) : (
        <>
          <div className="space-y-3">
            {products.map((product) => (
              <ProductRow key={product._id} product={product} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-3">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
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
                onClick={() => setPage((p) => p + 1)}
                aria-label="Next page"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </>
      )}
    </PageContainer>
  );
};

export default SupplierProductsPage;
