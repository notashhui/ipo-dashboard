'use client'

import Link from 'next/link'
import { Suspense, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { ChevronLeft, Clock3, FileText, ShieldCheck } from 'lucide-react'
import type { BrokerOrder, OptionsOrder, Order, OrderStatusEvent } from '@/lib/types'
import { useStockOrders } from '@/hooks/use-stock-orders'
import { useOptionsOrders } from '@/hooks/use-options-orders'
import {
  getBrokerOrderFilled,
  getBrokerOrderRemaining,
  getBrokerOrderTitle,
  getBrokerOrderTotalUnits,
  isOptionsOrder,
} from '@/lib/broker-orders'
import {
  cancelWorkingOrder,
  createReplacementOrder,
  executeWorkingOrderNow,
  getAverageFillDisplay,
  getBrokerFilledUnits,
  getOmsActionState,
  getReferencePrice,
} from '@/lib/order-management'

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
  return (
    <Suspense fallback={null}>
      <OrderDetailContent />
    </Suspense>
  )
}

function OrderDetailContent() {
  const router = useRouter()
  const params = useParams()
  const searchParams = useSearchParams()
  const orderId = typeof params.id === 'string' ? params.id : ''
  const {
    orders: stockOrders,
    isHydrated: stockHydrated,
    transitionOrderState: transitionStockOrderState,
    addOrder: addStockOrder,
  } = useStockOrders()
  const {
    orders: optionsOrders,
    isHydrated: optionsHydrated,
    transitionOrderState: transitionOptionsOrderState,
    addOrder: addOptionsOrder,
  } = useOptionsOrders()
  const isHydrated = stockHydrated && optionsHydrated
  const [modifyOpen, setModifyOpen] = useState(false)

  const order =
    (stockOrders.find((entry) => entry.id === orderId) ??
      optionsOrders.find((entry) => entry.id === orderId) ??
      null) as BrokerOrder | null

  const safeRemaining = order ? Math.max(getBrokerOrderRemaining(order), 1) : 1
  const safeReferencePrice = order ? getReferencePrice(order) : 0
  const [modifyQuantity, setModifyQuantity] = useState(safeRemaining)
  const [modifyLimitPrice, setModifyLimitPrice] = useState(safeReferencePrice)

  const timeline = useMemo(() => {
    if (!order?.statusHistory) return []

    return [...order.statusHistory].sort(
      (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    )
  }, [order?.statusHistory])

  useEffect(() => {
    if (!order) {
      setModifyOpen(false)
      setModifyQuantity(1)
      setModifyLimitPrice(0)
      return
    }

    setModifyQuantity(Math.max(getBrokerOrderRemaining(order), 1))
    setModifyLimitPrice(getReferencePrice(order))
    setModifyOpen(false)
  }, [orderId, order])

  useEffect(() => {
    if (searchParams.get('modify') === '1') {
      setModifyOpen(true)
    }
  }, [searchParams])

  if (!isHydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black px-4 text-white">
        <p className="text-sm font-bold uppercase tracking-widest text-zinc-500">Loading order</p>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black px-4 text-white">
        <div className="w-full max-w-[430px] rounded-3xl border border-zinc-900 bg-zinc-950 p-6 text-center">
          <p className="text-sm font-black uppercase tracking-widest">Order not found</p>
          <p className="mt-2 text-xs text-zinc-500">This order is not available in local stock or options history.</p>
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

  const filled = getBrokerOrderFilled(order)
  const totalUnits = getBrokerOrderTotalUnits(order)
  const remaining = getBrokerOrderRemaining(order)
  const progressPercent = totalUnits > 0 ? Math.round((filled / totalUnits) * 100) : 0
  const partiallyFilled = order.status === 'partially_filled' || (filled > 0 && remaining > 0)
  const { canCancel, canModify, canExecuteNow } = getOmsActionState(order)

  const handleCancelOrder = () => {
    if (!canCancel) return
    cancelWorkingOrder(order, {
      transitionStockOrderState,
      transitionOptionsOrderState,
    })
  }

  const handleModifySubmit = () => {
    if (!canModify || modifyQuantity <= 0 || modifyLimitPrice <= 0) return

    const replacement = createReplacementOrder(order, {
      quantity: modifyQuantity,
      priceType: 'limit',
      limitPrice: modifyLimitPrice,
      note: `Replacement order submitted from ${order.refId}.`,
    })

    if (isOptionsOrder(order)) {
      addOptionsOrder(replacement as OptionsOrder)
    } else {
      addStockOrder(replacement as Order)
    }

    if (isOptionsOrder(order)) {
      transitionOptionsOrderState(order.id, {
        status: 'cancelled',
        filledContracts: getBrokerFilledUnits(order),
        avgFilledPrice: getAverageFillDisplay(order),
        note: `Replaced by ${replacement.refId}.`,
      })
    } else {
      transitionStockOrderState(order.id, {
        status: 'cancelled',
        filledQuantity: getBrokerFilledUnits(order),
        avgFilledPrice: getAverageFillDisplay(order),
        note: `Replaced by ${replacement.refId}.`,
      })
    }

    router.push(`/orders/confirmation/${replacement.id}`)
  }

  const handleExecuteNow = () => {
    if (!canExecuteNow) return
    const replacement = executeWorkingOrderNow(order, {
      transitionStockOrderState,
      transitionOptionsOrderState,
      addStockOrder,
      addOptionsOrder,
    })
    router.push(`/orders/confirmation/${replacement.id}`)
  }

  return (
    <div className="min-h-screen bg-black px-4 py-4 text-white">
      <div className="mx-auto max-w-[430px]">
        <div className="flex items-center justify-between py-2">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-900 hover:bg-zinc-800"
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
              <p className="text-2xl font-black italic tracking-tight">{getBrokerOrderTitle(order)}</p>
              <p className="mt-1 text-xs text-zinc-500">{getOrderDescription(order)}</p>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <AssetBadge options={isOptionsOrder(order)} />
                <SideBadge order={order} />
                <span className="text-zinc-700">•</span>
                <span className="text-[11px] font-black uppercase tracking-widest text-zinc-400">
                  {isOptionsOrder(order) ? order.priceType : order.orderType}
                </span>
              </div>
            </div>
            <OrderStatusBadge status={order.status} />
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4 rounded-2xl border border-zinc-900 bg-zinc-900/40 p-4">
            {isOptionsOrder(order) ? (
              <>
                <DetailItem label="Underlying" value={order.contract.underlying} />
                <DetailItem label="Expiration" value={order.contract.expiration} />
                <DetailItem label="Strike" value={order.contract.strike.toFixed(2)} />
                <DetailItem label="Right" value={order.contract.right.toUpperCase()} />
                <DetailItem label="Total Contracts" value={`${order.quantityContracts} contracts`} />
                <DetailItem label="Limit Price" value={order.limitPrice ? formatCurrency(order.limitPrice) : 'Market'} />
                <DetailItem label="Estimated Cost" value={formatCurrency(order.estimatedCost)} />
                <DetailItem label="Fees" value={formatCurrency(order.fees)} />
                <DetailItem label="Filled Contracts" value={`${order.filledContracts} contracts`} />
                <DetailItem label="Remaining Contracts" value={`${order.remainingContracts} contracts`} />
                <DetailItem label="Average Fill Price" value={order.avgFilledPrice ? formatCurrency(order.avgFilledPrice) : 'Not filled'} />
                <DetailItem label="Buying Power Impact" value={formatCurrency(order.buyingPowerImpact)} />
                <DetailItem label="Max Loss" value={typeof order.maxLoss === 'number' ? formatCurrency(order.maxLoss) : 'Unlimited'} />
                <DetailItem label="Max Profit" value={typeof order.maxProfit === 'number' ? formatCurrency(order.maxProfit) : 'Unlimited'} />
              </>
            ) : (
              <>
                <DetailItem label="Total Quantity" value={`${order.quantity} shares`} />
                <DetailItem label="Price" value={formatCurrency(order.price)} />
                <DetailItem label="Estimated Cost" value={formatCurrency(order.total)} />
                <DetailItem label="Filled Qty" value={`${order.execution?.filledQuantity ?? 0} shares`} />
                <DetailItem label="Remaining Qty" value={`${order.execution?.remainingQuantity ?? order.quantity} shares`} />
                <DetailItem label="Average Fill Price" value={order.execution?.avgFilledPrice ? formatCurrency(order.execution.avgFilledPrice) : 'Not filled'} />
              </>
            )}
          </div>

          {(order.replacesOrderId || order.lineageRootId) && (
            <div className="mt-4 rounded-2xl border border-zinc-900 bg-zinc-900/20 p-4">
              <div className="grid grid-cols-2 gap-4">
                {order.replacesOrderId && <DetailItem label="Replaces Order" value={order.replacesOrderId} />}
                {order.lineageRootId && <DetailItem label="Lineage Root" value={order.lineageRootId} />}
              </div>
            </div>
          )}

          {(canModify || canExecuteNow || canCancel) && (
            <div className="mt-6 grid gap-3">
              {(canModify || canExecuteNow) && (
                <div className="grid gap-3">
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setModifyOpen((current) => !current)}
                      className="rounded-2xl bg-white px-4 py-4 text-xs font-black uppercase tracking-[0.2em] text-black"
                    >
                      Modify
                    </button>
                    <button
                      type="button"
                      onClick={handleExecuteNow}
                      className="rounded-2xl border border-zinc-800 bg-zinc-900/50 px-4 py-4 text-xs font-black uppercase tracking-[0.2em] text-white"
                    >
                      Execute Now
                    </button>
                  </div>

                  {modifyOpen && (
                    <div className="rounded-2xl border border-zinc-900 bg-zinc-900/30 p-4">
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Modify Working Order</p>
                      <div className="mt-4 grid gap-4">
                        <ModifyField
                          label={isOptionsOrder(order) ? 'Working Contracts' : 'Working Quantity'}
                          value={modifyQuantity}
                          step="1"
                          onChange={(value) => setModifyQuantity(Math.max(1, Number.parseInt(value, 10) || 1))}
                        />
                        <ModifyField
                          label={isOptionsOrder(order) ? 'New Limit Premium' : 'New Limit Price'}
                          value={modifyLimitPrice}
                          step="0.01"
                          onChange={(value) => setModifyLimitPrice(Math.max(0.01, Number.parseFloat(value) || getReferencePrice(order)))}
                        />
                      </div>
                      <div className="mt-4 flex gap-3">
                        <button
                          type="button"
                          onClick={() => setModifyOpen(false)}
                          className="flex-1 rounded-2xl border border-zinc-800 bg-zinc-900/50 px-4 py-3 text-[10px] font-black uppercase tracking-[0.2em] text-white"
                        >
                          Keep Current
                        </button>
                        <button
                          type="button"
                          onClick={handleModifySubmit}
                          className="flex-1 rounded-2xl bg-white px-4 py-3 text-[10px] font-black uppercase tracking-[0.2em] text-black"
                        >
                          Submit Replace
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {canCancel && (
                <button
                  type="button"
                  onClick={handleCancelOrder}
                  className="rounded-2xl border border-zinc-800 bg-zinc-900/50 px-4 py-4 text-xs font-black uppercase tracking-[0.2em] text-white"
                >
                  Cancel Order
                </button>
              )}
            </div>
          )}

          <div className="mt-6 rounded-2xl border border-zinc-900 bg-zinc-900/20 p-4">
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-black uppercase tracking-widest text-zinc-400">Execution Progress</p>
              <p className="text-sm font-black text-white">{progressPercent}%</p>
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-zinc-900">
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
              Filled {filled} of {totalUnits} {isOptionsOrder(order) ? 'contracts' : 'shares'}
            </p>
          </div>

          {partiallyFilled && (
            <div className="mt-4 rounded-2xl border border-amber-500/20 bg-amber-500/10 p-4">
              <p className="text-[11px] font-black uppercase tracking-widest text-amber-300">Partially Filled</p>
              <p className="mt-2 text-xs text-zinc-300">
                The order is still working for the remaining {remaining} {isOptionsOrder(order) ? 'contracts' : 'shares'}.
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
              <TimelineRow key={`${event.status}-${event.timestamp}-${index}`} event={event} isLast={index === timeline.length - 1} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function getOrderDescription(order: BrokerOrder) {
  if (isOptionsOrder(order)) {
    return `${order.contract.expiration} · ${order.contract.strike.toFixed(2)} ${order.contract.right.toUpperCase()}`
  }

  return order.name
}

function AssetBadge({ options }: { options: boolean }) {
  return (
    <span className="inline-flex items-center rounded-full bg-zinc-800 px-2.5 py-1 text-[10px] font-black uppercase tracking-widest text-zinc-300">
      {options ? 'OPT' : 'STK'}
    </span>
  )
}

function SideBadge({ order }: { order: BrokerOrder }) {
  if (isOptionsOrder(order)) {
    const tone =
      order.side === 'buy_to_open' || order.side === 'buy_to_close'
        ? 'bg-[#F04438]/15 text-[#F04438]'
        : 'bg-[#2E6BE6]/15 text-[#2E6BE6]'
    return (
      <span className={`text-[11px] font-black uppercase tracking-widest ${tone} rounded-full px-2.5 py-1`}>
        {order.side.replaceAll('_', ' ')}
      </span>
    )
  }

  return (
    <span className={`text-[11px] font-black uppercase tracking-widest ${
      order.type === 'buy' ? 'text-[#F04438]' : 'text-[#2E6BE6]'
    }`}>
      {order.type}
    </span>
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

function ModifyField({
  label,
  value,
  step,
  onChange,
}: {
  label: string
  value: number
  step: string
  onChange: (value: string) => void
}) {
  return (
    <div>
      <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-600">{label}</p>
      <input
        type="number"
        min="0"
        step={step}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full rounded-2xl border border-zinc-800 bg-zinc-950/60 px-4 py-3 text-sm font-black tabular-nums text-white outline-none"
      />
    </div>
  )
}

function TimestampRow({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-zinc-900 bg-zinc-900/20 px-4 py-3">
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-900">{icon}</div>
      <div className="flex-1">
        <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-600">{label}</p>
        <p className="text-sm font-black text-white">{value}</p>
      </div>
    </div>
  )
}

function TimelineRow({ event, isLast }: { event: OrderStatusEvent; isLast: boolean }) {
  return (
    <div className="flex gap-3">
      <div className="flex flex-col items-center">
        <div className={`h-3 w-3 rounded-full ${timelineDotColor(event.status)}`} />
        {!isLast && <div className="mt-2 min-h-8 w-px flex-1 bg-zinc-800" />}
      </div>
      <div className="flex-1 pb-1">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-black uppercase tracking-wider text-white">{event.status.replace('_', ' ')}</p>
          <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-600">{formatDateTime(event.timestamp)}</p>
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
