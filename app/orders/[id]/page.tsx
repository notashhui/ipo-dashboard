'use client'

import Link from 'next/link'
import { useMemo } from 'react'
import type { ReactNode } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ChevronLeft, Clock3, FileText, ShieldCheck } from 'lucide-react'
import type { OrderStatus, OrderStatusEvent } from '@/lib/types'
import { useStockOrders } from '@/hooks/use-stock-orders'

const formatCurrency = (value: number) =>
  `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

const formatDateTime = (value: Date | string) =>
  new Date(value).toLocaleString([], {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

export default function OrderDetailPage() {
  const router = useRouter()
  const params = useParams()
  const orderId = typeof params.id === 'string' ? params.id : ''
  const { orders, isHydrated, transitionOrderState } = useStockOrders()
  const order = orders.find((entry) => entry.id === orderId)

  const timeline = useMemo(() => {
    if (!order?.statusHistory) return []

    return [...order.statusHistory].sort(
      (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    )
  }, [order?.statusHistory])

  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
        <p className="text-sm font-bold text-zinc-500 uppercase tracking-widest">Loading order</p>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
        <div className="w-full max-w-[430px] bg-zinc-950 border border-zinc-900 rounded-3xl p-6 text-center">
          <p className="text-sm font-black uppercase tracking-widest">Order not found</p>
          <p className="mt-2 text-xs text-zinc-500">This order is not available in local stock order history.</p>
          <Link
            href="/orders"
            className="mt-6 inline-flex items-center justify-center rounded-xl bg-white px-4 py-3 text-xs font-black uppercase tracking-widest text-black"
          >
            Back to Orders
          </Link>
        </div>
      </div>
    )
  }

  const partiallyFilled =
    order.status === 'partially_filled' ||
    ((order.execution?.filledQuantity ?? 0) > 0 && (order.execution?.remainingQuantity ?? 0) > 0)

  const progressPercent = Math.round((order.execution?.progress ?? 0) * 100)
  const canFillNow = order.status === 'submitted'
  const canSimulatePartial = order.status === 'submitted' && order.quantity > 1
  const canCompleteRemaining = order.status === 'partially_filled' && (order.execution?.remainingQuantity ?? 0) > 0
  const canCancel = order.status === 'submitted'
  const canCancelRemaining = order.status === 'partially_filled'

  const handleFillNow = () => {
    if (!canFillNow) return

    transitionOrderState(order.id, {
      status: 'filled',
      filledQuantity: order.quantity,
      avgFilledPrice: order.price,
      note: 'Mock market execution filled the entire order immediately.',
    })
  }

  const handleSimulatePartialFill = () => {
    if (!canSimulatePartial) return

    const fillRatio = 0.4 + Math.random() * 0.2
    const partialQuantity = Math.min(
      order.quantity - 1,
      Math.max(1, Math.round(order.quantity * fillRatio))
    )

    transitionOrderState(order.id, {
      status: 'partially_filled',
      filledQuantity: partialQuantity,
      avgFilledPrice: Number((order.price * (1 + (Math.random() * 0.002 - 0.001))).toFixed(2)),
      note: `Mock execution filled ${partialQuantity} of ${order.quantity} shares.`,
    })
  }

  const handleCompleteRemaining = () => {
    if (!canCompleteRemaining) return

    transitionOrderState(order.id, {
      status: 'filled',
      filledQuantity: order.quantity,
      avgFilledPrice: order.execution?.avgFilledPrice ?? order.price,
      note: 'Mock execution completed the remaining shares.',
    })
  }

  const handleCancelOrder = () => {
    if (!canCancel) return

    transitionOrderState(order.id, {
      status: 'cancelled',
      filledQuantity: 0,
      note: 'Mock lifecycle cancelled the order before execution.',
    })
  }

  const handleCancelRemaining = () => {
    if (!canCancelRemaining) return

    transitionOrderState(order.id, {
      status: 'cancelled',
      filledQuantity: order.execution?.filledQuantity ?? 0,
      avgFilledPrice: order.execution?.avgFilledPrice ?? order.price,
      note: `Mock lifecycle cancelled the remaining ${(order.execution?.remainingQuantity ?? 0)} shares.`,
    })
  }

  return (
    <div className="min-h-screen bg-black text-white px-4 py-4">
      <div className="mx-auto max-w-[430px]">
        <div className="flex items-center justify-between py-2">
          <button
            type="button"
            onClick={() => router.back()}
            className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center hover:bg-zinc-800"
          >
            <ChevronLeft size={20} className="text-zinc-400" />
          </button>
          <div className="text-center">
            <p className="text-sm font-black uppercase tracking-widest">Order Detail</p>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-600">{order.refId}</p>
          </div>
          <Link
            href="/orders"
            className="text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-white"
          >
            Orders
          </Link>
        </div>

        <div className="mt-6 rounded-[28px] border border-zinc-900 bg-zinc-950 p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-2xl font-black italic tracking-tight">{order.symbol}</p>
              <p className="mt-1 text-xs text-zinc-500">{order.name}</p>
              <div className="mt-3 flex items-center gap-2">
                <span className={`text-[11px] font-black uppercase tracking-widest ${order.type === 'buy' ? 'text-[#F04438]' : 'text-[#2E6BE6]'}`}>
                  {order.type}
                </span>
                <span className="text-zinc-700">•</span>
                <span className="text-[11px] font-black uppercase tracking-widest text-zinc-400">{order.orderType}</span>
              </div>
            </div>
            <OrderStatusBadge status={order.status} />
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4 rounded-2xl border border-zinc-900 bg-zinc-900/40 p-4">
            <DetailItem label="Total Quantity" value={`${order.quantity} shares`} />
            <DetailItem label="Price" value={formatCurrency(order.price)} />
            <DetailItem label="Estimated Cost" value={formatCurrency(order.total)} />
            <DetailItem label="Filled Qty" value={`${order.execution?.filledQuantity ?? 0} shares`} />
            <DetailItem label="Remaining Qty" value={`${order.execution?.remainingQuantity ?? order.quantity} shares`} />
            <DetailItem label="Average Fill Price" value={order.execution?.avgFilledPrice ? formatCurrency(order.execution.avgFilledPrice) : 'Not filled'} />
          </div>

          {(canFillNow || canSimulatePartial || canCompleteRemaining || canCancel || canCancelRemaining) && (
            <div className="mt-6 grid gap-3">
              {(canFillNow || canSimulatePartial) && (
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={handleFillNow}
                    className="rounded-2xl bg-white px-4 py-4 text-xs font-black uppercase tracking-[0.2em] text-black"
                  >
                    Fill Now
                  </button>
                  <button
                    type="button"
                    onClick={handleSimulatePartialFill}
                    disabled={!canSimulatePartial}
                    className="rounded-2xl border border-zinc-800 bg-zinc-900/50 px-4 py-4 text-xs font-black uppercase tracking-[0.2em] text-white disabled:opacity-60"
                  >
                    Simulate Partial Fill
                  </button>
                </div>
              )}

              {(canCompleteRemaining || canCancelRemaining) && (
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={handleCompleteRemaining}
                    className="rounded-2xl bg-white px-4 py-4 text-xs font-black uppercase tracking-[0.2em] text-black"
                  >
                    Complete Remaining
                  </button>
                  <button
                    type="button"
                    onClick={handleCancelRemaining}
                    className="rounded-2xl border border-zinc-800 bg-zinc-900/50 px-4 py-4 text-xs font-black uppercase tracking-[0.2em] text-white"
                  >
                    Cancel Remaining
                  </button>
                </div>
              )}

              {canCancel && (
                <button
                  type="button"
                  onClick={handleCancelOrder}
                  className="rounded-2xl border border-zinc-800 bg-zinc-900/50 px-4 py-4 text-xs font-black uppercase tracking-[0.2em] text-white"
                >
                  Cancel
                </button>
              )}
            </div>
          )}

          <div className="mt-6 rounded-2xl border border-zinc-900 bg-zinc-900/20 p-4">
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-black uppercase tracking-widest text-zinc-400">Execution Progress</p>
              <p className="text-sm font-black text-white">{progressPercent}%</p>
            </div>
            <div className="mt-3 h-2 rounded-full bg-zinc-900 overflow-hidden">
              <div
                className={`h-full rounded-full ${
                  order.status === 'filled'
                    ? 'bg-emerald-400'
                    : order.status === 'partially_filled'
                      ? 'bg-amber-400'
                      : order.status === 'cancelled'
                        ? 'bg-zinc-500'
                        : 'bg-blue-400'
                }`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <p className="mt-3 text-xs text-zinc-300">
              Filled {order.execution?.filledQuantity ?? 0} of {order.quantity} shares
            </p>
          </div>

          {partiallyFilled && (
            <div className="mt-4 rounded-2xl border border-amber-500/20 bg-amber-500/10 p-4">
              <p className="text-[11px] font-black uppercase tracking-widest text-amber-300">Partially Filled</p>
              <p className="mt-2 text-xs text-zinc-300">
                The order is still working for the remaining {order.execution?.remainingQuantity ?? 0} shares.
              </p>
            </div>
          )}

          <div className="mt-6 grid gap-3">
            <TimestampRow icon={<Clock3 size={16} className="text-zinc-500" />} label="Created" value={formatDateTime(order.timestamps?.createdAt ?? order.timestamp)} />
            <TimestampRow icon={<ShieldCheck size={16} className="text-zinc-500" />} label="Updated" value={formatDateTime(order.timestamps?.updatedAt ?? order.timestamp)} />
            {order.timestamps?.submittedAt && (
              <TimestampRow icon={<FileText size={16} className="text-zinc-500" />} label="Submitted" value={formatDateTime(order.timestamps.submittedAt)} />
            )}
            {order.timestamps?.filledAt && (
              <TimestampRow icon={<FileText size={16} className="text-zinc-500" />} label="Filled" value={formatDateTime(order.timestamps.filledAt)} />
            )}
            {order.timestamps?.cancelledAt && (
              <TimestampRow icon={<FileText size={16} className="text-zinc-500" />} label="Cancelled" value={formatDateTime(order.timestamps.cancelledAt)} />
            )}
          </div>
        </div>

        <div className="mt-4 rounded-[28px] border border-zinc-900 bg-zinc-950 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-black uppercase tracking-widest">Status Timeline</p>
              <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-600">Order history</p>
            </div>
            <OrderStatusBadge status={order.status} />
          </div>

          <div className="mt-6 space-y-4">
            {timeline.map((event, index) => (
              <TimelineRow
                key={`${event.status}-${event.timestamp}-${index}`}
                event={event}
                isLast={index === timeline.length - 1}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[9px] font-bold uppercase tracking-widest text-zinc-600">{label}</p>
      <p className="mt-1 text-sm font-black text-white">{value}</p>
    </div>
  )
}

function TimestampRow({
  icon,
  label,
  value,
}: {
  icon: ReactNode
  label: string
  value: string
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-zinc-900 bg-zinc-900/20 px-4 py-3">
      <div className="w-9 h-9 rounded-xl bg-zinc-900 flex items-center justify-center">{icon}</div>
      <div className="flex-1">
        <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-600">{label}</p>
        <p className="text-sm font-black text-white">{value}</p>
      </div>
    </div>
  )
}

function TimelineRow({
  event,
  isLast,
}: {
  event: OrderStatusEvent
  isLast: boolean
}) {
  return (
    <div className="flex gap-3">
      <div className="flex flex-col items-center">
        <div className={`w-3 h-3 rounded-full ${timelineDotColor(event.status)}`} />
        {!isLast && <div className="mt-2 w-px flex-1 min-h-8 bg-zinc-800" />}
      </div>
      <div className="flex-1 pb-1">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-black uppercase tracking-wider text-white">
            {event.status.replace('_', ' ')}
          </p>
          <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-600">
            {formatDateTime(event.timestamp)}
          </p>
        </div>
        {event.note && <p className="mt-1 text-xs text-zinc-400">{event.note}</p>}
      </div>
    </div>
  )
}

function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const palette: Record<OrderStatus, string> = {
    pending: 'bg-amber-500/15 text-amber-400 border-amber-500/20',
    submitted: 'bg-blue-500/15 text-blue-400 border-blue-500/20',
    partially_filled: 'bg-orange-500/15 text-orange-400 border-orange-500/20',
    filled: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
    cancelled: 'bg-zinc-700/25 text-zinc-300 border-zinc-700/30',
  }

  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-black uppercase tracking-widest ${palette[status]}`}>
      {status.replace('_', ' ')}
    </span>
  )
}

function timelineDotColor(status: OrderStatus) {
  switch (status) {
    case 'pending':
      return 'bg-amber-400'
    case 'submitted':
      return 'bg-blue-400'
    case 'partially_filled':
      return 'bg-orange-400'
    case 'filled':
      return 'bg-emerald-400'
    case 'cancelled':
      return 'bg-zinc-400'
    default:
      return 'bg-zinc-400'
  }
}
