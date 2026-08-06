import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ShoppingBag, AlertTriangle, PackageCheck } from 'lucide-react';
import { toast } from 'sonner';

import { cartApi } from '../api/cartApi';
import { orderApi } from '../api/orderApi';
import { checkoutSchema } from '../utils/orderSchemas';
import { calculateCartTotal, formatCurrency } from '../utils/formatters';

import PageContainer from '../components/common/PageContainer';
import EmptyState from '../components/common/EmptyState';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Skeleton from '../components/ui/Skeleton';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [formError, setFormError] = useState('');

  const { data, isLoading, isError } = useQuery({
    queryKey: ['cart'],
    queryFn: cartApi.get,
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(checkoutSchema) });

  const placeOrderMutation = useMutation({
    mutationFn: (shippingInfo) => orderApi.place(shippingInfo),
    onSuccess: (result) => {
      const count = result.orders?.length ?? 0;
      toast.success(
        count > 1 ? `${count} orders placed — split across suppliers` : 'Order placed successfully'
      );
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      navigate('/orders', { replace: true });
    },
    onError: (err) => {
      setFormError(err.message || 'Something went wrong placing your order.');
    },
  });

  const onSubmit = (values) => {
    setFormError('');
    placeOrderMutation.mutate(values);
  };

  const items = data?.cart?.items ?? [];
  const total = calculateCartTotal(items);
  const hasOutOfStockItem = items.some(
    (item) => item.productId && (item.productId.status === 'out_of_stock' || item.productId.stock === 0)
  );
  const hasMissingProduct = items.some((item) => !item.productId);

  if (isLoading) {
    return (
      <PageContainer title="Checkout">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
          <Card className="space-y-4">
            <Skeleton className="h-10 w-full rounded-lg" />
            <Skeleton className="h-10 w-full rounded-lg" />
            <Skeleton className="h-10 w-full rounded-lg" />
          </Card>
          <Card>
            <Skeleton className="h-32 w-full rounded-lg" />
          </Card>
        </div>
      </PageContainer>
    );
  }

  if (isError) {
    return (
      <PageContainer title="Checkout">
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
      <PageContainer title="Checkout">
        <EmptyState
          icon={ShoppingBag}
          title="Your cart is empty"
          description="Add fabrics to your cart before checking out."
          actionLabel="Browse Marketplace"
          onAction={() => navigate('/marketplace')}
        />
      </PageContainer>
    );
  }

  return (
    <PageContainer title="Checkout" description="Confirm your shipping details to place your order.">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
        <Card>
          <h2 className="mb-4 font-display text-lg font-medium text-ink">Shipping Details</h2>

          {(formError || hasOutOfStockItem || hasMissingProduct) && (
            <p role="alert" className="mb-4 rounded-lg bg-danger-100 px-3.5 py-2.5 text-sm text-danger">
              {formError ||
                (hasOutOfStockItem
                  ? 'Some items in your cart are out of stock. Please return to your cart to remove them.'
                  : 'Some items in your cart are no longer available. Please return to your cart to remove them.')}
            </p>
          )}

          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
            <Input
              label="Full name"
              placeholder="Your name or business contact"
              error={errors.name?.message}
              {...register('name')}
            />
            <Input
              label="Shipping address"
              placeholder="Street, city, state, postal code"
              error={errors.address?.message}
              {...register('address')}
            />
            <Input
              label="Phone number"
              type="tel"
              placeholder="For delivery coordination"
              error={errors.phone?.message}
              {...register('phone')}
            />

            <Button
              type="submit"
              size="lg"
              className="w-full"
              isLoading={isSubmitting || placeOrderMutation.isPending}
              disabled={hasOutOfStockItem || hasMissingProduct}
            >
              <PackageCheck className="h-4 w-4" />
              Place Order
            </Button>
          </form>
        </Card>

        <Card className="h-fit lg:sticky lg:top-24">
          <h2 className="font-display text-lg font-medium text-ink">Order Summary</h2>
          <div className="mt-4 max-h-72 space-y-3 overflow-y-auto pr-1">
            {items.map((item) => (
              <div key={item.productId?._id ?? Math.random()} className="flex items-center justify-between gap-3 text-sm">
                <div className="min-w-0">
                  <p className="truncate text-ink">{item.productId?.name ?? 'Unavailable product'}</p>
                  <p className="font-mono text-xs text-muted">Qty {item.quantity}</p>
                </div>
                <p className="shrink-0 font-mono text-xs text-muted">
                  {formatCurrency((item.productId?.price ?? 0) * item.quantity)}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
            <span className="text-sm font-medium text-ink">Total</span>
            <span className="font-display text-lg font-semibold text-primary-700">
              {formatCurrency(total)}
            </span>
          </div>
          <Link
            to="/cart"
            className="mt-4 block text-center text-sm font-medium text-primary hover:underline"
          >
            Edit cart
          </Link>
        </Card>
      </div>
    </PageContainer>
  );
};

export default CheckoutPage;
