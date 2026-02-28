'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ChevronLeft, ChevronRight, Clock3, ListOrdered } from 'lucide-react'
import type { Order, OrderStatus } from '@/lib/types'
import { useStockOrders } from '@/hooks/use-stock-orders'

type FilterTab = 'open' | 'completed'
type OpenQuickFilter = 'all' | 'submitted' | 'partially_filled'
type SortMode = 'created' | 'updated'

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
  const router = useRouter()
  const { orders, isHydrated } = useStockOrders()
  const [activeTab, setActiveTab] = useState<FilterTab>('open')
  const [openQuickFilter, setOpenQuickFilter] = useState<OpenQuickFilter>('all')
  const [sortMode, setSortMode] = useState<SortMode>('created')

  const sortedOrders = useMemo(() => {
    return [...orders].sort((a, b) => {
      const left = sortMode === 'created'
        ? new Date(a.timestamps?.createdAt ?? a.timestamp).getTime()
        : new Date(a.timestamps?.updatedAt ?? a.timestamp).getTime()
      const right = sortMode === 'created'
        ? new Date(b.timestamps?.createdAt ?? b.timestamp).getTime()
        : new Date(b.timestamps?.updatedAt ?? b.timestamp).getTime()

      return right - left
    })
  }, [orders, sortMode])

  const visibleOrders = useMemo(() => {
    const scoped = sortedOrders.filter((order) =>
      (activeTab === 'open' ? OPEN_STATUSES : COMPLETED_STATUSES).includes(order.status)
    )

    if (activeTab !== 'open' || openQuickFilter === 'all') {
      return scoped
    }

    return scoped.filter((order) => order.status === openQuickFilter)
  }, [activeTab, openQuickFilter, sortedOrders])

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
            <p className="text-sm font-black uppercase tracking-widest">Orders</p>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-600">Broker blotter</p>
          </div>
          <div className="w-10 h-10" />
        </div>

        <div className="mt-6 bg-zinc-950 border border-zinc-900 rounded-[28px] p-4">
          <div className="bg-zinc-900/60 rounded-full p-1 flex">
            <button
              type="button"
              onClick={() => setActiveTab('open')}
              className={`flex-1 py-3 rounded-full text-[11px] font-black uppercase tracking-[0.2em] transition-all ${
                activeTab === 'open' ? 'bg-zinc-800 text-white' : 'text-zinc-600'
              }`}
            >
              Open
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('completed')}
              className={`flex-1 py-3 rounded-full text-[11px] font-black uppercase tracking-[0.2em] transition-all ${
                activeTab === 'completed' ? 'bg-zinc-800 text-white' : 'text-zinc-600'
              }`}
            >
              Completed
            </button>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <SortChip
              label="Created Time"
              active={sortMode === 'created'}
              onClick={() => setSortMode('created')}
            />
            <SortChip
              label="Last Updated"
              active={sortMode === 'updated'}
              onClick={() => setSortMode('updated')}
            />
          </div>

          {activeTab === 'open' && (
            <div className="mt-3 flex flex-wrap gap-2">
              <FilterChip
                label="All Open"
                active={openQuickFilter === 'all'}
                onClick={() => setOpenQuickFilter('all')}
              />
              <FilterChip
                label="Submitted"
                active={openQuickFilter === 'submitted'}
                onClick={() => setOpenQuickFilter('submitted')}
              />
              <FilterChip
                label="Partially Filled"
                active={openQuickFilter === 'partially_filled'}
                onClick={() => setOpenQuickFilter('partially_filled')}
              />
            </div>
          )}

          {!isHydrated ? (
            <div className="py-16 text-center">
              <p className="text-sm font-bold text-zinc-500 uppercase tracking-widest">Loading orders</p>
            </div>
          ) : visibleOrders.length === 0 ? (
            <div className="py-16 text-center">
              <div className="mx-auto w-16 h-16 rounded-full bg-zinc-900 flex items-center justify-center">
                <ListOrdered size={28} className="text-zinc-700" />
              </div>
              <p className="mt-4 text-sm font-bold text-zinc-400">
                {activeTab === 'open' ? 'No open orders' : 'No completed orders'}
              </p>
              <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-zinc-600">
                Submitted stock orders will appear here
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
                <button
                  key={order.id}
                  type="button"
                  onClick={() => router.push(`/orders/${order.id}`)}
                  className="w-full rounded-2xl border border-zinc-900 bg-zinc-900/30 p-4 text-left hover:bg-zinc-900/50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-base font-black text-white">{order.symbol}</p>
                        <SideBadge side={order.type} />
                        <TypeBadge order={order} />
                      </div>
                      <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-zinc-600">
                        Ref {order.refId}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <OrderStatusBadge status={order.status} />
                      <ChevronRight size={16} className="text-zinc-700 shrink-0" />
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-[9px] font-bold uppercase tracking-widest text-zinc-600">
                        {sortMode === 'created' ? 'Created' : 'Last Updated'}
                      </p>
                      <p className="mt-1 text-xs font-bold text-zinc-300">
                        {formatTimestamp(sortMode === 'created'
                          ? (order.timestamps?.createdAt ?? order.timestamp)
                          : (order.timestamps?.updatedAt ?? order.timestamp))}
                      </p>
                    </div>

                    <div>
                      <p className="text-[9px] font-bold uppercase tracking-widest text-zinc-600">Execution</p>
                      <p className="mt-1 text-xs font-bold text-zinc-300">{getExecutionSummary(order)}</p>
                    </div>

                    <div>
                      <p className="text-[9px] font-bold uppercase tracking-widest text-zinc-600">
                        {order.orderType === 'limit' ? 'Limit Price' : 'Market Price'}
                      </p>
                      <p className="mt-1 text-xs font-bold text-zinc-300">
                        {order.orderType === 'limit' ? formatCurrency(order.price) : 'Market'}
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
                    <div className="mt-2 h-1.5 rounded-full bg-zinc-800 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${getProgressBarClass(order.status)}`}
                        style={{ width: `${Math.max(0, Math.min(100, Math.round((order.execution?.progress ?? 0) * 100)))}%` }}
                      />
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {isHydrated && visibleOrders.length > 0 && (
          <div className="mt-4 rounded-2xl border border-zinc-900 bg-zinc-950/70 px-4 py-3 flex items-center justify-between gap-3">
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
    </div>
  )
}

function FilterChip({
  label,
  active,
  onClick,
}: {
  label: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-3 py-2 text-[10px] font-black uppercase tracking-widest transition-all ${
        active ? 'bg-zinc-800 text-white' : 'bg-zinc-900/60 text-zinc-500'
      }`}
    >
      {label}
    </button>
  )
}

function SortChip({
  label,
  active,
  onClick,
}: {
  label: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-3 py-2 text-[10px] font-black uppercase tracking-widest transition-all ${
        active ? 'bg-white text-black' : 'bg-zinc-900/60 text-zinc-500'
      }`}
    >
      {label}
    </button>
  )
}

function SideBadge({ side }: { side: Order['type'] }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-widest ${
      side === 'buy' ? 'bg-[#F04438]/15 text-[#F04438]' : 'bg-[#2E6BE6]/15 text-[#2E6BE6]'
    }`}>
      {side.toUpperCase()}
    </span>
  )
}

function TypeBadge({ order }: { order: Order }) {
  return (
    <span className="inline-flex items-center rounded-full bg-zinc-800 px-2.5 py-1 text-[10px] font-black uppercase tracking-widest text-zinc-300">
      {order.orderType === 'market' ? 'MKT' : `LMT ${formatCurrency(order.price)}`}
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
      {status.replace('_', ' ')}
    </span>
  )
}

function getExecutionSummary(order: Order) {
  const filled = order.execution?.filledQuantity ?? 0
  const total = order.quantity

  if (order.status === 'cancelled') {
    return `Filled ${filled} / ${total}, Cancelled remaining`
  }

  return `Filled ${filled} / ${total}`
}

function getProgressLabel(order: Order) {
  const percent = Math.round((order.execution?.progress ?? 0) * 100)

  if (order.status === 'submitted') return '0%'
  if (order.status === 'cancelled') return `${percent}% closed`

  return `${percent}%`
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
