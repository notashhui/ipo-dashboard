'use client'

import { useState } from 'react'
import { Search, Bell, TrendingUp, ChevronRight } from 'lucide-react'
import type { ViewType, Stock } from '@/lib/types'

interface MarketsDashboardProps {
  onNavigate: (view: ViewType) => void
  onStockSelect?: (stock: Stock, badge?: string) => void
}

const categories = ['FAVORITES', 'US TECH', 'HK STOCKS', 'BONDS', 'ETFS']

// Stock data with avatar colors matching the design
const stocksByCategory: Record<string, Array<Stock & { avatarColor: string }>> = {
  'FAVORITES': [
    { symbol: 'NVDA', name: 'NVIDIA Corp', price: 135.58, change: 3.24, changePercent: 2.45, avatarColor: 'bg-[#E53935]' },
    { symbol: 'AAPL', name: 'Apple Inc.', price: 228.34, change: 2.53, changePercent: 1.12, avatarColor: 'bg-[#8D6E63]' },
    { symbol: 'TSLA', name: 'Tesla, Inc.', price: 260.10, change: -8.62, changePercent: -3.20, avatarColor: 'bg-[#43A047]' },
  ],
  'US TECH': [
    { symbol: 'NVDA', name: 'NVIDIA Corp', price: 135.58, change: 3.24, changePercent: 2.45, avatarColor: 'bg-[#E53935]' },
    { symbol: 'AAPL', name: 'Apple Inc.', price: 228.34, change: 2.53, changePercent: 1.12, avatarColor: 'bg-[#8D6E63]' },
    { symbol: 'TSLA', name: 'Tesla, Inc.', price: 260.10, change: -8.62, changePercent: -3.20, avatarColor: 'bg-[#43A047]' },
    { symbol: 'MSFT', name: 'Microsoft Corp', price: 415.20, change: 3.30, changePercent: 0.80, avatarColor: 'bg-[#E53935]' },
  ],
  'HK STOCKS': [
    { symbol: '0700', name: 'Tencent Holdings', price: 378.40, change: 5.20, changePercent: 1.39, avatarColor: 'bg-[#1E88E5]' },
    { symbol: '9988', name: 'Alibaba Group', price: 85.65, change: -1.25, changePercent: -1.44, avatarColor: 'bg-[#FF6F00]' },
    { symbol: '1810', name: 'Xiaomi Corp', price: 18.92, change: 0.42, changePercent: 2.27, avatarColor: 'bg-[#FF5722]' },
  ],
  'BONDS': [
    { symbol: 'TLT', name: '20+ Year Treasury', price: 92.45, change: 0.32, changePercent: 0.35, avatarColor: 'bg-[#5E35B1]' },
    { symbol: 'BND', name: 'Total Bond Market', price: 73.21, change: 0.15, changePercent: 0.21, avatarColor: 'bg-[#00897B]' },
  ],
  'ETFS': [
    { symbol: 'SPY', name: 'S&P 500 ETF', price: 478.92, change: 4.56, changePercent: 0.96, avatarColor: 'bg-[#1565C0]' },
    { symbol: 'QQQ', name: 'Nasdaq 100 ETF', price: 412.34, change: 6.78, changePercent: 1.67, avatarColor: 'bg-[#7B1FA2]' },
    { symbol: 'VTI', name: 'Total Stock Market', price: 245.67, change: 2.12, changePercent: 0.87, avatarColor: 'bg-[#C62828]' },
  ],
}

// Mini sparkline component
function MiniSparkline({ positive }: { positive: boolean }) {
  const color = positive ? '#22C55E' : '#EF4444'
  const path = positive 
    ? 'M0,12 L4,10 L8,11 L12,8 L16,9 L20,6 L24,7 L28,4 L32,5 L36,2'
    : 'M0,2 L4,4 L8,3 L12,6 L16,5 L20,8 L24,7 L28,10 L32,9 L36,12'
  
  return (
    <svg width="36" height="14" viewBox="0 0 36 14" fill="none">
      <path d={path} stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function MarketsDashboard({ onNavigate, onStockSelect }: MarketsDashboardProps) {
  const [activeCategory, setActiveCategory] = useState('US TECH')
  
  const currentStocks = stocksByCategory[activeCategory] || []

  const handleStockClick = (stock: Stock & { avatarColor: string }) => {
    if (onStockSelect) {
      const { avatarColor, ...stockData } = stock
      onStockSelect(stockData)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white pb-24">
      {/* Header with greeting */}
      <div className="px-4 pt-4 pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-zinc-800">
                <img
                  src="/images/avatar.jpg"
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-black" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-zinc-500 uppercase tracking-[0.2em]">Good Morning</p>
              <p className="text-base font-black italic text-white">JELLY</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="w-11 h-11 rounded-full bg-zinc-900 flex items-center justify-center">
              <Search size={20} className="text-zinc-400" />
            </button>
            <button className="w-11 h-11 rounded-full bg-zinc-900 flex items-center justify-center relative">
              <Bell size={20} className="text-zinc-400" />
              <div className="absolute top-2 right-2 w-2.5 h-2.5 bg-[#F04438] rounded-full border border-black" />
            </button>
          </div>
        </div>
      </div>

      {/* Markets Title */}
      <div className="px-4 pt-4 pb-2">
        <h1 className="text-4xl font-black italic tracking-tight">MARKETS</h1>
      </div>

      {/* Category Tabs */}
      <div className="px-4 pt-4">
        <div className="flex gap-6 overflow-x-auto no-scrollbar pb-3 border-b border-zinc-900">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`flex-shrink-0 pb-3 relative transition-colors ${
                activeCategory === category 
                  ? 'text-blue-400' 
                  : 'text-zinc-600'
              }`}
            >
              <span className="text-[11px] font-black uppercase tracking-[0.15em]">
                {category}
              </span>
              {activeCategory === category && (
                <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-blue-400 rounded-full" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Stock List */}
      <div className="mt-4">
        <div className="bg-zinc-900/40 mx-4 rounded-3xl overflow-hidden">
          {currentStocks.map((stock, index) => (
            <button
              key={stock.symbol}
              onClick={() => handleStockClick(stock)}
              className={`w-full flex items-center justify-between px-4 py-4 hover:bg-zinc-800/50 transition-colors ${
                index !== currentStocks.length - 1 ? 'border-b border-zinc-800/50' : ''
              }`}
            >
              {/* Left: Avatar + Info */}
              <div className="flex items-center gap-3">
                <div className={`w-14 h-14 rounded-full ${stock.avatarColor} flex items-center justify-center`}>
                  <span className="text-white text-[11px] font-black tracking-wider">
                    {stock.symbol.length > 4 ? stock.symbol.slice(0, 4) : stock.symbol}
                  </span>
                </div>
                <div className="text-left">
                  <div className="flex items-center gap-2">
                    <span className="text-white font-black text-base">{stock.symbol}</span>
                    <span className="text-[9px] font-bold text-zinc-500 bg-zinc-800 px-1.5 py-0.5 rounded">
                      L2
                    </span>
                  </div>
                  <p className="text-[11px] font-medium text-zinc-500 uppercase tracking-wide mt-0.5">
                    {stock.name}
                  </p>
                </div>
              </div>

              {/* Right: Price + Trend */}
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-white font-bold text-lg tabular-nums">
                    {stock.price.toFixed(2)}
                  </p>
                  <div className="flex items-center justify-end gap-1 mt-0.5">
                    <MiniSparkline positive={stock.changePercent >= 0} />
                    <span className={`text-[11px] font-bold ${
                      stock.changePercent >= 0 ? 'text-emerald-400' : 'text-red-400'
                    }`}>
                      {stock.changePercent >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                    </span>
                  </div>
                </div>
                <ChevronRight size={18} className="text-zinc-600" />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Daily Market Pulse */}
      <div className="px-4 mt-6">
        <div className="bg-zinc-900/40 rounded-3xl p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
            <TrendingUp size={22} className="text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-white font-black text-sm uppercase tracking-wide">
              Daily Market Pulse
            </h3>
            <p className="text-zinc-500 text-[11px] font-medium uppercase tracking-wide mt-1 leading-relaxed">
              Institutional flow is favoring big tech today.
            </p>
          </div>
          <ChevronRight size={20} className="text-blue-400 flex-shrink-0" />
        </div>
      </div>
    </div>
  )
}
