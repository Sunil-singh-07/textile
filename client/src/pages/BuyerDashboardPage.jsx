import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  ClipboardList,
  History,
  Wallet,
  Activity,
  AlertTriangle,
  Store,
  ShoppingCart,
  ChevronRight,
  PackageSearch,
} from 'lucide-react';

import { dashboardApi } from '../api/dashboardApi';
import { useAuth } from '../hooks/useAuth';
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

// Mirrors the icon-chip-on-texture treatment used on the Supplier Dashboard's
// stat cards, so both dashboards read as the same fixture rather than one
// looking like a generic admin widget.
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

const BuyerDashboardPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['dashboard', 'buyer'],
    queryFn: dashboardApi.buyer,
  });

  const recentOrders = data?.recentOrders ?? [];

  // The buyer dashboard endpoint only returns `orderCount` (the true
  // all-time total) and the 5 most recent orders — there is no all-time
  // pending/completed/spend aggregate in the contract. To avoid presenting
  // misleading all-time figures, every other stat here is computed only
  // from what recentOrders actually contains, and labeled as "Recent" to
  // reflect that scope honestly.
  const recentOrdersCount = recentOrders.length;
  const recentSpend = recentOrders.reduce((sum, order) => sum + (order.totalAmount ?? 0), 0);
  const latestOrderStatus = recentOrders[0]?.status;

  return (
    <PageContainer title="Buyer Dashboard" description="Your orders and shopping activity, at a glance.">
      {isError ? (
        <EmptyState
          icon={AlertTriangle}
          title="Couldn't load your dashboard"
          description="Something went wrong reaching the server. Please try again in a moment."
        />
      ) : (
        <>
          {/* Welcome section */}
          <div className="mb-8">
            <Eyebrow className="mb-2 block">Welcome back</Eyebrow>
            <Subheading className="text-2xl">{user?.email ?? 'Buyer'}</Subheading>
          </div>

          {/* Stats cards */}
          <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {isLoading ? (
              Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} />)
            ) : (
              <>
                <StatCard label="Total Orders" value={data.orderCount} icon={ClipboardList} />
                <StatCard label="Recent Orders" value={recentOrdersCount} icon={History} />
                <StatCard label="Recent Spend" value={formatCurrency(recentSpend)} icon={Wallet} />
                <StatCard
                  label="Latest Order Status"
                  value={latestOrderStatus ? ORDER_STATUS_LABELS[latestOrderStatus] ?? latestOrderStatus : '—'}
                  icon={Activity}
                />
              </>
            )}
          </div>

          {/* Quick actions */}
          <div className="mb-8 flex flex-wrap gap-3">
            <Link to="/marketplace">
              <Button>
                <Store className="h-4 w-4" />
                Browse Marketplace
              </Button>
            </Link>
            <Link to="/orders">
              <Button variant="outline">
                <ClipboardList className="h-4 w-4" />
                View Orders
              </Button>
            </Link>
            <Link to="/cart">
              <Button variant="outline">
                <ShoppingCart className="h-4 w-4" />
                Open Cart
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
              description="Orders you place will show up here."
              actionLabel="Browse Marketplace"
              onAction={() => navigate('/marketplace')}
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

export default BuyerDashboardPage;