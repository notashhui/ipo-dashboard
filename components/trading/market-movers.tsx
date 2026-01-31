'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronRight } from 'lucide-react'
import type { HotStockItem, HotDimension, HotMarket } from '@/lib/types'
import { getHotStocks } from '@/lib/mock/hot-stocks'

const DIMENSIONS: { id: HotDimension; label: string }[] = [
  { id: 'gainers', label: 'Gainers' },
  { id: 'losers', label: 'Losers' },
  { id: 'volume', label: 'Volume' },
  { id: 'trending', label: 'Trending' },
]

const MARKETS: { id: HotMarket; label: string; flag: string }[] = [
  { id: 'us', label: 'US', flag: '🇺🇸' },
  { id: 'hk', label: 'HK', flag: '🇭🇰' },
  { id: 'cn', label: 'CN', flag: '🇨🇳' },
  { id: 'all', label: 'All', flag: '🌐' },
]

function formatPrice(item: HotStockItem): string {
  if (item.currency === 'USD') return `$${item.price.toFixed(2)}`
  if (item.currency === 'HKD') return `HK$${item.price.toFixed(2)}`
  return `¥${item.price.toFixed(2)}`
}

function heatIcon(heat: HotStockItem['heat']): string {
  switch (heat) {
    case 'high':
      return '🔥'
    case 'medium':
      return '📈'
    default:
      return '💰'
  }
}

function MiniChart({ data, isUp }: { data: number[]; isUp: boolean }) {
  if (!data?.length) return <div className="h-8 rounded bg-zinc-800/50" />
  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1
  const w = data.length > 1 ? 100 / (data.length - 1) : 100
  const points = data
    .map((v, i) => `${(i * w).toFixed(1)},${(80 - ((v - min) / range) * 60).toFixed(1)}`)
    .join(' ')
  return (
    <svg viewBox="0 0 100 80" className="w-full h-8 rounded overflow-hidden" preserveAspectRatio="none">
      <defs>
        <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={isUp ? '#10b981' : '#ef4444'} stopOpacity="0.3" />
          <stop offset="100%" stopColor={isUp ? '#10b981' : '#ef4444'} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon
        fill="url(#chartGrad)"
        points={`0,80 ${points} 100,80`}
      />
      <polyline
        fill="none"
        stroke={isUp ? '#10b981' : '#ef4444'}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
    </svg>
  )
}

export function MarketMovers() {
  const router = useRouter()
  const [dimension, setDimension] = useState<HotDimension>('gainers')
  const [market, setMarket] = useState<HotMarket>('all')

  const stocks = getHotStocks(dimension, market)

  const handleCardClick = (item: HotStockItem) => {
    router.push(`/stock/${item.symbol}`)
  }

  return (
    <div className="pb-6">
      {/* Section header */}
      <div className="flex items-center gap-2 mb-4">
        <div className="w-1 h-4 bg-emerald-500 rounded-full" />
        <h3 className="text-lg font-bold text-white">🔥 Market Movers</h3>
      </div>

      {/* Layer 1: Dimension tabs */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar mb-3">
        {DIMENSIONS.map((d) => (
          <button
            key={d.id}
            onClick={() => setDimension(d.id)}
            className={`shrink-0 px-4 py-2 rounded-full text-xs font-bold transition-colors ${
              dimension === d.id
                ? 'bg-emerald-500 text-white'
                : 'bg-transparent border border-white/20 text-zinc-500 hover:text-zinc-400'
            }`}
          >
            {d.label}
          </button>
        ))}
      </div>

      {/* Layer 2: Market tabs */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar mb-4">
        {MARKETS.map((m) => (
          <button
            key={m.id}
            onClick={() => setMarket(m.id)}
            className={`shrink-0 px-4 py-2 rounded-full text-xs font-bold transition-colors ${
              market === m.id
                ? 'bg-emerald-500 text-white'
                : 'bg-transparent border border-white/20 text-zinc-500 hover:text-zinc-400'
            }`}
          >
            {m.flag} {m.label}
          </button>
        ))}
      </div>

      {/* 2x2 Stock grid */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {stocks.slice(0, 4).map((item) => {
          const isUp = item.change >= 0
          return (
            <button
              key={item.symbol}
              onClick={() => handleCardClick(item)}
              className="text-left bg-white/[0.05] rounded-xl p-3 border border-white/10 hover:bg-white/[0.08] active:scale-[0.99] transition-all"
            >
              <div className="flex items-start justify-between mb-1">
                <span className="text-sm font-bold text-white">{item.symbol}</span>
                <span className="flex items-center gap-1">
                  <span className={`text-sm font-bold tabular-nums ${isUp ? 'text-emerald-400' : 'text-red-500'}`}>
                    {isUp ? '+' : ''}{item.change.toFixed(1)}%
                  </span>
                  <span className="text-base" title={item.heat}>{heatIcon(item.heat)}</span>
                </span>
              </div>
              <p className="text-2xl font-bold text-white tabular-nums mb-0.5">{formatPrice(item)}</p>
              <p className="text-[11px] text-zinc-500 truncate mb-2">{item.name}</p>
              <MiniChart data={item.trendData} isUp={isUp} />
            </button>
          )
        })}
      </div>

      {/* View All */}
      <button
        onClick={() => router.push('/')}
        className="w-full flex items-center justify-center gap-1 py-2.5 text-sm font-bold text-emerald-400 hover:text-emerald-300 transition-colors"
      >
        View All
        <ChevronRight size={16} />
      </button>
    </div>
  )
}
