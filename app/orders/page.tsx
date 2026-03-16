'use client'

import { Suspense, useMemo, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { ChevronLeft, ChevronRight, Clock3, ListOrdered, MoreHorizontal } from 'lucide-react'
import type { BrokerOrder, OptionsOrder, OrderStatus } from '@/lib/types'
import { useStockOrders } from '@/hooks/use-stock-orders'
import { useOptionsOrders } from '@/hooks/use-options-orders'
import {
  getBrokerOrderCreatedAt,
  getBrokerOrderFilled,
  getBrokerLastPrice,
  getBrokerLimitDistance,
  getBrokerOrderProgress,
  getBrokerOrderSubtitle,
  getBrokerOrderTitle,
  getBrokerOrderTotalUnits,
  getBrokerOrderUpdatedAt,
  isOptionsOrder,
} from '@/lib/broker-orders'
import { cancelWorkingOrder, executeWorkingOrderNow, getOmsActionState } from '@/lib/order-management'

type FilterTab = 'open' | 'completed'
type OpenQuickFilter = 'all' | 'submitted' | 'partially_filled'
type SortMode = 'created' | 'updated'
type AssetClassTab = 'stocks' | 'options' | 'structured'

const OPEN_STATUSES: OrderStatus[] = ['pending', 'submitted', 'partially_filled']
const COMPLETED_STATUSES: OrderStatus[] = ['filled', 'cancelled']

const formatCurrency = (value: number) =>
  `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

const formatTimestamp = (value: Date | string) =>
  new Date(value).toLocaleString([], {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

export default function OrdersPage() {
  return (
    <Suspense fallback={null}>
      <OrdersContent />
    </Suspense>
  )
}

function OrdersContent() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
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
  const [activeTab, setActiveTab] = useState<FilterTab>('open')
  const [openQuickFilter, setOpenQuickFilter] = useState<OpenQuickFilter>('all')
  const [sortMode, setSortMode] = useState<SortMode>('created')
  const [mobileActionOrder, setMobileActionOrder] = useState<BrokerOrder | null>(null)
  const isHydrated = stockHydrated && optionsHydrated
  const rawAssetClass = searchParams.get('assetClass')
  const assetClass: AssetClassTab =
    rawAssetClass === 'options' || rawAssetClass === 'structured' || rawAssetClass === 'stocks'
      ? rawAssetClass
      : 'stocks'

  const allOrders = useMemo<BrokerOrder[]>(
    () => [...stockOrders, ...optionsOrders],
    [optionsOrders, stockOrders]
  )

  const assetScopedOrders = useMemo(() => {
    if (assetClass === 'options') {
      return allOrders.filter((order) => isOptionsOrder(order))
    }

    if (assetClass === 'structured') {
      return []
    }

    return allOrders.filter((order) => !isOptionsOrder(order))
  }, [allOrders, assetClass])

  const sortedOrders = useMemo(() => {
    return [...assetScopedOrders].sort((a, b) => {
      const left = sortMode === 'created'
        ? new Date(getBrokerOrderCreatedAt(a)).getTime()
        : new Date(getBrokerOrderUpdatedAt(a)).getTime()
      const right = sortMode === 'created'
        ? new Date(getBrokerOrderCreatedAt(b)).getTime()
        : new Date(getBrokerOrderUpdatedAt(b)).getTime()

      return right - left
    })
  }, [assetScopedOrders, sortMode])

  const visibleOrders = useMemo(() => {
    const scoped = sortedOrders.filter((order) =>
      (activeTab === 'open' ? OPEN_STATUSES : COMPLETED_STATUSES).includes(order.status)
    )

    if (activeTab !== 'open' || openQuickFilter === 'all') {
      return scoped
    }

    return scoped.filter((order) => order.status === openQuickFilter)
  }, [activeTab, openQuickFilter, sortedOrders])

  const handleAssetClassChange = (nextAssetClass: AssetClassTab) => {
    const nextParams = new URLSearchParams(searchParams.toString())

    if (nextAssetClass === 'stocks') {
      nextParams.delete('assetClass')
    } else {
      nextParams.set('assetClass', nextAssetClass)
    }

    const nextQuery = nextParams.toString()
    router.replace(nextQuery ? `${pathname}?${nextQuery}` : pathname)
  }

  const handleQuickCancel = (order: BrokerOrder) => {
    cancelWorkingOrder(order, {
      transitionStockOrderState,
      transitionOptionsOrderState,
    })
  }

  const handleQuickExecuteNow = (order: BrokerOrder) => {
    const replacement = executeWorkingOrderNow(order, {
      transitionStockOrderState,
      transitionOptionsOrderState,
      addStockOrder,
      addOptionsOrder,
    })
    router.push(`/orders/confirmation/${replacement.id}`)
  }

  const closeMobileActions = () => setMobileActionOrder(null)

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
            <p className="text-sm font-black uppercase tracking-widest">Orders</p>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-600">Broker blotter</p>
          </div>
          <div className="w-10 h-10" />
        </div>

        <div className="mt-6 rounded-[28px] border border-zinc-900 bg-zinc-950 p-4">
          <div className="grid grid-cols-3 gap-2 rounded-2xl border border-zinc-900 bg-zinc-950/80 p-2">
            <button
              type="button"
              onClick={() => handleAssetClassChange('stocks')}
              className={`rounded-xl px-3 py-3 text-[10px] font-black uppercase tracking-[0.2em] ${
                assetClass === 'stocks' ? 'bg-white text-black' : 'bg-zinc-900/60 text-white'
              }`}
            >
              Stocks
            </button>
            <button
              type="button"
              onClick={() => handleAssetClassChange('options')}
              className={`rounded-xl px-3 py-3 text-[10px] font-black uppercase tracking-[0.2em] ${
                assetClass === 'options' ? 'bg-white text-black' : 'bg-zinc-900/60 text-white'
              }`}
            >
              Options
            </button>
            <button
              type="button"
              onClick={() => handleAssetClassChange('structured')}
              className={`rounded-xl px-3 py-3 text-[10px] font-black uppercase tracking-[0.2em] ${
                assetClass === 'structured' ? 'bg-white text-black' : 'bg-zinc-900/30 text-zinc-600'
              }`}
            >
              Structured
            </button>
          </div>

          <div className="mt-4 flex rounded-full bg-zinc-900/60 p-1">
            <button
              type="button"
              onClick={() => setActiveTab('open')}
              className={`flex-1 rounded-full py-3 text-[11px] font-black uppercase tracking-[0.2em] ${
                activeTab === 'open' ? 'bg-zinc-800 text-white' : 'text-zinc-600'
              }`}
            >
              Open
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('completed')}
              className={`flex-1 rounded-full py-3 text-[11px] font-black uppercase tracking-[0.2em] ${
                activeTab === 'completed' ? 'bg-zinc-800 text-white' : 'text-zinc-600'
              }`}
            >
              Completed
            </button>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <SortChip label="Created Time" active={sortMode === 'created'} onClick={() => setSortMode('created')} />
            <SortChip label="Last Updated" active={sortMode === 'updated'} onClick={() => setSortMode('updated')} />
          </div>

          {activeTab === 'open' && (
            <div className="mt-3 flex flex-wrap gap-2">
              <FilterChip label="All Open" active={openQuickFilter === 'all'} onClick={() => setOpenQuickFilter('all')} />
              <FilterChip label="Submitted" active={openQuickFilter === 'submitted'} onClick={() => setOpenQuickFilter('submitted')} />
              <FilterChip label="Partially Filled" active={openQuickFilter === 'partially_filled'} onClick={() => setOpenQuickFilter('partially_filled')} />
            </div>
          )}

          {!isHydrated ? (
            <div className="py-16 text-center">
              <p className="text-sm font-bold uppercase tracking-widest text-zinc-500">Loading orders</p>
            </div>
          ) : visibleOrders.length === 0 ? (
            <div className="py-16 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-zinc-900">
                <ListOrdered size={28} className="text-zinc-700" />
              </div>
              <p className="mt-4 text-sm font-bold text-zinc-400">
                {assetClass === 'structured'
                  ? 'No structured orders'
                  : activeTab === 'open'
                    ? 'No open orders'
                    : 'No completed orders'}
              </p>
              <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-zinc-600">
                {assetClass === 'structured'
                  ? 'Structured products will appear here'
                  : assetClass === 'options'
                    ? 'Options orders will appear here'
                    : 'Stock orders will appear here'}
              </p>
              <Link
                href="/"
                className="mt-6 inline-flex items-center justify-center rounded-xl bg-white px-4 py-3 text-xs font-black uppercase tracking-widest text-black"
              >
                Back to dashboard
              </Link>
            </div>
          ) : (
            <div className="mt-4 space-y-3">
              {visibleOrders.map((order) => (
                <div
                  key={order.id}
                  className="group relative w-full rounded-2xl border border-zinc-900 bg-zinc-900/30 p-4 text-left transition-colors hover:bg-zinc-900/50"
                >
                  <button
                    type="button"
                    onClick={() => router.push(`/orders/${order.id}`)}
                    className="w-full pr-12 text-left md:pr-0"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-base font-black text-white">{getBrokerOrderTitle(order)}</p>
                          <AssetBadge options={isOptionsOrder(order)} />
                          <SideBadge order={order} />
                          <TypeBadge order={order} />
                        </div>
                        <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-zinc-600">
                          {getBrokerOrderSubtitle(order)}
                        </p>
                        <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-zinc-700">
                          Ref {order.refId}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <OrderStatusBadge status={order.status} />
                        <ChevronRight size={16} className="shrink-0 text-zinc-700" />
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="text-[9px] font-bold uppercase tracking-widest text-zinc-600">
                          {sortMode === 'created' ? 'Created' : 'Last Updated'}
                        </p>
                        <p className="mt-1 text-xs font-bold text-zinc-300">
                          {formatTimestamp(sortMode === 'created' ? getBrokerOrderCreatedAt(order) : getBrokerOrderUpdatedAt(order))}
                        </p>
                      </div>

                      <div>
                        <p className="text-[9px] font-bold uppercase tracking-widest text-zinc-600">Execution</p>
                        <p className="mt-1 text-xs font-bold text-zinc-300">{getExecutionSummary(order)}</p>
                      </div>

                      <div>
                        <p className="text-[9px] font-bold uppercase tracking-widest text-zinc-600">Last Price</p>
                        <p className="mt-1 text-xs font-bold text-zinc-300">
                          {getBrokerLastPrice(order) === undefined ? 'N/A' : formatCurrency(getBrokerLastPrice(order) ?? 0)}
                        </p>
                      </div>

                      <div>
                        <p className="text-[9px] font-bold uppercase tracking-widest text-zinc-600">Distance</p>
                        <p className="mt-1 text-xs font-bold text-zinc-300">
                          {getDistanceLabel(order)}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4">
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-[9px] font-bold uppercase tracking-widest text-zinc-600">Execution Progress</p>
                        <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
                          {getProgressLabel(order)}
                        </p>
                      </div>
                      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-zinc-800">
                        <div
                          className={`h-full rounded-full ${getProgressBarClass(order.status)}`}
                          style={{ width: `${Math.max(0, Math.min(100, Math.round(getBrokerOrderProgress(order) * 100)))}%` }}
                        />
                      </div>
                    </div>
                  </button>

                  <DesktopOmsActions
                    order={order}
                    onModify={() => router.push(`/orders/${order.id}?modify=1`)}
                    onExecuteNow={() => handleQuickExecuteNow(order)}
                    onCancel={() => handleQuickCancel(order)}
                  />
                  {getOmsActionState(order).isWorkingOrder && (
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation()
                        setMobileActionOrder(order)
                      }}
                      className="pointer-events-auto absolute right-4 top-4 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-zinc-900/80 text-zinc-400 md:hidden"
                      aria-label="Open order actions"
                    >
                      <MoreHorizontal size={16} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {isHydrated && visibleOrders.length > 0 && (
          <div className="mt-4 flex items-center justify-between gap-3 rounded-2xl border border-zinc-900 bg-zinc-950/70 px-4 py-3">
            <div className="flex items-center gap-2">
              <Clock3 size={16} className="text-zinc-500" />
              <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                Sorted by {sortMode === 'created' ? 'created time' : 'last updated'}
              </p>
            </div>
            <p className="text-xs font-black text-white">{visibleOrders.length} orders</p>
          </div>
        )}
      </div>

      {mobileActionOrder && (
        <MobileOmsActionSheet
          order={mobileActionOrder}
          onClose={closeMobileActions}
          onModify={() => {
            closeMobileActions()
            router.push(`/orders/${mobileActionOrder.id}?modify=1`)
          }}
          onExecuteNow={() => {
            handleQuickExecuteNow(mobileActionOrder)
            closeMobileActions()
          }}
          onCancel={() => {
            handleQuickCancel(mobileActionOrder)
            closeMobileActions()
          }}
        />
      )}
    </div>
  )
}

function DesktopOmsActions({
  order,
  onModify,
  onExecuteNow,
  onCancel,
}: {
  order: BrokerOrder
  onModify: () => void
  onExecuteNow: () => void
  onCancel: () => void
}) {
  const { canCancel, canModify, canExecuteNow } = getOmsActionState(order)

  if (!canCancel && !canModify && !canExecuteNow) {
    return null
  }

  return (
    <div className="pointer-events-none absolute inset-x-4 top-4 z-10 hidden items-center justify-end gap-2 opacity-0 transition-opacity group-hover:opacity-100 md:flex">
      {canModify && (
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation()
            onModify()
          }}
          className="pointer-events-auto rounded-xl bg-white px-3 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-black"
        >
          Modify
        </button>
      )}
      {canExecuteNow && (
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation()
            onExecuteNow()
          }}
          className="pointer-events-auto rounded-xl border border-zinc-800 bg-zinc-900/90 px-3 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-white"
        >
          Execute Now
        </button>
      )}
      {canCancel && (
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation()
            onCancel()
          }}
          className="pointer-events-auto rounded-xl border border-zinc-800 bg-zinc-900/90 px-3 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-white"
        >
          Cancel
        </button>
      )}
    </div>
  )
}

function MobileOmsActionSheet({
  order,
  onClose,
  onModify,
  onExecuteNow,
  onCancel,
}: {
  order: BrokerOrder
  onClose: () => void
  onModify: () => void
  onExecuteNow: () => void
  onCancel: () => void
}) {
  const { canCancel, canModify, canExecuteNow } = getOmsActionState(order)

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      <button
        type="button"
        onClick={onClose}
        className="absolute inset-0 bg-black/70"
        aria-label="Close order actions"
      />
      <div className="absolute inset-x-0 bottom-0 rounded-t-[28px] border border-zinc-900 bg-zinc-950 p-4">
        <div className="mx-auto h-1.5 w-14 rounded-full bg-zinc-800" />
        <div className="mt-4">
          <p className="text-sm font-black uppercase tracking-widest text-white">{getBrokerOrderTitle(order)}</p>
          <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-600">
            {getBrokerOrderSubtitle(order)}
          </p>
        </div>

        <div className="mt-5 grid gap-3">
          {canModify && (
            <button
              type="button"
              onClick={onModify}
              className="rounded-2xl bg-white px-4 py-4 text-xs font-black uppercase tracking-[0.2em] text-black"
            >
              Modify
            </button>
          )}
          {canExecuteNow && (
            <button
              type="button"
              onClick={onExecuteNow}
              className="rounded-2xl border border-zinc-800 bg-zinc-900/50 px-4 py-4 text-xs font-black uppercase tracking-[0.2em] text-white"
            >
              Execute Now
            </button>
          )}
          {canCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="rounded-2xl border border-zinc-800 bg-zinc-900/50 px-4 py-4 text-xs font-black uppercase tracking-[0.2em] text-white"
            >
              {order.status === 'partially_filled' ? 'Cancel Remaining' : 'Cancel'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

function FilterChip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-3 py-2 text-[10px] font-black uppercase tracking-widest ${
        active ? 'bg-zinc-800 text-white' : 'bg-zinc-900/60 text-zinc-500'
      }`}
    >
      {label}
    </button>
  )
}

function SortChip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-3 py-2 text-[10px] font-black uppercase tracking-widest ${
        active ? 'bg-white text-black' : 'bg-zinc-900/60 text-zinc-500'
      }`}
    >
      {label}
    </button>
  )
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
    const palette: Record<OptionsOrder['side'], string> = {
      buy_to_open: 'bg-[#F04438]/15 text-[#F04438]',
      buy_to_close: 'bg-[#F04438]/15 text-[#F04438]',
      sell_to_open: 'bg-[#2E6BE6]/15 text-[#2E6BE6]',
      sell_to_close: 'bg-[#2E6BE6]/15 text-[#2E6BE6]',
    }

    return (
      <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-widest ${palette[order.side]}`}>
        {order.side.replaceAll('_', ' ')}
      </span>
    )
  }

  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-widest ${
      order.type === 'buy' ? 'bg-[#F04438]/15 text-[#F04438]' : 'bg-[#2E6BE6]/15 text-[#2E6BE6]'
    }`}>
      {order.type.toUpperCase()}
    </span>
  )
}

function TypeBadge({ order }: { order: BrokerOrder }) {
  return (
    <span className="inline-flex items-center rounded-full bg-zinc-800 px-2.5 py-1 text-[10px] font-black uppercase tracking-widest text-zinc-300">
      {isOptionsOrder(order)
        ? order.priceType === 'market'
          ? 'MKT'
          : `LMT ${formatCurrency(order.limitPrice ?? 0)}`
        : order.orderType === 'market'
          ? 'MKT'
          : `LMT ${formatCurrency(order.price)}`}
    </span>
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
      {status === 'submitted' ? 'working' : status === 'partially_filled' ? 'partial' : status.replace('_', ' ')}
    </span>
  )
}

function getExecutionSummary(order: BrokerOrder) {
  const filled = getBrokerOrderFilled(order)
  const total = getBrokerOrderTotalUnits(order)
  const units = isOptionsOrder(order) ? 'contracts' : 'shares'

  if (order.status === 'cancelled') {
    return `Filled ${filled} / ${total} ${units}, Cancelled remaining`
  }

  return `Filled ${filled} / ${total} ${units}`
}

function getProgressLabel(order: BrokerOrder) {
  const percent = Math.round(getBrokerOrderProgress(order) * 100)
  if (order.status === 'submitted') return '0%'
  if (order.status === 'cancelled') return `${percent}% closed`
  return `${percent}%`
}

function getDistanceLabel(order: BrokerOrder) {
  const distance = getBrokerLimitDistance(order)
  if (distance === null) return 'Market'

  return `${distance >= 0 ? '+' : ''}${distance.toFixed(2)}%`
}

function getProgressBarClass(status: OrderStatus) {
  switch (status) {
    case 'submitted':
      return 'bg-blue-400'
    case 'partially_filled':
      return 'bg-amber-400'
    case 'filled':
      return 'bg-emerald-400'
    case 'cancelled':
      return 'bg-zinc-500'
    case 'pending':
      return 'bg-amber-400'
    default:
      return 'bg-zinc-500'
  }
}
