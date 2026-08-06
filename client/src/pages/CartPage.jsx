import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ShoppingBag, ArrowRight, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

import { cartApi } from '../api/cartApi';
import { useAuth } from '../hooks/useAuth';
import { ROLES } from '../utils/constants';
import { calculateCartTotal, formatCurrency } from '../utils/formatters';

import PageContainer from '../components/common/PageContainer';
import EmptyState from '../components/common/EmptyState';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Skeleton from '../components/ui/Skeleton';
import CartItemRow from '../components/cart/CartItemRow';

const CartSkeleton = () => (
  <Card>
    {Array.from({ length: 3 }).map((_, i) => (
      <div key={i} className="flex items-center gap-4 border-b border-border py-4 last:border-b-0">
        <Skeleton className="h-20 w-20 shrink-0 rounded-xl" />
        <div className="min-w-0 flex-1 space-y-2">
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-3 w-1/4" />
        </div>
        <Skeleton className="h-9 w-24 shrink-0 rounded-full" />
      </div>
    ))}
  </Card>
);

const CartPage = () => {
  const { isAuthenticated, role } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [pendingProductId, setPendingProductId] = useState(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['cart'],
    queryFn: cartApi.get,
  });

  const invalidateCart = () => queryClient.invalidateQueries({ queryKey: ['cart'] });

  const updateMutation = useMutation({
    mutationFn: ({ productId, quantity }) => cartApi.updateItem(productId, quantity),
    onMutate: ({ productId }) => setPendingProductId(productId),
    onSuccess: invalidateCart,
    onSettled: () => setPendingProductId(null),
  });

  const removeMutation = useMutation({
    mutationFn: (productId) => cartApi.removeItem(productId),
    onMutate: (productId) => setPendingProductId(productId),
    onSuccess: () => {
      invalidateCart();
      toast.success('Removed from cart');
    },
    onSettled: () => setPendingProductId(null),
  });

  const handleQuantityChange = (productId, nextQuantity) => {
    if (nextQuantity < 1) return;
    updateMutation.mutate({ productId, quantity: nextQuantity });
  };

  const items = data?.cart?.items ?? [];
  const total = calculateCartTotal(items);
  const hasOutOfStockItem = items.some(
    (item) => item.productId && (item.productId.status === 'out_of_stock' || item.productId.stock === 0)
  );
  const isSupplier = isAuthenticated && role === ROLES.SUPPLIER;

  if (isLoading) {
    return (
      <PageContainer title="Your Cart">
        <CartSkeleton />
      </PageContainer>
    );
  }

  if (isError) {
    return (
      <PageContainer title="Your Cart">
        <EmptyState
          icon={AlertTriangle}
          title="Couldn't load your cart"
          description="Something went wrong reaching the server. Please try again in a moment."
        />
      </PageContainer>
    );
  }

  if (items.length === 0) {
    return (
      <PageContainer title="Your Cart">
        <EmptyState
          icon={ShoppingBag}
          title="Your cart is empty"
          description="Browse the marketplace to find fabrics for your next order."
          actionLabel="Browse Marketplace"
          onAction={() => navigate('/marketplace')}
        />
      </PageContainer>
    );
  }

  return (
    <PageContainer title="Your Cart" description={`${items.length} item${items.length === 1 ? '' : 's'} in your cart`}>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
        <Card>
          {items.map((item) => (
            <CartItemRow
              key={item.productId?._id ?? Math.random()}
              item={item}
              onQuantityChange={handleQuantityChange}
              onRemove={(productId) => removeMutation.mutate(productId)}
              isUpdating={
                pendingProductId === item.productId?._id &&
                (updateMutation.isPending || removeMutation.isPending)
              }
            />
          ))}
        </Card>

        <Card className="h-fit lg:sticky lg:top-24">
          <h2 className="font-display text-lg font-medium text-ink">Order Summary</h2>
          <div className="mt-4 flex items-center justify-between border-t border-border pt-4 text-sm">
            <span className="text-muted">Subtotal</span>
            <span className="font-mono font-medium text-ink">{formatCurrency(total)}</span>
          </div>
          <p className="mt-1 text-xs text-muted">Shipping and taxes calculated at checkout.</p>

          {hasOutOfStockItem && (
            <p className="mt-3 flex items-start gap-1.5 rounded-lg bg-danger-100 px-3 py-2 text-xs text-danger">
              <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              Remove out-of-stock items before checking out.
            </p>
          )}

          {isSupplier && (
            <p className="mt-3 rounded-lg bg-warning-100 px-3 py-2 text-xs text-warning">
              Checkout is available for buyer accounts only.
            </p>
          )}

          <Button
            size="lg"
            className="mt-4 w-full"
            disabled={hasOutOfStockItem || isSupplier}
            onClick={() => navigate('/checkout')}
          >
            Proceed to Checkout
            <ArrowRight className="h-4 w-4" />
          </Button>

          <Link
            to="/marketplace"
            className="mt-3 block text-center text-sm font-medium text-primary hover:underline"
          >
            Continue shopping
          </Link>
        </Card>
      </div>
    </PageContainer>
  );
};

export default CartPage;
