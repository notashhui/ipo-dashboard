'use client'

import { useState } from 'react'
import { X, Minus, Plus, ChevronUp, ChevronDown, Check } from 'lucide-react'
import type { Stock, Order } from '@/lib/types'

interface OrderDrawerProps {
  stock: Stock
  type: 'buy' | 'sell'
  onClose: () => void
  onSubmit: (order: Order) => void
  onNavigateToTrade?: () => void
  availableBalance: number
}

// Generate reference ID
const generateRefId = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let result = 'TX'
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

export function OrderDrawer({ 
  stock, 
  type, 
  onClose, 
  onSubmit, 
  onNavigateToTrade,
  availableBalance 
}: OrderDrawerProps) {
  const [orderType, setOrderType] = useState<'limit' | 'market'>('limit')
  const [price, setPrice] = useState(stock.price)
  const [quantity, setQuantity] = useState(0)
  const [showSuccess, setShowSuccess] = useState(false)

  const estimatedTotal = price * quantity
  const isBuy = type === 'buy'

  const handlePriceChange = (delta: number) => {
    const newPrice = Math.max(0.01, price + delta)
    setPrice(Number(newPrice.toFixed(2)))
  }

  const handleQuantityChange = (value: string) => {
    const num = Number.parseInt(value) || 0
    setQuantity(Math.max(0, num))
  }

  const handleSubmit = () => {
    if (quantity <= 0) return
    
    // Limit orders are PENDING, Market orders are immediately FILLED
    const status = orderType === 'limit' ? 'pending' : 'filled'
    
    const order: Order = {
      id: `ORD-${Date.now()}`,
      refId: generateRefId(),
      symbol: stock.symbol,
      name: stock.name,
      type,
      orderType,
      price: orderType === 'market' ? stock.price : price,
      quantity,
      total: estimatedTotal,
      status,
      timestamp: new Date()
    }
    
    setShowSuccess(true)
    
    setTimeout(() => {
      onSubmit(order)
      setShowSuccess(false)
      onClose()
      // Navigate to Trade tab after 2.5 seconds
      onNavigateToTrade?.()
    }, 2500)
  }

  // Success Overlay
  if (showSuccess) {
    return (
      <div className="fixed inset-0 z-[100] flex items-end justify-center">
        <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" />
        
        <div className="relative w-full max-w-[430px] bg-zinc-950 rounded-t-[32px] p-6 animate-in slide-in-from-bottom duration-300">
          {/* Drag Handle */}
          <div className="flex justify-center mb-6">
            <div className="w-12 h-1 bg-zinc-800 rounded-full" />
          </div>

          {/* Header */}
          <div className="flex items-center justify-between mb-16">
            <div className="flex items-center gap-3">
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-white font-black text-sm ${
                isBuy ? 'bg-[#F04438]' : 'bg-[#2E6BE6]'
              }`}>
                {stock.symbol.slice(0, 4)}
              </div>
              <div>
                <h3 className="font-black text-lg italic tracking-tight">
                  {isBuy ? 'BUY' : 'SELL'} {stock.symbol}
                </h3>
                <p className="text-[11px] font-bold text-zinc-600 tracking-wide">
                  AVAIL: ${availableBalance.toLocaleString()}
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

          {/* Success Animation */}
          <div className="flex flex-col items-center justify-center py-12">
            {/* Pulsing Checkmark */}
            <div className="relative">
              {/* Outer glow rings */}
              <div className="absolute inset-0 w-32 h-32 rounded-full bg-emerald-500/10 animate-ping" style={{ animationDuration: '2s' }} />
              <div className="absolute inset-2 w-28 h-28 rounded-full bg-emerald-500/20 animate-ping" style={{ animationDuration: '2s', animationDelay: '0.3s' }} />
              
              {/* Main circle */}
              <div className="relative w-32 h-32 rounded-full bg-emerald-500/30 flex items-center justify-center">
                <div className="w-24 h-24 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                  <Check size={48} strokeWidth={3} className="text-white" />
                </div>
              </div>
            </div>

            {/* Success Text */}
            <h2 className="text-2xl font-black italic tracking-tight mt-10 text-white">
              EXECUTION SUCCESSFUL
            </h2>
            <p className="text-sm font-bold text-emerald-500 tracking-widest uppercase mt-3">
              Registry Update Complete
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className="relative w-full max-w-[430px] bg-zinc-950 rounded-t-[32px] p-6 animate-in slide-in-from-bottom duration-300">
        {/* Drag Handle */}
        <div className="flex justify-center mb-6">
          <div className="w-12 h-1 bg-zinc-800 rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-white font-black text-sm ${
              isBuy ? 'bg-[#F04438]' : 'bg-[#2E6BE6]'
            }`}>
              {stock.symbol.slice(0, 4)}
            </div>
            <div>
              <h3 className="font-black text-lg italic tracking-tight">
                {isBuy ? 'BUY' : 'SELL'} {stock.symbol}
              </h3>
              <p className="text-[11px] font-bold text-zinc-600 tracking-wide">
                AVAIL: ${availableBalance.toLocaleString()}
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

        {/* Order Type Toggle */}
        <div className="bg-zinc-900/60 rounded-full p-1 flex mb-6">
          <button
            onClick={() => setOrderType('limit')}
            className={`flex-1 py-3 rounded-full text-[11px] font-black uppercase tracking-[0.2em] transition-all ${
              orderType === 'limit' 
                ? 'bg-zinc-800 text-white' 
                : 'text-zinc-600'
            }`}
          >
            Limit
          </button>
          <button
            onClick={() => setOrderType('market')}
            className={`flex-1 py-3 rounded-full text-[11px] font-black uppercase tracking-[0.2em] transition-all ${
              orderType === 'market' 
                ? 'bg-zinc-800 text-white' 
                : 'text-zinc-600'
            }`}
          >
            Market
          </button>
        </div>

        {/* Price Input */}
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

        {/* Market Price Notice */}
        {orderType === 'market' && (
          <div className="bg-zinc-900/40 rounded-2xl p-5 mb-4 border border-zinc-900">
            <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-2">
              Market Price
            </p>
            <p className="text-3xl font-black tabular-nums text-center">
              ${stock.price.toFixed(2)}
            </p>
            <p className="text-[10px] text-center text-zinc-600 mt-2">
              Order will execute at best available price
            </p>
          </div>
        )}

        {/* Quantity Input */}
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

        {/* Estimated Transaction */}
        <div className="bg-zinc-900/40 rounded-2xl p-5 mb-6 border border-zinc-900">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">
              Estimated Transaction
            </span>
            <span className="text-xl font-black tabular-nums">
              ${estimatedTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-zinc-700 uppercase tracking-widest">
              Trading Commission
            </span>
            <span className="text-[11px] font-bold text-emerald-500">
              $0.00 (Commission Free)
            </span>
          </div>
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={quantity <= 0}
          className={`w-full py-5 rounded-xl font-black text-sm uppercase tracking-[0.3em] transition-all disabled:opacity-30 disabled:cursor-not-allowed ${
            isBuy 
              ? 'bg-[#F04438] text-white shadow-lg shadow-[#F04438]/20 hover:bg-[#F04438]/90' 
              : 'bg-[#2E6BE6] text-white shadow-lg shadow-[#2E6BE6]/20 hover:bg-[#2E6BE6]/90'
          }`}
        >
          {isBuy ? 'Confirm Buy' : 'Confirm Sell'}
        </button>

        {/* Safe Area Padding */}
        <div className="h-6" />
      </div>
    </div>
  )
}
