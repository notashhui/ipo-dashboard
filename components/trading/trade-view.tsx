'use client'

import { useState, useEffect } from 'react'
import { Search, Bell, Filter, Clock, Trash2, TrendingUp, ShieldCheck, ChevronRight } from 'lucide-react'
import type { Order, IpoOrder } from '@/lib/types'
import { IpoOrderCard } from './ipo-order-card'

interface TradeViewProps {
  orders?: Order[]
  ipoOrders?: IpoOrder[]
  onCancelOrder?: (orderId: string) => void
}

export function TradeView({ orders = [], ipoOrders = [], onCancelOrder }: TradeViewProps) {
  const [activeTab, setActiveTab] = useState<'active' | 'logs' | 'ipo'>('active')
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
        ) : (
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
