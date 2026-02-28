'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { X, Minus, Plus, ChevronUp, ChevronDown, ArrowLeft, ShieldAlert } from 'lucide-react'
import type { Stock, Order } from '@/lib/types'

interface OrderDrawerProps {
  stock: Stock
  type: 'buy' | 'sell'
  onClose: () => void
  onSubmit: (order: Order) => void
  onNavigateToTrade?: () => void
  availableBalance: number
}

type DrawerStep = 'ticket' | 'review'

const generateRefId = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let result = 'TX'
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

const formatCurrency = (value: number) =>
  `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

export function OrderDrawer({
  stock,
  type,
  onClose,
  onSubmit,
  onNavigateToTrade,
  availableBalance,
}: OrderDrawerProps) {
  const router = useRouter()
  const [step, setStep] = useState<DrawerStep>('ticket')
  const [orderType, setOrderType] = useState<'limit' | 'market'>('limit')
  const [price, setPrice] = useState(stock.price)
  const [quantity, setQuantity] = useState(0)

  const isBuy = type === 'buy'
  const displayPrice = orderType === 'market' ? stock.price : price
  const estimatedTotal = displayPrice * quantity
  const estimatedFees = quantity > 0 ? Math.max(1.25, estimatedTotal * 0.0012) : 0
  const buyingPowerImpact = isBuy ? estimatedTotal + estimatedFees : Math.max(estimatedTotal - estimatedFees, 0)

  const handlePriceChange = (delta: number) => {
    const newPrice = Math.max(0.01, price + delta)
    setPrice(Number(newPrice.toFixed(2)))
  }

  const handleQuantityChange = (value: string) => {
    const num = Number.parseInt(value, 10) || 0
    setQuantity(Math.max(0, num))
  }

  const handleReview = () => {
    if (quantity <= 0) return
    setStep('review')
  }

  const handleFinalSubmit = () => {
    if (quantity <= 0) return

    const submittedAt = new Date()
    const order: Order = {
      id: `ORD-${Date.now()}`,
      refId: generateRefId(),
      symbol: stock.symbol,
      name: stock.name,
      type,
      orderType,
      price: displayPrice,
      quantity,
      total: estimatedTotal,
      status: 'submitted',
      timestamp: submittedAt,
      timestamps: {
        createdAt: submittedAt.toISOString(),
        updatedAt: submittedAt.toISOString(),
        submittedAt: submittedAt.toISOString(),
      },
      execution: {
        filledQuantity: 0,
        remainingQuantity: quantity,
        progress: 0,
      },
      statusHistory: [
        {
          status: 'submitted',
          timestamp: submittedAt.toISOString(),
          note: 'Order received and routed for execution.',
        },
      ],
    }

    onSubmit(order)
    onClose()
    onNavigateToTrade?.()
    router.push(`/orders/confirmation/${order.id}`)
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center">
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative w-full max-w-[430px] bg-zinc-950 rounded-t-[32px] p-6 animate-in slide-in-from-bottom duration-300">
        <div className="flex justify-center mb-6">
          <div className="w-12 h-1 bg-zinc-800 rounded-full" />
        </div>

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-white font-black text-sm ${
              isBuy ? 'bg-[#F04438]' : 'bg-[#2E6BE6]'
            }`}>
              {stock.symbol.slice(0, 4)}
            </div>
            <div>
              <h3 className="font-black text-lg italic tracking-tight">
                {step === 'ticket' ? `${isBuy ? 'BUY' : 'SELL'} ${stock.symbol}` : 'ORDER REVIEW'}
              </h3>
              <p className="text-[11px] font-bold text-zinc-600 tracking-wide">
                {step === 'ticket'
                  ? `AVAIL: ${formatCurrency(availableBalance)}`
                  : `${stock.symbol} · ${stock.name}`}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center hover:bg-zinc-800"
          >
            <X size={18} className="text-zinc-500" />
          </button>
        </div>

        {step === 'ticket' ? (
          <>
            <div className="bg-zinc-900/60 rounded-full p-1 flex mb-6">
              <button
                onClick={() => setOrderType('limit')}
                className={`flex-1 py-3 rounded-full text-[11px] font-black uppercase tracking-[0.2em] transition-all ${
                  orderType === 'limit' ? 'bg-zinc-800 text-white' : 'text-zinc-600'
                }`}
              >
                Limit
              </button>
              <button
                onClick={() => setOrderType('market')}
                className={`flex-1 py-3 rounded-full text-[11px] font-black uppercase tracking-[0.2em] transition-all ${
                  orderType === 'market' ? 'bg-zinc-800 text-white' : 'text-zinc-600'
                }`}
              >
                Market
              </button>
            </div>

            {orderType === 'limit' && (
              <div className="bg-zinc-900/40 rounded-2xl p-5 mb-4 border border-zinc-900">
                <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-4">
                  Order Price (USD)
                </p>
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => handlePriceChange(-0.01)}
                    className="w-14 h-14 rounded-full bg-zinc-800 flex items-center justify-center hover:bg-zinc-700 active:scale-95"
                  >
                    <Minus size={20} className="text-zinc-400" />
                  </button>

                  <div className="flex items-center gap-2">
                    <span className="text-4xl font-black tabular-nums tracking-tight">
                      {price.toFixed(2)}
                    </span>
                    <div className="flex flex-col gap-0.5">
                      <button
                        onClick={() => handlePriceChange(0.01)}
                        className="p-1 hover:bg-zinc-800 rounded"
                      >
                        <ChevronUp size={14} className="text-zinc-600" />
                      </button>
                      <button
                        onClick={() => handlePriceChange(-0.01)}
                        className="p-1 hover:bg-zinc-800 rounded"
                      >
                        <ChevronDown size={14} className="text-zinc-600" />
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={() => handlePriceChange(0.01)}
                    className="w-14 h-14 rounded-full bg-zinc-800 flex items-center justify-center hover:bg-zinc-700 active:scale-95"
                  >
                    <Plus size={20} className="text-zinc-400" />
                  </button>
                </div>
              </div>
            )}

            {orderType === 'market' && (
              <div className="bg-zinc-900/40 rounded-2xl p-5 mb-4 border border-zinc-900">
                <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-2">
                  Market Price
                </p>
                <p className="text-3xl font-black tabular-nums text-center">
                  {formatCurrency(stock.price)}
                </p>
                <p className="text-[10px] text-center text-zinc-600 mt-2">
                  Order will route at the best available market price.
                </p>
              </div>
            )}

            <div className="bg-zinc-900/40 rounded-2xl p-5 mb-6 border border-zinc-900">
              <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-4">
                Quantity (Shares)
              </p>
              <input
                type="number"
                value={quantity || ''}
                onChange={(e) => handleQuantityChange(e.target.value)}
                placeholder="0"
                className="w-full text-center text-4xl font-black tabular-nums tracking-tight bg-transparent focus:outline-none placeholder:text-zinc-800"
              />
            </div>

            <div className="bg-zinc-900/40 rounded-2xl p-5 mb-6 border border-zinc-900">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">
                  Estimated Transaction
                </span>
                <span className="text-xl font-black tabular-nums">
                  {formatCurrency(estimatedTotal)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-zinc-700 uppercase tracking-widest">
                  Estimated Fees
                </span>
                <span className="text-[11px] font-bold text-zinc-300">
                  {formatCurrency(estimatedFees)}
                </span>
              </div>
            </div>

            <button
              onClick={handleReview}
              disabled={quantity <= 0}
              className={`w-full py-5 rounded-xl font-black text-sm uppercase tracking-[0.3em] transition-all disabled:opacity-30 disabled:cursor-not-allowed ${
                isBuy
                  ? 'bg-[#F04438] text-white shadow-lg shadow-[#F04438]/20 hover:bg-[#F04438]/90'
                  : 'bg-[#2E6BE6] text-white shadow-lg shadow-[#2E6BE6]/20 hover:bg-[#2E6BE6]/90'
              }`}
            >
              Review Order
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              onClick={() => setStep('ticket')}
              className="mb-4 inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-zinc-500 hover:text-white"
            >
              <ArrowLeft size={14} />
              Edit Ticket
            </button>

            <div className="space-y-4">
              <div className="bg-zinc-900/40 rounded-2xl p-5 border border-zinc-900">
                <div className="grid grid-cols-2 gap-4">
                  <ReviewField label="Ticker" value={stock.symbol} />
                  <ReviewField label="Side" value={type.toUpperCase()} accent={isBuy ? 'text-[#F04438]' : 'text-[#2E6BE6]'} />
                  <ReviewField label="Order Type" value={orderType.toUpperCase()} />
                  <ReviewField label="Quantity" value={`${quantity} shares`} />
                  <ReviewField label="Limit Price" value={orderType === 'limit' ? formatCurrency(price) : 'Market'} />
                  <ReviewField label="Estimated Cost" value={formatCurrency(estimatedTotal)} />
                  <ReviewField label="Estimated Fees" value={formatCurrency(estimatedFees)} />
                  <ReviewField
                    label="Buying Power Impact"
                    value={`${isBuy ? '-' : '+'}${formatCurrency(buyingPowerImpact)}`}
                    accent={isBuy ? 'text-amber-400' : 'text-emerald-400'}
                  />
                </div>
              </div>

              <div className="bg-amber-500/10 rounded-2xl p-4 border border-amber-500/20">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 w-9 h-9 rounded-xl bg-amber-500/15 flex items-center justify-center">
                    <ShieldAlert size={18} className="text-amber-400" />
                  </div>
                  <div>
                    <p className="text-[11px] font-black uppercase tracking-widest text-amber-300">
                      Risk Disclosure
                    </p>
                    <p className="text-xs text-zinc-300 mt-2 leading-relaxed">
                      Market conditions may change between submission and execution. Final execution price, fees,
                      and fill quantity can differ from these estimates.
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={handleFinalSubmit}
                className={`w-full py-5 rounded-xl font-black text-sm uppercase tracking-[0.3em] transition-all ${
                  isBuy
                    ? 'bg-[#F04438] text-white shadow-lg shadow-[#F04438]/20 hover:bg-[#F04438]/90'
                    : 'bg-[#2E6BE6] text-white shadow-lg shadow-[#2E6BE6]/20 hover:bg-[#2E6BE6]/90'
                }`}
              >
                Place Order
              </button>
            </div>
          </>
        )}

        <div className="h-6" />
      </div>
    </div>
  )
}

function ReviewField({
  label,
  value,
  accent = 'text-white',
}: {
  label: string
  value: string
  accent?: string
}) {
  return (
    <div>
      <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest mb-1">{label}</p>
      <p className={`text-sm font-black ${accent}`}>{value}</p>
    </div>
  )
}
