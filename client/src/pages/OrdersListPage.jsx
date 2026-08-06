import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { PackageSearch, AlertTriangle, ChevronRight } from 'lucide-react';

import { orderApi } from '../api/orderApi';
import { ORDER_STATUS_LABELS } from '../utils/constants';
import { formatCurrency, formatDate } from '../utils/formatters';

import PageContainer from '../components/common/PageContainer';
import EmptyState from '../components/common/EmptyState';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Skeleton from '../components/ui/Skeleton';

const STATUS_BADGE_VARIANT = {
  pending: 'warning',
  accepted: 'accent',
  preparing: 'accent',
  ready_for_dispatch: 'accent',
  completed: 'success',
};

const OrderRowSkeleton = () => (
  <Card className="flex items-center justify-between gap-4">
    <div className="min-w-0 flex-1 space-y-2">
      <Skeleton className="h-4 w-1/3" />
      <Skeleton className="h-3 w-1/4" />
    </div>
    <Skeleton className="h-6 w-20 rounded-full" />
  </Card>
);

const OrdersListPage = () => {
  const navigate = useNavigate();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['orders', 'mine'],
    queryFn: orderApi.mine,
  });

  const orders = data?.orders ?? [];

  if (isLoading) {
    return (
      <PageContainer title="My Orders">
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <OrderRowSkeleton key={i} />
          ))}
        </div>
      </PageContainer>
    );
  }

  if (isError) {
    return (
      <PageContainer title="My Orders">
        <EmptyState
          icon={AlertTriangle}
          title="Couldn't load your orders"
          description="Something went wrong reaching the server. Please try again in a moment."
        />
      </PageContainer>
    );
  }

  if (orders.length === 0) {
    return (
      <PageContainer title="My Orders">
        <EmptyState
          icon={PackageSearch}
          title="No orders yet"
          description="Orders you place will show up here so you can track them from checkout to delivery."
          actionLabel="Browse Marketplace"
          onAction={() => navigate('/marketplace')}
        />
      </PageContainer>
    );
  }

  return (
    <PageContainer title="My Orders" description={`${orders.length} order${orders.length === 1 ? '' : 's'} placed`}>
      <div className="space-y-3">
        {orders.map((order) => (
          <Link key={order._id} to={`/orders/${order._id}`}>
            <Card
              variant="elevated"
              className="flex flex-wrap items-center justify-between gap-4"
            >
              <div className="min-w-0">
                <p className="font-mono text-xs uppercase tracking-wide text-muted">
                  Order #{order._id.slice(-8)}
                </p>
                <p className="mt-1 text-sm text-ink">
                  {order.items?.length ?? 0} item{(order.items?.length ?? 0) === 1 ? '' : 's'} ·{' '}
                  {formatDate(order.createdAt)}
                </p>
              </div>

              <div className="flex items-center gap-4">
                <p className="font-display text-base font-semibold text-primary-700">
                  {formatCurrency(order.totalAmount)}
                </p>
                <Badge variant={STATUS_BADGE_VARIANT[order.status] ?? 'neutral'}>
                  {ORDER_STATUS_LABELS[order.status] ?? order.status}
                </Badge>
                <ChevronRight className="h-4 w-4 text-muted" />
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </PageContainer>
  );
};

export default OrdersListPage;
