import { useQuery } from '@tanstack/react-query';
import { AlertTriangle, ClipboardList } from 'lucide-react';

import { orderApi } from '../api/orderApi';

import PageContainer from '../components/common/PageContainer';
import EmptyState from '../components/common/EmptyState';
import Card from '../components/ui/Card';
import Skeleton from '../components/ui/Skeleton';
import IncomingOrderCard from '../components/orders/IncomingOrderCard';

const OrderCardSkeleton = () => (
  <Card className="space-y-4">
    <div className="flex items-start justify-between gap-3">
      <div className="space-y-2">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-4 w-40" />
      </div>
      <Skeleton className="h-6 w-24 rounded-full" />
    </div>
    <Skeleton className="h-16 w-full rounded-lg" />
    <Skeleton className="h-9 w-40 rounded-full" />
  </Card>
);

const SupplierIncomingOrdersPage = () => {
  // GET /orders/incoming — supplier only, returns { orders }.
  const { data, isLoading, isError } = useQuery({
    queryKey: ['orders', 'incoming'],
    queryFn: () => orderApi.incoming(),
  });

  const orders = data?.orders ?? [];

  return (
    <PageContainer
      title="Incoming Orders"
      description={
        isLoading
          ? 'Loading your orders…'
          : `${orders.length} order${orders.length === 1 ? '' : 's'}`
      }
    >
      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <OrderCardSkeleton key={i} />
          ))}
        </div>
      ) : isError ? (
        <EmptyState
          icon={AlertTriangle}
          title="Couldn't load your orders"
          description="Something went wrong reaching the server. Please try again in a moment."
        />
      ) : orders.length === 0 ? (
        <EmptyState
          icon={ClipboardList}
          title="No incoming orders yet"
          description="Orders placed by buyers for your products will show up here."
        />
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <IncomingOrderCard key={order._id} order={order} />
          ))}
        </div>
      )}
    </PageContainer>
  );
};

export default SupplierIncomingOrdersPage;