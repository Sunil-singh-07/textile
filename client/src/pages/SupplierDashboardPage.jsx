import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  Boxes,
  PackageCheck,
  ClipboardList,
  AlertTriangle,
  Plus,
  ChevronRight,
  PackageSearch,
} from 'lucide-react';

import { dashboardApi } from '../api/dashboardApi';
import { ORDER_STATUS_LABELS } from '../utils/constants';
import { formatCurrency, formatDate } from '../utils/formatters';

import PageContainer from '../components/common/PageContainer';
import EmptyState from '../components/common/EmptyState';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Skeleton from '../components/ui/Skeleton';
import StitchDivider from '../components/ui/StitchDivider';
import WeavePattern from '../components/ui/WeavePattern';
import { Eyebrow, Subheading } from '../components/ui/Typography';

const STATUS_BADGE_VARIANT = {
  pending: 'warning',
  accepted: 'accent',
  preparing: 'accent',
  ready_for_dispatch: 'accent',
  completed: 'success',
};

// Mirrors the icon-chip-on-texture treatment ProductCard/AuthCard use
// elsewhere — a faint woven backdrop behind the icon rather than a flat
// colored square, so the stat cards read as catalog fixtures, not a
// generic admin widget.
const StatCard = ({ label, value, icon: Icon, tone = 'accent' }) => (
  <Card variant="elevated" className="flex items-center gap-4">
    <div
      className={`relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full
        ${tone === 'danger' ? 'bg-danger-100' : 'bg-accent-100'}`}
    >
      <WeavePattern
        color={tone === 'danger' ? '#B3261E' : '#6B4F3B'}
        cell={8}
        opacity={0.14}
        className="absolute inset-0"
      />
      <Icon className={`relative h-5 w-5 ${tone === 'danger' ? 'text-danger' : 'text-accent-600'}`} />
    </div>
    <div>
      <p className="font-display text-2xl font-semibold text-ink">{value}</p>
      <p className="text-sm text-muted">{label}</p>
    </div>
  </Card>
);

const StatCardSkeleton = () => (
  <Card variant="elevated" className="flex items-center gap-4">
    <Skeleton className="h-12 w-12 rounded-full" />
    <div className="space-y-2">
      <Skeleton className="h-6 w-12" />
      <Skeleton className="h-3 w-20" />
    </div>
  </Card>
);

const SupplierDashboardPage = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['dashboard', 'supplier'],
    queryFn: dashboardApi.supplier,
  });

  const recentOrders = data?.recentOrders ?? [];

  return (
    <PageContainer title="Supplier Dashboard" description="Your catalog and recent order activity, at a glance.">
      {isError ? (
        <EmptyState
          icon={AlertTriangle}
          title="Couldn't load your dashboard"
          description="Something went wrong reaching the server. Please try again in a moment."
        />
      ) : (
        <>
          <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {isLoading ? (
              Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} />)
            ) : (
              <>
                <StatCard label="Total Products" value={data.totalProducts} icon={Boxes} />
                <StatCard label="Active Products" value={data.activeProducts} icon={PackageCheck} />
                <StatCard label="Pending Orders" value={data.pendingOrders} icon={ClipboardList} />
                <StatCard
                  label="Low Stock"
                  value={data.lowStockCount}
                  icon={AlertTriangle}
                  tone={data.lowStockCount > 0 ? 'danger' : 'accent'}
                />
              </>
            )}
          </div>

          <div className="mb-8 flex flex-wrap gap-3">
            <Link to="/supplier/products/new">
              <Button>
                <Plus className="h-4 w-4" />
                Add Product
              </Button>
            </Link>
            <Link to="/supplier/products">
              <Button variant="outline">
                <Boxes className="h-4 w-4" />
                Manage Products
              </Button>
            </Link>
            <Link to="/supplier/orders">
              <Button variant="outline">
                <ClipboardList className="h-4 w-4" />
                View Orders
              </Button>
            </Link>
          </div>

          <StitchDivider className="mb-8" />

          <Eyebrow className="mb-2 block">Activity</Eyebrow>
          <Subheading className="mb-4">Recent Orders</Subheading>

          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <Card key={i} className="flex items-center justify-between gap-4">
                  <div className="min-w-0 flex-1 space-y-2">
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-3 w-1/4" />
                  </div>
                  <Skeleton className="h-6 w-20 rounded-full" />
                </Card>
              ))}
            </div>
          ) : recentOrders.length === 0 ? (
            <EmptyState
              icon={PackageSearch}
              title="No orders yet"
              description="Orders placed against your products will show up here."
            />
          ) : (
            <div className="space-y-3">
              {recentOrders.map((order) => (
                <Link key={order._id} to={`/orders/${order._id}`}>
                  <Card variant="elevated" className="flex flex-wrap items-center justify-between gap-4">
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
          )}
        </>
      )}
    </PageContainer>
  );
};

export default SupplierDashboardPage;

