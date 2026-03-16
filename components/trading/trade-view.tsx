'use client'

import { useState, useEffect } from 'react'
import { Search, Bell, Filter, Clock, Trash2, TrendingUp, ShieldCheck, ChevronRight, PieChart, ChevronLeft } from 'lucide-react'
import type { Order, IpoOrder } from '@/lib/types'
import { IpoOrderCard } from './ipo-order-card'

interface TradeViewProps {
  orders?: Order[]
  ipoOrders?: IpoOrder[]
  onCancelOrder?: (orderId: string) => void
  optionsTicker?: string
}

export function TradeView({ orders = [], ipoOrders = [], onCancelOrder, optionsTicker }: TradeViewProps) {
  const [activeTab, setActiveTab] = useState<'active' | 'logs' | 'ipo' | 'options'>('active')

  useEffect(() => {
    if (optionsTicker) setActiveTab('options')
  }, [optionsTicker])
  const [currentTime, setCurrentTime] = useState(new Date())

  // Update time every second for the live clock
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const pendingOrders = orders.filter(o => o.status === 'pending')
  const completedOrders = orders.filter(o => o.status === 'filled' || o.status === 'cancelled')

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    })
  }

  // Stock avatar colors
  const getStockColor = (symbol: string) => {
    const colors: Record<string, string> = {
      'NVDA': 'bg-[#F04438]',
      'AAPL': 'bg-amber-800',
      'TSLA': 'bg-emerald-600',
      'MSFT': 'bg-[#F04438]',
      'GOOGL': 'bg-blue-600',
      'AMZN': 'bg-orange-600',
      'META': 'bg-blue-500',
    }
    return colors[symbol] || 'bg-zinc-700'
  }

  return (
    <div className="min-h-screen bg-black text-white pb-24">
      {/* Header */}
      <div className="px-4 pt-4 pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-11 h-11 rounded-full overflow-hidden border-2 border-zinc-800">
                <img
                  src="/images/avatar.jpg"
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-black" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Good Morning</p>
              <p className="text-sm font-black italic">JELLY</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center">
              <Search size={18} className="text-zinc-500" />
            </button>
            <button className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center relative">
              <Bell size={18} className="text-zinc-500" />
              <div className="absolute top-2 right-2 w-2 h-2 bg-[#F04438] rounded-full" />
            </button>
          </div>
        </div>
      </div>

      {/* Title */}
      <div className="px-4 py-4 flex items-center justify-between">
        <h1 className="text-3xl font-black italic tracking-tight">ORDER CENTER</h1>
        <div className="flex items-center gap-2">
          <button className="w-10 h-10 rounded-xl bg-zinc-900 flex items-center justify-center">
            <Filter size={18} className="text-zinc-500" />
          </button>
          <button className="w-10 h-10 rounded-xl bg-zinc-900 flex items-center justify-center">
            <Search size={18} className="text-zinc-500" />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-4 mb-4">
        <div className="flex gap-6 border-b border-zinc-900">
          <button
            onClick={() => setActiveTab('active')}
            className={`pb-3 relative flex items-center gap-2 transition-all ${
              activeTab === 'active' ? 'text-amber-500' : 'text-zinc-600'
            }`}
          >
            <span className="text-[11px] font-black uppercase tracking-widest">Active Desk</span>
            {pendingOrders.length > 0 && (
              <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-500 text-[10px] font-black flex items-center justify-center">
                {pendingOrders.length}
              </span>
            )}
            {activeTab === 'active' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('logs')}
            className={`pb-3 relative transition-all ${
              activeTab === 'logs' ? 'text-white' : 'text-zinc-600'
            }`}
          >
            <span className="text-[11px] font-black uppercase tracking-widest">Execution Logs</span>
            {activeTab === 'logs' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('ipo')}
            className={`pb-3 relative flex items-center gap-2 transition-all ${
              activeTab === 'ipo' ? 'text-white' : 'text-zinc-600'
            }`}
          >
            <span className="text-[11px] font-black uppercase tracking-widest">IPO Orders</span>
            {ipoOrders.length > 0 && (
              <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-500 text-[10px] font-black flex items-center justify-center">
                {ipoOrders.length}
              </span>
            )}
            {activeTab === 'ipo' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('options')}
            className={`pb-3 relative flex items-center gap-2 transition-all ${
              activeTab === 'options' ? 'text-purple-400' : 'text-zinc-600'
            }`}
          >
            <PieChart size={12} className="shrink-0" />
            <span className="text-[11px] font-black uppercase tracking-widest">Options</span>
            {activeTab === 'options' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-400" />
            )}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 space-y-4">
        {activeTab === 'active' ? (
          pendingOrders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-16 h-16 rounded-full bg-zinc-900 flex items-center justify-center mb-4">
                <Clock size={28} className="text-zinc-700" />
              </div>
              <p className="text-sm font-bold text-zinc-600">No Active Orders</p>
              <p className="text-[10px] text-zinc-700 mt-1 uppercase tracking-widest">Place a limit order to see it here</p>
            </div>
          ) : (
            pendingOrders.map((order) => (
              <OrderCard 
                key={order.id} 
                order={order} 
                currentTime={currentTime}
                getStockColor={getStockColor}
                formatTime={formatTime}
                onCancel={onCancelOrder}
              />
            ))
          )
        ) : activeTab === 'logs' ? (
          completedOrders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-16 h-16 rounded-full bg-zinc-900 flex items-center justify-center mb-4">
                <TrendingUp size={28} className="text-zinc-700" />
              </div>
              <p className="text-sm font-bold text-zinc-600">No Execution History</p>
              <p className="text-[10px] text-zinc-700 mt-1 uppercase tracking-widest">Completed orders will appear here</p>
            </div>
          ) : (
            completedOrders.map((order) => (
              <ExecutionLogCard 
                key={order.id} 
                order={order}
                getStockColor={getStockColor}
                formatTime={formatTime}
              />
            ))
          )
        ) : activeTab === 'ipo' ? (
          ipoOrders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-16 h-16 rounded-full bg-zinc-900 flex items-center justify-center mb-4">
                <Clock size={28} className="text-zinc-700" />
              </div>
              <p className="text-sm font-bold text-zinc-600">No IPO Orders</p>
              <p className="text-[10px] text-zinc-700 mt-1 uppercase tracking-widest">Place an IPO order from IPO Center</p>
            </div>
          ) : (
            ipoOrders.map((order) => (
              <IpoOrderCard key={order.id} order={order} />
            ))
          )
        ) : (
          <OptionsPanel ticker={optionsTicker} />
        )}
      </div>

      {/* Market Integrity Card */}
      <div className="px-4 mt-6">
        <div className="bg-zinc-900/40 rounded-2xl p-4 border border-zinc-900">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
              <TrendingUp size={22} className="text-blue-500" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="text-xs font-black uppercase tracking-wider">Market Integrity</h3>
                <ShieldCheck size={14} className="text-emerald-500" />
              </div>
              <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-wide mt-1">
                Aggregated liquidity pools are currently deep.
              </p>
            </div>
            <ChevronRight size={18} className="text-zinc-700" />
          </div>
        </div>
      </div>
    </div>
  )
}

// Active Order Card Component
function OrderCard({ 
  order, 
  currentTime, 
  getStockColor, 
  formatTime,
  onCancel 
}: { 
  order: Order
  currentTime: Date
  getStockColor: (symbol: string) => string
  formatTime: (date: Date) => string
  onCancel?: (orderId: string) => void
}) {
  return (
    <div className="bg-zinc-900/40 rounded-2xl p-4 border border-zinc-900">
      {/* Header Row */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-xl ${getStockColor(order.symbol)} flex items-center justify-center`}>
            <span className="text-white font-black text-[10px]">{order.symbol}</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-base">{order.symbol}</span>
              <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${
                order.type === 'buy' 
                  ? 'bg-[#F04438]/20 text-[#F04438]' 
                  : 'bg-[#2E6BE6]/20 text-[#2E6BE6]'
              }`}>
                {order.type}
              </span>
            </div>
            <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-wide">{order.name}</p>
          </div>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-1.5 text-amber-500">
            <Clock size={12} />
            <span className="text-[10px] font-black uppercase">Pending</span>
          </div>
          <p className="text-[11px] font-bold text-zinc-600 tabular-nums mt-0.5">
            {formatTime(order.timestamp)}
          </p>
        </div>
      </div>

      {/* Details Row */}
      <div className="flex items-end justify-between border-t border-zinc-800 pt-4">
        <div className="flex gap-8">
          <div>
            <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest mb-1">Qty / Volume</p>
            <p className="text-sm font-black">
              <span className="text-white">{order.quantity}</span>
              <span className="text-zinc-600 text-[10px] ml-1">SHARES</span>
            </p>
          </div>
          <div>
            <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest mb-1">Target Price</p>
            <p className="text-sm font-black text-white">${order.price.toFixed(2)}</p>
          </div>
        </div>
        <button 
          onClick={() => onCancel?.(order.id)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 transition-colors"
        >
          <Trash2 size={14} className="text-zinc-500" />
          <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Cancel</span>
        </button>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between mt-4 pt-3 border-t border-zinc-800/50">
        <div className="flex items-center gap-2 text-[9px] font-bold text-zinc-700 uppercase tracking-widest">
          <span>REF: {order.refId}</span>
          <span className="text-zinc-800">•</span>
          <span>{order.orderType.toUpperCase()} ROUTING</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">Live Queue</span>
        </div>
      </div>
    </div>
  )
}

// Execution Log Card Component
function ExecutionLogCard({ 
  order, 
  getStockColor, 
  formatTime 
}: { 
  order: Order
  getStockColor: (symbol: string) => string
  formatTime: (date: Date) => string
}) {
  const isCancelled = order.status === 'cancelled'
  
  return (
    <div className="bg-zinc-900/40 rounded-2xl p-4 border border-zinc-900">
      {/* Header Row */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-xl ${getStockColor(order.symbol)} flex items-center justify-center`}>
            <span className="text-white font-black text-[10px]">{order.symbol}</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-base">{order.symbol}</span>
              <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${
                order.type === 'buy' 
                  ? 'bg-[#F04438]/20 text-[#F04438]' 
                  : 'bg-[#2E6BE6]/20 text-[#2E6BE6]'
              }`}>
                {order.type}
              </span>
            </div>
            <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-wide">{order.name}</p>
          </div>
        </div>
        <div className="text-right">
          <div className={`flex items-center gap-1.5 ${isCancelled ? 'text-zinc-500' : 'text-emerald-500'}`}>
            <span className="text-[10px] font-black uppercase">
              {isCancelled ? 'Cancelled' : 'Filled'}
            </span>
          </div>
          <p className="text-[11px] font-bold text-zinc-600 tabular-nums mt-0.5">
            {formatTime(order.timestamp)}
          </p>
        </div>
      </div>

      {/* Details Row */}
      <div className="flex gap-8 border-t border-zinc-800 pt-4">
        <div>
          <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest mb-1">Qty / Volume</p>
          <p className="text-sm font-black">
            <span className="text-white">{order.quantity}</span>
            <span className="text-zinc-600 text-[10px] ml-1">SHARES</span>
          </p>
        </div>
        <div>
          <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest mb-1">Exec Price</p>
          <p className="text-sm font-black text-white">${order.price.toFixed(2)}</p>
        </div>
        <div>
          <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest mb-1">Total</p>
          <p className="text-sm font-black text-white">${order.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center gap-2 mt-4 pt-3 border-t border-zinc-800/50 text-[9px] font-bold text-zinc-700 uppercase tracking-widest">
        <span>REF: {order.refId}</span>
        <span className="text-zinc-800">•</span>
        <span>{order.orderType.toUpperCase()} ROUTING</span>
      </div>
    </div>
  )
}

// ─── Options Panel ────────────────────────────────────────────────────────────
// Two-step flow:
//   1. No underlying selected → show UnderlyingSelector
//   2. Underlying selected    → show OptionsChain (My Positions + chain table)
// The two blocks are mutually exclusive (if/else), never rendered simultaneously.

const UNDERLYINGS = [
  { symbol: 'NVDA', name: 'NVIDIA Corp',    color: 'bg-[#F04438]', price: 135.58, change: +2.45 },
  { symbol: 'TSLA', name: 'Tesla Inc',      color: 'bg-emerald-600', price: 248.42, change: -1.12 },
  { symbol: 'AAPL', name: 'Apple Inc',      color: 'bg-amber-800',  price: 213.07, change: +0.84 },
  { symbol: 'MSFT', name: 'Microsoft Corp', color: 'bg-blue-600',   price: 415.20, change: +1.33 },
  { symbol: 'GOOGL', name: 'Alphabet Inc',  color: 'bg-blue-500',   price: 175.88, change: -0.57 },
]

const MOCK_POSITIONS: Record<string, { expiry: string; strike: number; type: 'call' | 'put'; qty: number; avgCost: number; currentVal: number }[]> = {
  TSLA: [
    { expiry: 'Mar 21', strike: 250, type: 'call', qty: 5, avgCost: 4.20, currentVal: 6.80 },
    { expiry: 'Apr 18', strike: 230, type: 'put',  qty: 3, avgCost: 7.50, currentVal: 5.10 },
  ],
  NVDA: [
    { expiry: 'Mar 21', strike: 140, type: 'call', qty: 10, avgCost: 3.10, currentVal: 5.40 },
  ],
}

const MOCK_CHAINS: Record<string, { strike: number; call: { bid: number; ask: number; iv: string }; put: { bid: number; ask: number; iv: string } }[]> = {
  NVDA:  [
    { strike: 130, call: { bid: 8.20, ask: 8.50, iv: '42%' }, put: { bid: 2.10, ask: 2.30, iv: '38%' } },
    { strike: 135, call: { bid: 5.40, ask: 5.70, iv: '40%' }, put: { bid: 3.90, ask: 4.10, iv: '41%' } },
    { strike: 140, call: { bid: 3.10, ask: 3.30, iv: '39%' }, put: { bid: 6.50, ask: 6.80, iv: '43%' } },
    { strike: 145, call: { bid: 1.60, ask: 1.80, iv: '41%' }, put: { bid: 9.80, ask: 10.10, iv: '45%' } },
    { strike: 150, call: { bid: 0.70, ask: 0.85, iv: '44%' }, put: { bid: 13.40, ask: 13.80, iv: '48%' } },
  ],
  TSLA: [
    { strike: 235, call: { bid: 18.50, ask: 19.10, iv: '55%' }, put: { bid: 4.20, ask: 4.60, iv: '50%' } },
    { strike: 245, call: { bid: 11.80, ask: 12.30, iv: '53%' }, put: { bid: 7.40, ask: 7.80, iv: '52%' } },
    { strike: 250, call: { bid:  8.60, ask:  9.00, iv: '51%' }, put: { bid: 9.90, ask: 10.30, iv: '53%' } },
    { strike: 260, call: { bid:  4.10, ask:  4.50, iv: '52%' }, put: { bid: 15.20, ask: 15.80, iv: '55%' } },
    { strike: 270, call: { bid:  1.70, ask:  2.00, iv: '54%' }, put: { bid: 21.50, ask: 22.10, iv: '57%' } },
  ],
}
const DEFAULT_CHAIN = [
  { strike: 100, call: { bid: 5.00, ask: 5.30, iv: '40%' }, put: { bid: 5.00, ask: 5.30, iv: '40%' } },
  { strike: 105, call: { bid: 2.50, ask: 2.80, iv: '39%' }, put: { bid: 7.50, ask: 7.80, iv: '41%' } },
]

function OptionsPanel({ ticker }: { ticker?: string }) {
  const [selectedUnderlying, setSelectedUnderlying] = useState<string | null>(ticker ?? null)

  // If a ticker is passed via prop, jump straight to the chain view
  useEffect(() => {
    if (ticker) setSelectedUnderlying(ticker)
  }, [ticker])

  // ── Step 1: no underlying chosen yet ────────────────────────────────────────
  if (!selectedUnderlying) {
    return (
      <div className="space-y-3">
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Underlying Selector</p>
          <p className="text-[9px] text-zinc-700 uppercase tracking-widest mt-0.5">Choose a stock to view its options chain</p>
        </div>

        {UNDERLYINGS.map((u) => (
          <button
            key={u.symbol}
            onClick={() => setSelectedUnderlying(u.symbol)}
            className="w-full flex items-center gap-3 bg-zinc-900/50 border border-zinc-800 rounded-xl p-3 active:scale-[0.98] transition-transform"
          >
            <div className={`w-10 h-10 rounded-xl ${u.color} flex items-center justify-center shrink-0`}>
              <span className="text-white font-black text-[10px]">{u.symbol}</span>
            </div>
            <div className="flex-1 text-left">
              <p className="text-sm font-black">{u.symbol}</p>
              <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-wide">{u.name}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-black tabular-nums">${u.price.toFixed(2)}</p>
              <p className={`text-[10px] font-black tabular-nums ${u.change >= 0 ? 'text-emerald-500' : 'text-[#F04438]'}`}>
                {u.change >= 0 ? '+' : ''}{u.change.toFixed(2)}%
              </p>
            </div>
            <ChevronRight size={16} className="text-zinc-700 shrink-0" />
          </button>
        ))}
      </div>
    )
  }

  // ── Step 2: underlying selected — show positions + chain ────────────────────
  const positions = MOCK_POSITIONS[selectedUnderlying] ?? []
  const chain = MOCK_CHAINS[selectedUnderlying] ?? DEFAULT_CHAIN
  const underlying = UNDERLYINGS.find(u => u.symbol === selectedUnderlying)

  return (
    <div className="space-y-5">
      {/* Back button + title */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setSelectedUnderlying(null)}
          className="w-8 h-8 rounded-full bg-zinc-900 flex items-center justify-center active:scale-90 transition-transform"
        >
          <ChevronLeft size={16} className="text-zinc-400" />
        </button>
        <div>
          <p className="text-xs font-black uppercase tracking-widest text-purple-400">
            {selectedUnderlying} · Options
          </p>
          {underlying && (
            <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-wide">{underlying.name}</p>
          )}
        </div>
        <div className="ml-auto px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20">
          <span className="text-[10px] font-black text-purple-400 uppercase tracking-widest">Mar 21</span>
        </div>
      </div>

      {/* My Positions — only if the user holds options on this underlying */}
      {positions.length > 0 && (
        <div className="space-y-2">
          <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">My Positions</p>
          {positions.map((pos, i) => {
            const pl = (pos.currentVal - pos.avgCost) * pos.qty * 100
            const plPct = ((pos.currentVal - pos.avgCost) / pos.avgCost) * 100
            const isProfit = pl >= 0
            return (
              <div key={i} className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-3 flex items-center gap-3">
                <div className={`px-2 py-1 rounded text-[9px] font-black uppercase tracking-widest ${
                  pos.type === 'call' ? 'bg-emerald-500/15 text-emerald-400' : 'bg-[#F04438]/15 text-[#F04438]'
                }`}>
                  {pos.type}
                </div>
                <div className="flex-1">
                  <p className="text-xs font-black">{selectedUnderlying} ${pos.strike} {pos.expiry}</p>
                  <p className="text-[10px] text-zinc-600 font-bold">
                    {pos.qty} contracts · avg ${pos.avgCost.toFixed(2)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-black tabular-nums">${pos.currentVal.toFixed(2)}</p>
                  <p className={`text-[10px] font-black tabular-nums ${isProfit ? 'text-emerald-500' : 'text-[#F04438]'}`}>
                    {isProfit ? '+' : ''}${pl.toFixed(0)} ({isProfit ? '+' : ''}{plPct.toFixed(1)}%)
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Options Chain */}
      <div className="space-y-2">
        <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Options Chain</p>

        {/* Column headers */}
        <div className="grid grid-cols-7 text-[9px] font-black uppercase tracking-widest text-zinc-600 px-1">
          <span className="col-span-3 text-center">Call</span>
          <span className="text-center">Strike</span>
          <span className="col-span-3 text-center">Put</span>
        </div>
        <div className="grid grid-cols-7 text-[9px] font-bold uppercase tracking-widest text-zinc-700 px-1">
          <span>Bid</span><span>Ask</span><span>IV</span>
          <span />
          <span>Bid</span><span>Ask</span><span>IV</span>
        </div>

        {chain.map((row) => (
          <div key={row.strike} className="grid grid-cols-7 text-[11px] font-bold px-1 items-center gap-x-1">
            <span className="text-emerald-400">{row.call.bid}</span>
            <span className="text-emerald-400">{row.call.ask}</span>
            <span className="text-zinc-500">{row.call.iv}</span>
            <span className="text-center font-black text-white bg-zinc-900 rounded px-1 py-0.5 text-[10px]">
              {row.strike}
            </span>
            <span className="text-[#F04438]">{row.put.bid}</span>
            <span className="text-[#F04438]">{row.put.ask}</span>
            <span className="text-zinc-500">{row.put.iv}</span>
          </div>
        ))}
      </div>

      <p className="text-[9px] text-zinc-700 uppercase tracking-widest text-center pt-1">
        Options trading involves risk · Prices are indicative
      </p>
    </div>
  )
}
