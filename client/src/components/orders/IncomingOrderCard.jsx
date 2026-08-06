import { useMutation, useQueryClient } from '@tanstack/react-query';
import { User, MapPin, Phone, ArrowRight, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

import { orderApi } from '../../api/orderApi';
import { ORDER_STATUS_LABELS, getNextOrderStatus } from '../../utils/constants';
import { formatCurrency, formatDateTime } from '../../utils/formatters';

import Card from '../ui/Card';
import Badge from '../ui/Badge';
import Button from '../ui/Button';

// Maps order.status -> Badge variant. Every key here mirrors
// ORDER_STATUS_SEQUENCE in utils/constants.js.
const STATUS_BADGE_VARIANT = {
  pending: 'warning',
  accepted: 'neutral',
  preparing: 'accent',
  ready_for_dispatch: 'accent',
  completed: 'success',
};

const IncomingOrderCard = ({ order }) => {
  const queryClient = useQueryClient();
  const nextStatus = getNextOrderStatus(order.status);

  // PATCH /orders/:id/status only ever accepts the single next value in the
  // sequence — the button below never offers anything else, so this mutation
  // never sends a status the backend would reject.
  const statusMutation = useMutation({
    mutationFn: (status) => orderApi.updateStatus(order._id, status),
    onSuccess: () => {
      toast.success(`Order marked as ${ORDER_STATUS_LABELS[nextStatus]}`);
      queryClient.invalidateQueries({ queryKey: ['orders', 'incoming'] });
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || 'Failed to update order status');
    },
  });

  return (
    <Card variant="elevated" className="flex flex-col gap-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        {/* Customer/business name is the primary identifier on this card —
            suppliers scan for "who ordered", not the order id, first. */}
        <div>
          <p className="flex items-center gap-2 font-display text-lg font-semibold leading-snug text-ink">
            <User className="h-4 w-4 shrink-0 text-accent-600" />
            {order.shippingInfo?.name ?? 'Customer'}
          </p>
          <p className="mt-1 font-mono text-[11px] uppercase tracking-widest text-accent-600">
            Order #{order._id.slice(-6).toUpperCase()}
          </p>
          <p className="text-xs text-muted">{formatDateTime(order.createdAt)}</p>
        </div>
        <Badge variant={STATUS_BADGE_VARIANT[order.status] ?? 'neutral'}>
          {ORDER_STATUS_LABELS[order.status] ?? order.status}
        </Badge>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted">
            Items
          </p>
          <ul className="space-y-1.5">
            {order.items?.map((item, i) => (
              <li
                key={`${item.productId}-${i}`}
                className="flex items-center justify-between gap-3 text-sm"
              >
                <span className="truncate text-ink">{item.name}</span>
                <span className="shrink-0 font-mono text-xs text-muted">
                  {item.quantity} × {formatCurrency(item.price)}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted">
            Shipping To
          </p>
          <div className="space-y-1 text-sm text-ink">
            <p className="flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 shrink-0 text-muted" />
              <span>{order.shippingInfo?.address}</span>
            </p>
            <p className="flex items-center gap-1.5">
              <Phone className="h-3.5 w-3.5 shrink-0 text-muted" />
              <span>{order.shippingInfo?.phone}</span>
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
        <p className="font-display text-lg font-semibold text-primary-700">
          {formatCurrency(order.totalAmount)}
        </p>

        {nextStatus ? (
          <Button
            size="sm"
            isLoading={statusMutation.isPending}
            onClick={() => statusMutation.mutate(nextStatus)}
          >
            Mark as {ORDER_STATUS_LABELS[nextStatus]}
            <ArrowRight className="h-4 w-4" />
          </Button>
        ) : (
          <Badge variant="success" icon={CheckCircle2}>
            Order Complete
          </Badge>
        )}
      </div>
    </Card>
  );
};

export default IncomingOrderCard;