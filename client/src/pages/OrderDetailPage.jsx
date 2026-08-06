import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { AlertTriangle, Check, MapPin, Phone, User } from 'lucide-react';

import { orderApi } from '../api/orderApi';
import { ORDER_STATUS_SEQUENCE, ORDER_STATUS_LABELS } from '../utils/constants';
import { formatCurrency, formatDate } from '../utils/formatters';

import PageContainer from '../components/common/PageContainer';
import EmptyState from '../components/common/EmptyState';
import Card from '../components/ui/Card';
import Skeleton from '../components/ui/Skeleton';

const OrderStatusTracker = ({ status }) => {
  const currentIndex = ORDER_STATUS_SEQUENCE.indexOf(status);

  return (
    <div className="flex items-center">
      {ORDER_STATUS_SEQUENCE.map((step, i) => {
        const isComplete = i <= currentIndex;
        const isLast = i === ORDER_STATUS_SEQUENCE.length - 1;
        return (
          <div key={step} className={`flex items-center ${isLast ? '' : 'flex-1'}`}>
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={`flex h-7 w-7 items-center justify-center rounded-full border-2 text-xs font-semibold ${
                  isComplete
                    ? 'border-primary bg-primary text-background'
                    : 'border-border bg-surface text-muted'
                }`}
              >
                {isComplete ? <Check className="h-3.5 w-3.5" /> : i + 1}
              </div>
              <span
                className={`hidden text-center text-[11px] font-medium sm:block ${
                  isComplete ? 'text-ink' : 'text-muted'
                }`}
                style={{ maxWidth: '5.5rem' }}
              >
                {ORDER_STATUS_LABELS[step]}
              </span>
            </div>
            {!isLast && (
              <div className={`mx-1 h-0.5 flex-1 rounded ${isComplete && i < currentIndex ? 'bg-primary' : 'bg-border'}`} />
            )}
          </div>
        );
      })}
    </div>
  );
};

const OrderDetailPage = () => {
  const { id } = useParams();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['orders', id],
    queryFn: () => orderApi.getById(id),
  });

  if (isLoading) {
    return (
      <PageContainer title="Order Details">
        <Card className="space-y-4">
          <Skeleton className="h-6 w-1/3" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-24 w-full" />
        </Card>
      </PageContainer>
    );
  }

  if (isError) {
    return (
      <PageContainer title="Order Details">
        <EmptyState
          icon={AlertTriangle}
          title={error?.status === 404 ? 'Order not found' : "Couldn't load this order"}
          description={
            error?.status === 404
              ? "This order doesn't exist or you don't have access to it."
              : 'Something went wrong reaching the server. Please try again in a moment.'
          }
        />
      </PageContainer>
    );
  }

  const order = data.order;

  return (
    <PageContainer
      title={`Order #${order._id.slice(-8)}`}
      description={`Placed on ${formatDate(order.createdAt)}`}
    >
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          <Card>
            <h2 className="mb-6 font-display text-lg font-medium text-ink">Status</h2>
            <OrderStatusTracker status={order.status} />
          </Card>

          <Card>
            <h2 className="mb-4 font-display text-lg font-medium text-ink">Items</h2>
            <div className="divide-y divide-border">
              {order.items.map((item, i) => (
                <div key={item.productId ?? i} className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-ink">{item.name}</p>
                    <p className="font-mono text-xs text-muted">
                      {formatCurrency(item.price)} × {item.quantity}
                    </p>
                  </div>
                  <p className="shrink-0 font-mono text-sm text-ink">
                    {formatCurrency(item.price * item.quantity)}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
              <span className="text-sm font-medium text-ink">Total</span>
              <span className="font-display text-lg font-semibold text-primary-700">
                {formatCurrency(order.totalAmount)}
              </span>
            </div>
          </Card>
        </div>

        <Card className="h-fit">
          <h2 className="mb-4 font-display text-lg font-medium text-ink">Shipping Details</h2>
          <div className="space-y-3 text-sm">
            <p className="flex items-start gap-2 text-ink">
              <User className="mt-0.5 h-4 w-4 shrink-0 text-muted" />
              {order.shippingInfo.name}
            </p>
            <p className="flex items-start gap-2 text-ink">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-muted" />
              {order.shippingInfo.address}
            </p>
            <p className="flex items-start gap-2 text-ink">
              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-muted" />
              {order.shippingInfo.phone}
            </p>
          </div>

          <Link
            to="/orders"
            className="mt-6 block text-center text-sm font-medium text-primary hover:underline"
          >
            Back to My Orders
          </Link>
        </Card>
      </div>
    </PageContainer>
  );
};

export default OrderDetailPage;
