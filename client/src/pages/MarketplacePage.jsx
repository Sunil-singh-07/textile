import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { SlidersHorizontal } from 'lucide-react';

import { productApi } from '../api/productApi';
import { DEFAULT_PAGE_LIMIT } from '../utils/constants';
import { POPULAR_CATEGORIES } from '../utils/mockLandingData';
import { extractMaterialOptions, applyClientFilters } from '../utils/productFilters';
import useDebouncedValue from '../hooks/useDebouncedValue';

import SearchBar from '../components/ui/SearchBar';
import CategoryChip from '../components/ui/CategoryChip';
import Button from '../components/ui/Button';
import MarketplaceFilters from '../components/marketplace/MarketplaceFilters';
import ProductGrid from '../components/marketplace/ProductGrid';
import FabricAdvisor from '../components/marketplace/FabricAdvisor';

const CATEGORY_NAMES = POPULAR_CATEGORIES.map((c) => c.name);

const MarketplacePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const category = searchParams.get('category') || '';

  // Search stays local (not in the URL) — it's a live-filter box, not a
  // shareable link target the way category is (CategoriesSection already
  // links to /marketplace?category=X).
  const [searchInput, setSearchInput] = useState('');
  const debouncedSearch = useDebouncedValue(searchInput, 400);

  const [priceMin, setPriceMin] = useState('');
  const [priceMax, setPriceMax] = useState('');
  const debouncedPriceMin = useDebouncedValue(priceMin, 400);
  const debouncedPriceMax = useDebouncedValue(priceMax, 400);

  const [page, setPage] = useState(1);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Client-only refinements — see utils/productFilters.js for why these
  // can't be sent to the backend.
  const [selectedMaterials, setSelectedMaterials] = useState([]);
  const [gsmMin, setGsmMin] = useState('');
  const [gsmMax, setGsmMax] = useState('');
  const [inStockOnly, setInStockOnly] = useState(false);

  // Any server-side filter change invalidates the current page number.
  useEffect(() => {
    setPage(1);
  }, [category, debouncedSearch, debouncedPriceMin, debouncedPriceMax]);

  const queryParams = useMemo(() => {
    const params = { page, limit: DEFAULT_PAGE_LIMIT };
    if (category) params.category = category;
    if (debouncedSearch) params.search = debouncedSearch;
    if (debouncedPriceMin) params.minPrice = debouncedPriceMin;
    if (debouncedPriceMax) params.maxPrice = debouncedPriceMax;
    return params;
  }, [category, debouncedSearch, debouncedPriceMin, debouncedPriceMax, page]);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['products', queryParams],
    queryFn: () => productApi.list(queryParams),
    placeholderData: keepPreviousData,
  });

  const products = data?.products ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / DEFAULT_PAGE_LIMIT));

  const materialOptions = useMemo(() => extractMaterialOptions(products), [products]);
  const filteredProducts = useMemo(
    () => applyClientFilters(products, { materials: selectedMaterials, gsmMin, gsmMax, inStockOnly }),
    [products, selectedMaterials, gsmMin, gsmMax, inStockOnly]
  );

  const handleCategoryClick = (name) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (name && name !== category) next.set('category', name);
      else next.delete('category');
      return next;
    });
  };

  const toggleMaterial = (material) => {
    setSelectedMaterials((prev) =>
      prev.includes(material) ? prev.filter((m) => m !== material) : [...prev, material]
    );
  };

  const clearFilters = () => {
    setPriceMin('');
    setPriceMax('');
    setSelectedMaterials([]);
    setGsmMin('');
    setGsmMax('');
    setInStockOnly(false);
  };

  const hasActiveFilters =
    Boolean(priceMin || priceMax || gsmMin || gsmMax || inStockOnly) || selectedMaterials.length > 0;

  const filterPanelProps = {
    priceMin,
    priceMax,
    onPriceMinChange: setPriceMin,
    onPriceMaxChange: setPriceMax,
    materialOptions,
    selectedMaterials,
    onToggleMaterial: toggleMaterial,
    gsmMin,
    gsmMax,
    onGsmMinChange: setGsmMin,
    onGsmMaxChange: setGsmMax,
    inStockOnly,
    onToggleInStock: () => setInStockOnly((v) => !v),
    hasActiveFilters,
    onClearAll: clearFilters,
  };

  return (
    <div className="bg-background">
      <div className="border-b border-border bg-surface/60">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <SearchBar
            value={searchInput}
            onChange={setSearchInput}
            onSubmit={setSearchInput}
            className="max-w-2xl"
          />

          <div className="mt-4 flex items-center gap-2 overflow-x-auto pb-1">
            <CategoryChip label="All Fabrics" selected={!category} onClick={() => handleCategoryClick('')} />
            {CATEGORY_NAMES.map((name) => (
              <CategoryChip
                key={name}
                label={name}
                selected={category === name}
                onClick={() => handleCategoryClick(name)}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-[260px_1fr] lg:gap-8">
          <aside className="hidden lg:block">
            <MarketplaceFilters {...filterPanelProps} />
          </aside>

          <main className="min-w-0">
            <div className="mb-4 flex items-center justify-between gap-3">
              <p className="text-sm text-muted">
                {isLoading
                  ? 'Loading fabrics…'
                  : `${filteredProducts.length} of ${total} fabric${total === 1 ? '' : 's'}`}
              </p>
              <Button
                variant="outline"
                size="sm"
                className="lg:hidden"
                onClick={() => setShowMobileFilters((v) => !v)}
              >
                <SlidersHorizontal className="h-4 w-4" />
                Filters{hasActiveFilters ? ' •' : ''}
              </Button>
            </div>

            {showMobileFilters && (
              <MarketplaceFilters {...filterPanelProps} className="mb-6 lg:hidden" />
            )}

            <ProductGrid
              products={filteredProducts}
              isLoading={isLoading}
              isError={isError}
              page={page}
              totalPages={totalPages}
              onPageChange={setPage}
              onResetFilters={clearFilters}
            />
          </main>
        </div>
      </div>

      <FabricAdvisor />
    </div>
  );
};

export default MarketplacePage;
