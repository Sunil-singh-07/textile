import { useMemo, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  ChevronRight,
  Minus,
  Plus,
  ShoppingCart,
  ShieldCheck,
  Layers,
  Ruler,
  Percent,
  MapPin,
  AlertTriangle,
} from 'lucide-react';
import { toast } from 'sonner';

import { productApi } from '../api/productApi';
import axiosClient from '../api/axiosClient';
import { cartApi } from '../api/cartApi';
import { formatCurrency } from '../utils/formatters';

import PageContainer from '../components/common/PageContainer';
import EmptyState from '../components/common/EmptyState';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Skeleton, { ProductCardSkeleton } from '../components/ui/Skeleton';
import WeavePattern from '../components/ui/WeavePattern';
import ProductCard from '../components/ui/ProductCard';
import { Eyebrow, Heading, SpecText } from '../components/ui/Typography';

// A textile spec sheet, not a fashion product page — GSM, composition,
// width, and MOQ are load-bearing sourcing data for a B2B buyer, so each
// gets its own labeled card rather than being folded into a description.
const SpecCard = ({ icon: Icon, label, value }) => (
  <div className="rounded-xl border border-border bg-background p-4">
    <div className="mb-1.5 flex items-center gap-1.5 text-muted">
      <Icon className="h-3.5 w-3.5" />
      <span className="text-xs font-medium uppercase tracking-wide">{label}</span>
    </div>
    <p className="font-mono text-sm font-medium text-ink">{value}</p>
  </div>
);

const ProductGallery = ({ images = [], name }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const hasImages = images.length > 0;

  return (
    <div>
      <div className="relative aspect-square w-full overflow-hidden rounded-2xl border border-border bg-primary-50">
        {hasImages ? (
          <img
            src={images[activeIndex]}
            alt={name}
            className="h-full w-full object-cover"
          />
        ) : (
          <WeavePattern color="#6B4F3B" cell={22} opacity={0.16} className="absolute inset-0" />
        )}
      </div>

      {images.length > 1 && (
        <div className="mt-3 grid grid-cols-5 gap-3">
          {images.map((src, i) => (
            <button
              key={src + i}
              type="button"
              onClick={() => setActiveIndex(i)}
              className={`aspect-square overflow-hidden rounded-lg border-2 transition-colors ${
                i === activeIndex ? 'border-primary' : 'border-border hover:border-accent-500'
              }`}
              aria-label={`View image ${i + 1}`}
            >
              <img src={src} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [quantity, setQuantity] = useState(1);

  const {
    data: productData,
    isLoading: isProductLoading,
    isError: isProductError,
    error: productError,
  } = useQuery({
    queryKey: ['product', id],
    queryFn: () => productApi.getById(id),
  });

  const product = productData?.product;

  // A supplier who hasn't finished onboarding yet has no SupplierProfile
  // document, so GET /suppliers/:id legitimately 404s — that's an expected
  // state here (rendered as "profile not available"), not a real error, so
  // this bypasses supplierApi's wrapper to pass skipErrorToast and avoid
  // surfacing a misleading toast on an otherwise normal product page view.
  const { data: supplierData, isLoading: isSupplierLoading } = useQuery({
    queryKey: ['supplier', product?.supplierId],
    queryFn: () =>
      axiosClient
        .get(`/suppliers/${product.supplierId}`, { skipErrorToast: true })
        .then((res) => res.data),
    enabled: !!product?.supplierId,
    retry: false,
  });

  const { data: relatedData, isLoading: isRelatedLoading } = useQuery({
    queryKey: ['products', 'related', product?.category, id],
    queryFn: () => productApi.list({ category: product.category, limit: 5 }),
    enabled: !!product?.category,
  });

  const addToCartMutation = useMutation({
    mutationFn: () => cartApi.addItem(product._id, quantity),
    onSuccess: () => {
      toast.success(`Added ${quantity} ${quantity === 1 ? 'unit' : 'units'} to your cart`);
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });

  const relatedProducts = useMemo(
    () => (relatedData?.products ?? []).filter((p) => p._id !== id).slice(0, 4),
    [relatedData, id]
  );

  if (isProductLoading) {
    return (
      <PageContainer>
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
          <Skeleton className="aspect-square w-full rounded-2xl" />
          <div className="space-y-4">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-32 w-full rounded-xl" />
          </div>
        </div>
      </PageContainer>
    );
  }

  if (isProductError || !product) {
    return (
      <PageContainer>
        <EmptyState
          icon={AlertTriangle}
          title={productError?.status === 404 ? 'Fabric not found' : "Couldn't load this fabric"}
          description={
            productError?.status === 404
              ? "This product doesn't exist or may have been removed."
              : 'Something went wrong reaching the server. Please try again in a moment.'
          }
          actionLabel="Back to Marketplace"
          onAction={() => navigate('/marketplace')}
        />
      </PageContainer>
    );
  }

  const { name, category, description, price, specs, colors = [], stock, status, images = [], supplierId } = product;
  const isOutOfStock = status === 'out_of_stock' || stock === 0;
  const supplierProfile = supplierData?.profile;

  return (
    <PageContainer>
      <nav className="mb-6 flex items-center gap-1.5 text-xs text-muted">
        <Link to="/marketplace" className="hover:text-primary">
          Marketplace
        </Link>
        <ChevronRight className="h-3 w-3" />
        <Link to={`/marketplace?category=${encodeURIComponent(category)}`} className="hover:text-primary">
          {category}
        </Link>
        <ChevronRight className="h-3 w-3" />
        <span className="truncate text-ink">{name}</span>
      </nav>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        <ProductGallery images={images} name={name} />

        <div>
          <Eyebrow>{category}</Eyebrow>
          <Heading as="h1" className="mt-2">
            {name}
          </Heading>

          <div className="mt-4 flex items-center gap-3">
            <p className="font-display text-2xl font-semibold text-primary-700">
              {formatCurrency(price)}
              <span className="text-sm font-sans font-normal text-muted"> /metre</span>
            </p>
            {isOutOfStock ? (
              <Badge variant="danger">Out of Stock</Badge>
            ) : (
              <Badge variant="success">In Stock · {stock} m available</Badge>
            )}
          </div>

          {description && <p className="mt-4 text-sm leading-relaxed text-muted">{description}</p>}

          {/* Fabric specification sheet — the core sourcing data a B2B buyer
              needs, given equal visual weight to price rather than buried
              in a description paragraph. */}
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {specs?.gsm && <SpecCard icon={Layers} label="GSM" value={`${specs.gsm} g/m²`} />}
            {specs?.width && <SpecCard icon={Ruler} label="Width" value={specs.width} />}
            {specs?.composition && (
              <SpecCard icon={Percent} label="Composition" value={specs.composition} />
            )}
            {supplierProfile?.moq && <SpecCard icon={ShieldCheck} label="MOQ" value={supplierProfile.moq} />}
          </div>

          {colors.length > 0 && (
            <div className="mt-6">
              <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted">
                Available Colors
              </p>
              <div className="flex flex-wrap items-center gap-2">
                {colors.map((color, i) => (
                  <span
                    key={i}
                    className="h-7 w-7 rounded-full border border-border"
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>
            </div>
          )}

          <Card className="mt-6 flex flex-wrap items-center gap-4" padded>
            <div className="flex items-center gap-1 rounded-full border border-border bg-background p-1">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                disabled={isOutOfStock || quantity <= 1}
                aria-label="Decrease quantity"
                className="rounded-full p-2 text-ink transition-colors hover:bg-primary-50 disabled:cursor-not-allowed disabled:opacity-30"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-10 text-center font-mono text-sm text-ink">{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.min(stock, q + 1))}
                disabled={isOutOfStock || quantity >= stock}
                aria-label="Increase quantity"
                className="rounded-full p-2 text-ink transition-colors hover:bg-primary-50 disabled:cursor-not-allowed disabled:opacity-30"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>

            <Button
              size="lg"
              className="flex-1"
              disabled={isOutOfStock}
              isLoading={addToCartMutation.isPending}
              onClick={() => addToCartMutation.mutate()}
            >
              <ShoppingCart className="h-4 w-4" />
              {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
            </Button>
          </Card>

          {/* Supplier information — foregrounded, not a footnote, since
              sourcing decisions in B2B textiles hinge on who's selling. */}
          <div className="mt-6">
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted">Sold by</p>
            {isSupplierLoading ? (
              <Skeleton className="h-24 w-full rounded-2xl" />
            ) : supplierProfile ? (
              <Link to={`/supplier/${supplierId}`}>
                <Card variant="elevated">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-display text-base font-medium text-ink">
                      {supplierProfile.businessName}
                    </h3>
                    <ChevronRight className="h-4 w-4 shrink-0 text-muted" />
                  </div>
                  {(supplierProfile.categories?.length > 0 || supplierProfile.fabricTypes?.length > 0) && (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {[...(supplierProfile.categories ?? []), ...(supplierProfile.fabricTypes ?? [])]
                        .slice(0, 4)
                        .map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full bg-primary-50 px-2.5 py-1 text-xs font-medium text-primary-700"
                          >
                            {tag}
                          </span>
                        ))}
                    </div>
                  )}
                  {supplierProfile.moq && (
                    <SpecText className="mt-3 block">MOQ: {supplierProfile.moq}</SpecText>
                  )}
                </Card>
              </Link>
            ) : (
              <Card className="flex items-center gap-2 text-sm text-muted">
                <MapPin className="h-4 w-4" />
                Supplier profile not available yet.
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Related fabrics */}
      {(isRelatedLoading || relatedProducts.length > 0) && (
        <div className="mt-16 border-t border-border pt-10">
          <Heading as="h2" className="mb-6 text-2xl">
            More in {category}
          </Heading>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {isRelatedLoading
              ? Array.from({ length: 4 }).map((_, i) => <ProductCardSkeleton key={i} />)
              : relatedProducts.map((related) => (
                  <Link key={related._id} to={`/product/${related._id}`}>
                    <ProductCard product={related} />
                  </Link>
                ))}
          </div>
        </div>
      )}
    </PageContainer>
  );
};

export default ProductDetailPage;
