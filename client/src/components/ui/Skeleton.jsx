// Warm-toned shimmer skeletons — same shape contract as the real content
// they stand in for (ProductCard/SupplierCard skeletons below), so lists
// don't jump when data arrives.
const Skeleton = ({ className = '' }) => (
  <div
    className={`animate-shimmer rounded-lg bg-primary-50 bg-[length:400px_100%] ${className}`}
    style={{
      backgroundImage:
        'linear-gradient(90deg, rgba(237,229,221,0.6) 0%, rgba(255,254,252,0.9) 50%, rgba(237,229,221,0.6) 100%)',
    }}
  />
);

export const ProductCardSkeleton = () => (
  <div className="rounded-2xl border border-border bg-surface p-4">
    <Skeleton className="mb-4 h-40 w-full rounded-xl" />
    <Skeleton className="mb-2 h-4 w-3/4" />
    <Skeleton className="mb-4 h-3 w-1/2" />
    <Skeleton className="h-4 w-1/3" />
  </div>
);

export const SupplierCardSkeleton = () => (
  <div className="rounded-2xl border border-border bg-surface p-5">
    <Skeleton className="mb-3 h-5 w-2/3" />
    <Skeleton className="mb-2 h-3 w-full" />
    <Skeleton className="h-3 w-1/2" />
  </div>
);

export default Skeleton;
