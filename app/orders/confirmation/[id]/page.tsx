'use client'

import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { CheckCircle2, ChevronLeft, ChevronRight, FileText, ListOrdered } from 'lucide-react'
import { useStockOrders } from '@/hooks/use-stock-orders'
import { useOptionsOrders } from '@/hooks/use-options-orders'
import { isOptionsOrder } from '@/lib/broker-orders'

const formatCurrency = (value: number) =>
  `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

export default function OrderConfirmationPage() {
  const params = useParams()
  const router = useRouter()
  const orderId = typeof params.id === 'string' ? params.id : ''
  const { orders: stockOrders, isHydrated: stockHydrated } = useStockOrders()
  const { orders: optionsOrders, isHydrated: optionsHydrated } = useOptionsOrders()
  const isHydrated = stockHydrated && optionsHydrated
  const order = stockOrders.find((entry) => entry.id === orderId) ?? optionsOrders.find((entry) => entry.id === orderId)

  const handleBack = () => {
    if (typeof window === 'undefined' || window.history.length <= 1) {
      router.push('/')
      return
    }

    const currentPath = window.location.pathname
    router.back()

    window.setTimeout(() => {
      if (window.location.pathname === currentPath) {
        router.push('/')
      }
    }, 120)
  }

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
          <p className="mt-2 text-xs text-zinc-500">The submitted order could not be loaded from local order history.</p>
          <Link
            href="/"
            className="mt-6 inline-flex items-center justify-center rounded-xl bg-white px-4 py-3 text-xs font-black uppercase tracking-widest text-black"
          >
            Return Home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black px-4 py-6 text-white">
      <div className="mx-auto max-w-[430px]">
        <div className="mb-4 flex items-center justify-between">
          <button
            type="button"
            onClick={handleBack}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-900 hover:bg-zinc-800"
            aria-label="Go back"
          >
            <ChevronLeft size={20} className="text-zinc-400" />
          </button>
          <div className="w-10 h-10" />
        </div>

        <div className="rounded-[32px] border border-zinc-900 bg-zinc-950 p-6">
          <div className="flex flex-col items-center text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/15">
              <CheckCircle2 size={32} className="text-emerald-400" />
            </div>
            <h1 className="mt-5 text-2xl font-black italic tracking-tight">ORDER SUBMITTED</h1>
            <p className="mt-2 text-[11px] font-bold uppercase tracking-[0.25em] text-emerald-400">
              Status: submitted
            </p>
            <p className="mt-3 text-sm text-zinc-400">
              Your {isOptionsOrder(order) ? 'options' : 'stock'} order has been accepted and is waiting for execution.
            </p>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-4 rounded-2xl border border-zinc-900 bg-zinc-900/40 p-5">
            {isOptionsOrder(order) ? (
              <>
                <SummaryItem label="Underlying" value={order.contract.underlying} />
                <SummaryItem label="Side" value={order.side.replaceAll('_', ' ')} />
                <SummaryItem label="Expiration" value={order.contract.expiration} />
                <SummaryItem label="Strike" value={order.contract.strike.toFixed(2)} />
                <SummaryItem label="Right" value={order.contract.right.toUpperCase()} />
                <SummaryItem label="Order Type" value={order.priceType.toUpperCase()} />
                <SummaryItem label="Quantity" value={`${order.quantityContracts} contracts`} />
                <SummaryItem label="Price" value={order.priceType === 'market' ? 'Market' : formatCurrency(order.limitPrice ?? 0)} />
                <SummaryItem label="Estimated Cost" value={formatCurrency(order.estimatedCost)} />
                <SummaryItem label="Fees" value={formatCurrency(order.fees)} />
              </>
            ) : (
              <>
                <SummaryItem label="Ticker" value={order.symbol} />
                <SummaryItem label="Side" value={order.type.toUpperCase()} />
                <SummaryItem label="Order Type" value={order.orderType.toUpperCase()} />
                <SummaryItem label="Quantity" value={`${order.quantity} shares`} />
                <SummaryItem label="Price" value={order.orderType === 'market' ? `Est. ${formatCurrency(order.price)}` : formatCurrency(order.price)} />
                <SummaryItem label="Estimated Cost" value={formatCurrency(order.total)} />
              </>
            )}
          </div>

          <div className="mt-6 rounded-2xl border border-zinc-900 bg-zinc-900/30 p-4">
            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Reference</p>
            <p className="mt-2 text-sm font-black">{order.refId}</p>
            <p className="mt-2 text-xs text-zinc-500">
              Submitted at {new Date(order.timestamps?.submittedAt ?? order.timestamp).toLocaleString()}
            </p>
          </div>

          <div className="mt-8 space-y-3">
            <Link
              href={`/orders/${order.id}`}
              className="flex items-center justify-between rounded-2xl border border-zinc-900 bg-zinc-900/40 px-4 py-4"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/15">
                  <FileText size={18} className="text-blue-400" />
                </div>
                <div>
                  <p className="text-sm font-black">View order details</p>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Timeline and status updates</p>
                </div>
              </div>
              <ChevronRight size={18} className="text-zinc-600" />
            </Link>

            <Link
              href="/orders"
              className="flex items-center justify-between rounded-2xl border border-zinc-900 bg-zinc-900/40 px-4 py-4"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/15">
                  <ListOrdered size={18} className="text-amber-400" />
                </div>
                <div>
                  <p className="text-sm font-black">Go to Orders</p>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Open and completed orders</p>
                </div>
              </div>
              <ChevronRight size={18} className="text-zinc-600" />
            </Link>
          </div>

          <button
            type="button"
            onClick={() => router.push('/')}
            className="mt-8 w-full rounded-2xl bg-white px-4 py-4 text-sm font-black uppercase tracking-[0.25em] text-black"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  )
}

function SummaryItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[9px] font-bold uppercase tracking-widest text-zinc-600">{label}</p>
      <p className="mt-1 text-sm font-black text-white">{value}</p>
    </div>
  )
}
