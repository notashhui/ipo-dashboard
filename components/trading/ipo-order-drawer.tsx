'use client'

import { useState } from 'react'
import { X, Minus, Plus, ChevronUp, ChevronDown, Check } from 'lucide-react'
import type { IPOStock, IpoOrder } from '@/lib/types'
import {
  getMedianIssuePrice,
  getResultAt,
  getGrayAt,
  getListAt,
} from '@/lib/ipo-utils'

const IPO_ORDERS_KEY = 'ipo-orders'

interface IpoOrderDrawerProps {
  ipo: IPOStock
  onClose: () => void
  onSubmit?: (order: IpoOrder) => void
  onNavigateToTrade?: () => void
  availableBalance?: number
}

export function IpoOrderDrawer({
  ipo,
  onClose,
  onSubmit,
  onNavigateToTrade,
  availableBalance = 0,
}: IpoOrderDrawerProps) {
  const defaultPrice = getMedianIssuePrice(ipo)
  const [price, setPrice] = useState(defaultPrice)
  const [qtyMode, setQtyMode] = useState<'shares' | 'lots'>('shares')
  const [quantity, setQuantity] = useState(0)
  const [showSuccess, setShowSuccess] = useState(false)

  const lotSize = ipo.lotSize
  const shares = qtyMode === 'shares' ? quantity : quantity * lotSize
  const estimatedTotal = price * shares

  const isValidQty =
    qtyMode === 'shares'
      ? quantity >= lotSize && quantity % lotSize === 0
      : quantity >= 1
  const canSubmit = isValidQty && shares > 0

  const handlePriceChange = (delta: number) => {
    const step = ipo.currency === 'HKD' ? 0.001 : 0.01
    const newPrice = Math.max(step, price + delta)
    setPrice(Number(newPrice.toFixed(ipo.currency === 'HKD' ? 3 : 2)))
  }

  const handleQtyChange = (value: string) => {
    const num = parseInt(value, 10) || 0
    setQuantity(Math.max(0, num))
  }

  const handleSubmit = () => {
    if (!canSubmit) return

    const resultAt = getResultAt(ipo)
    const grayAt = getGrayAt(ipo)
    const listAt = getListAt(ipo)
    const unlockAt = grayAt.getTime() <= listAt.getTime() ? grayAt : listAt

    const order: IpoOrder = {
      id: `IPO-${Date.now()}`,
      type: 'IPO',
      symbol: ipo.symbol,
      name: ipo.name,
      side: 'BUY',
      price,
      shares,
      lotSize,
      createdAt: new Date().toISOString(),
      status: 'Queued',
      stage: 'Subscription',
      unlockAt: unlockAt.toISOString(),
      resultAt: resultAt.toISOString(),
      grayAt: grayAt.toISOString(),
      listAt: listAt.toISOString(),
      currency: ipo.currency,
    }

    setShowSuccess(true)
    setTimeout(() => {
      if (onSubmit) {
        onSubmit(order)
      } else {
        try {
          const raw = localStorage.getItem(IPO_ORDERS_KEY) || '[]'
          const list = JSON.parse(raw)
          list.unshift(order)
          localStorage.setItem(IPO_ORDERS_KEY, JSON.stringify(list))
        } catch (_) {}
      }
      setShowSuccess(false)
      onClose()
      onNavigateToTrade?.()
    }, 2500)
  }

  if (showSuccess) {
    return (
      <div className="fixed inset-0 z-[100] flex items-end justify-center">
        <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" />
        <div className="relative w-full max-w-[430px] bg-zinc-950 rounded-t-[32px] p-6 animate-in slide-in-from-bottom duration-300">
          <div className="flex justify-center mb-6">
            <div className="w-12 h-1 bg-zinc-800 rounded-full" />
          </div>
          <div className="flex items-center justify-between mb-16">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-xl flex items-center justify-center text-white font-black text-sm bg-[#F04438]">
                {ipo.symbol.slice(0, 4)}
              </div>
              <div>
                <h3 className="font-black text-lg italic tracking-tight">IPO ORDER</h3>
                <p className="text-[11px] font-bold text-zinc-600 tracking-wide">
                  {ipo.symbol} · {ipo.name}
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
          <div className="flex flex-col items-center justify-center py-12">
            <div className="relative">
              <div className="absolute inset-0 w-32 h-32 rounded-full bg-emerald-500/10 animate-ping" style={{ animationDuration: '2s' }} />
              <div className="absolute inset-2 w-28 h-28 rounded-full bg-emerald-500/20 animate-ping" style={{ animationDuration: '2s', animationDelay: '0.3s' }} />
              <div className="relative w-32 h-32 rounded-full bg-emerald-500/30 flex items-center justify-center">
                <div className="w-24 h-24 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                  <Check size={48} strokeWidth={3} className="text-white" />
                </div>
              </div>
            </div>
            <h2 className="text-2xl font-black italic tracking-tight mt-10 text-white">
              IPO ORDER PLACED
            </h2>
            <p className="text-sm font-bold text-emerald-500 tracking-widest uppercase mt-3">
              Pending · Queued
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-[430px] bg-zinc-950 rounded-t-[32px] p-6 animate-in slide-in-from-bottom duration-300">
        <div className="flex justify-center mb-6">
          <div className="w-12 h-1 bg-zinc-800 rounded-full" />
        </div>

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-xl flex items-center justify-center text-white font-black text-sm bg-[#F04438]">
              {ipo.symbol.slice(0, 4)}
            </div>
            <div>
              <h3 className="font-black text-lg italic tracking-tight">Place IPO Order</h3>
              <p className="text-[11px] font-bold text-zinc-600 tracking-wide">
                {ipo.symbol} · Min {lotSize} shares per lot
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

        <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-2">
          AVAIL: {ipo.currency === 'HKD' ? 'HK$' : '$'}{availableBalance.toLocaleString()}
        </p>

        {/* Quantity: Shares / Lots toggle */}
        <div className="bg-zinc-900/60 rounded-full p-1 flex mb-4">
          <button
            type="button"
            onClick={() => setQtyMode('shares')}
            className={`flex-1 py-2.5 rounded-full text-[11px] font-black uppercase tracking-wider transition-all ${
              qtyMode === 'shares' ? 'bg-zinc-800 text-white' : 'text-zinc-600'
            }`}
          >
            Shares
          </button>
          <button
            type="button"
            onClick={() => setQtyMode('lots')}
            className={`flex-1 py-2.5 rounded-full text-[11px] font-black uppercase tracking-wider transition-all ${
              qtyMode === 'lots' ? 'bg-zinc-800 text-white' : 'text-zinc-600'
            }`}
          >
            Lots
          </button>
        </div>

        <div className="bg-zinc-900/40 rounded-2xl p-5 mb-4 border border-zinc-900">
          <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-4">
            Quantity ({qtyMode === 'shares' ? 'Shares' : 'Lots'})
          </p>
          <input
            type="number"
            min={qtyMode === 'shares' ? lotSize : 1}
            step={qtyMode === 'shares' ? lotSize : 1}
            value={quantity || ''}
            onChange={(e) => handleQtyChange(e.target.value)}
            placeholder={qtyMode === 'shares' ? `Min ${lotSize}` : '1'}
            className="w-full text-center text-3xl font-black tabular-nums tracking-tight bg-transparent focus:outline-none placeholder:text-zinc-800"
          />
          {qtyMode === 'lots' && quantity > 0 && (
            <p className="text-[10px] text-zinc-600 mt-2 text-center">= {shares} shares</p>
          )}
        </div>

        {/* Price */}
        <div className="bg-zinc-900/40 rounded-2xl p-5 mb-4 border border-zinc-900">
          <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-4">
            Price ({ipo.currency})
          </p>
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => handlePriceChange(ipo.currency === 'HKD' ? -0.001 : -0.01)}
              className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center hover:bg-zinc-700 active:scale-95"
            >
              <Minus size={18} className="text-zinc-400" />
            </button>
            <div className="flex items-center gap-2">
              <span className="text-3xl font-black tabular-nums tracking-tight">
                {price.toFixed(ipo.currency === 'HKD' ? 3 : 2)}
              </span>
              <div className="flex flex-col gap-0.5">
                <button
                  type="button"
                  onClick={() => handlePriceChange(ipo.currency === 'HKD' ? 0.001 : 0.01)}
                  className="p-1 hover:bg-zinc-800 rounded"
                >
                  <ChevronUp size={12} className="text-zinc-600" />
                </button>
                <button
                  type="button"
                  onClick={() => handlePriceChange(ipo.currency === 'HKD' ? -0.001 : -0.01)}
                  className="p-1 hover:bg-zinc-800 rounded"
                >
                  <ChevronDown size={12} className="text-zinc-600" />
                </button>
              </div>
            </div>
            <button
              type="button"
              onClick={() => handlePriceChange(ipo.currency === 'HKD' ? 0.001 : 0.01)}
              className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center hover:bg-zinc-700 active:scale-95"
            >
              <Plus size={18} className="text-zinc-400" />
            </button>
          </div>
        </div>

        <div className="bg-zinc-900/40 rounded-2xl p-5 mb-6 border border-zinc-900">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">
              Estimated Total
            </span>
            <span className="text-xl font-black tabular-nums">
              {ipo.currency === 'HKD' ? 'HK$' : '$'}{estimatedTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={!canSubmit}
          className="w-full py-5 rounded-xl font-black text-sm uppercase tracking-[0.3em] transition-all disabled:opacity-30 disabled:cursor-not-allowed bg-[#F04438] text-white shadow-lg shadow-[#F04438]/20 hover:bg-[#F04438]/90"
        >
          Submit IPO Order
        </button>

        <div className="h-6" />
      </div>
    </div>
  )
}
