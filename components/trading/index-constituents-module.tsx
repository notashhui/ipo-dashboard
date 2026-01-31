'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronLeft, ChevronDown, ChevronUp } from 'lucide-react'
import type { IndexDetail, IndexConstituent, IndexCode } from '@/lib/types'

type SortKey = 'change' | 'marketCap' | 'volume' | 'weight'

interface IndexConstituentsModuleProps {
  index: IndexDetail
  onBack: () => void
}

function formatMarketCap(v: number): string {
  if (v >= 1e12) return `${(v / 1e12).toFixed(1)}T`
  if (v >= 1e9) return `${(v / 1e9).toFixed(1)}B`
  return `${(v / 1e6).toFixed(0)}M`
}

function formatPrice(price: number, code: IndexCode): string {
  if (code === 'HSI') return `HK$${price.toFixed(2)}`
  return `$${price.toFixed(2)}`
}

function MiniChart({ data, isUp }: { data: number[]; isUp: boolean }) {
  if (!data?.length) return <div className="h-10 rounded bg-zinc-800/50" />
  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1
  const w = data.length > 1 ? 100 / (data.length - 1) : 100
  const points = data
    .map((v, i) => `${(i * w).toFixed(1)},${(80 - ((v - min) / range) * 60).toFixed(1)}`)
    .join(' ')
  return (
    <svg viewBox="0 0 100 80" className="w-full h-10 rounded overflow-hidden" preserveAspectRatio="none">
      <defs>
        <linearGradient id="idxGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={isUp ? '#10b981' : '#ef4444'} stopOpacity="0.3" />
          <stop offset="100%" stopColor={isUp ? '#10b981' : '#ef4444'} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon fill="url(#idxGrad)" points={`0,80 ${points} 100,80`} />
      <polyline fill="none" stroke={isUp ? '#10b981' : '#ef4444'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" points={points} />
    </svg>
  )
}

export function IndexConstituentsModule({ index, onBack }: IndexConstituentsModuleProps) {
  const router = useRouter()
  const [sortKey, setSortKey] = useState<SortKey>('change')
  const [sortAsc, setSortAsc] = useState(false)

  const sorted = useMemo(() => {
    const list = [...index.constituents]
    list.sort((a, b) => {
      let va: number, vb: number
      switch (sortKey) {
        case 'change':
          va = a.change
          vb = b.change
          break
        case 'marketCap':
          va = a.marketCap
          vb = b.marketCap
          break
        case 'volume':
          va = a.volume
          vb = b.volume
          break
        case 'weight':
          va = a.weight
          vb = b.weight
          break
        default:
          return 0
      }
      return sortAsc ? va - vb : vb - va
    })
    return list
  }, [index.constituents, sortKey, sortAsc])

  const isUp = index.change >= 0
  const indexCode = index.code

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortAsc((a) => !a)
    else {
      setSortKey(key)
      setSortAsc(false)
    }
  }

  const handleConstituentClick = (c: IndexConstituent) => {
    router.push(`/stock/${c.symbol}`)
  }

  return (
    <div className="min-h-screen bg-black text-white pb-24 max-w-[430px] mx-auto">
      {/* Header */}
      <div className="sticky top-0 bg-black/95 backdrop-blur-md z-50 border-b border-zinc-900">
        <div className="flex items-center px-4 py-3">
          <button onClick={onBack} className="p-2 hover:bg-zinc-900 rounded-full">
            <ChevronLeft size={22} className="text-zinc-400" />
          </button>
          <h1 className="flex-1 text-center font-bold text-lg truncate px-2">
            {index.name} Constituents
          </h1>
          <div className="w-10" />
        </div>
      </div>

      {/* Index Overview Card */}
      <div className="px-4 py-4">
        <div className="bg-white/[0.05] rounded-xl p-4 border border-white/10">
          <p className="text-sm text-zinc-500 mb-1">{index.name}</p>
          <p className="text-3xl font-bold tabular-nums text-white">{index.value.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
          <p className={`text-base font-semibold tabular-nums mt-1 ${isUp ? 'text-emerald-400' : 'text-red-500'}`}>
            {isUp ? '+' : ''}{index.change.toFixed(2)} ({isUp ? '+' : ''}{index.changePercent.toFixed(2)}%)
          </p>
          <div className="mt-4 pt-4 border-t border-zinc-800/50 text-xs text-zinc-500 space-y-1">
            <p>Today: {index.todayRange.low.toLocaleString()} – {index.todayRange.high.toLocaleString()}</p>
            <p>52W: {index.fiftyTwoWeekRange.low.toLocaleString()} – {index.fiftyTwoWeekRange.high.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Sort Tabs */}
      <div className="px-4 py-2">
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {[
            { key: 'change' as SortKey, label: 'By Change' },
            { key: 'marketCap' as SortKey, label: 'By Market Cap' },
            { key: 'volume' as SortKey, label: 'By Volume' },
            { key: 'weight' as SortKey, label: 'By Weight' },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => handleSort(key)}
              className={`shrink-0 px-4 py-2 rounded-full text-xs font-bold flex items-center gap-1 transition-colors ${
                sortKey === key ? 'bg-emerald-500 text-white' : 'bg-transparent border border-white/20 text-zinc-500'
              }`}
            >
              {label}
              {sortKey === key && (sortAsc ? <ChevronUp size={12} /> : <ChevronDown size={12} />)}
            </button>
          ))}
        </div>
      </div>

      {/* Constituent List */}
      <div className="px-4 py-4 space-y-2">
        {sorted.map((c) => {
          const up = c.change >= 0
          return (
            <button
              key={c.symbol}
              type="button"
              onClick={() => handleConstituentClick(c)}
              className="w-full text-left bg-white/[0.05] rounded-lg p-3 border border-white/10 hover:bg-white/[0.08] active:scale-[0.99] transition-all"
            >
              <div className="flex items-start justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-zinc-500 w-6">{c.rank}</span>
                  <span className="text-base font-bold text-white">{c.symbol}</span>
                  <span className="text-sm text-zinc-500 truncate max-w-[120px]">{c.name}</span>
                </div>
                <span className={`text-base font-bold tabular-nums shrink-0 ${up ? 'text-emerald-400' : 'text-red-500'}`}>
                  {up ? '+' : ''}{c.change.toFixed(1)}%
                </span>
              </div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xl font-bold tabular-nums text-white">{formatPrice(c.price, indexCode)}</span>
                <span className={`text-sm tabular-nums ${up ? 'text-emerald-400' : 'text-red-500'}`}>
                  {up ? '↑' : '↓'}{indexCode === 'HSI' ? 'HK$' : '$'}{Math.abs(c.changeAmount).toFixed(2)}
                </span>
              </div>
              <div className="flex gap-4 text-xs text-zinc-500 mb-2">
                <span>Cap: {formatMarketCap(c.marketCap)}</span>
                <span>Weight: {c.weight.toFixed(1)}%</span>
              </div>
              <MiniChart data={c.trendData} isUp={up} />
            </button>
          )
        })}
      </div>
    </div>
  )
}
