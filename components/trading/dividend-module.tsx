'use client'

import { useState } from 'react'
import { ChevronLeft } from 'lucide-react'
import type { DividendStock, Stock, Order } from '@/lib/types'
import { mockDividends } from '@/lib/mock-data'
import { DividendDetail } from './dividend-detail'

interface DividendModuleProps {
  onBack: () => void
  onStockSelect: (stock: Stock, badge?: string) => void
  onOrderSubmit?: (order: Order) => void
  onNavigateToTrade?: () => void
  availableBalance?: number
}

const filters = ['High Yield', 'Stable', 'Ex-Div Soon', 'All']

export function DividendModule({ 
  onBack, 
  onStockSelect,
  onOrderSubmit,
  onNavigateToTrade,
  availableBalance = 1284560
}: DividendModuleProps) {
  const [activeFilter, setActiveFilter] = useState('All')
  const [selectedDividend, setSelectedDividend] = useState<DividendStock | null>(null)

  // Show detail view if a dividend is selected
  if (selectedDividend) {
    return (
      <DividendDetail
        dividend={selectedDividend}
        onBack={() => setSelectedDividend(null)}
        onStockSelect={onStockSelect}
        onOrderSubmit={onOrderSubmit}
        onNavigateToTrade={onNavigateToTrade}
        availableBalance={availableBalance}
      />
    )
  }

  return (
    <div className="min-h-screen bg-black text-white pb-24">
      {/* Header */}
      <div className="sticky top-0 bg-black/95 backdrop-blur-md z-50 border-b border-zinc-900">
        <div className="flex items-center px-4 py-3">
          <button onClick={onBack} className="p-2 hover:bg-zinc-900 rounded-full">
            <ChevronLeft size={22} className="text-zinc-400" />
          </button>
          <h1 className="flex-1 text-center font-black text-sm uppercase tracking-widest">Dividend Calendar</h1>
          <div className="w-10" />
        </div>

        <div className="px-4 py-4">
          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            {filters.map(filter => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest whitespace-nowrap ${
                  activeFilter === filter ? 'bg-white text-black' : 'border border-zinc-900'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Dividend Cards */}
      <div className="px-4 py-6 space-y-4">
        {mockDividends.map((dividend) => (
          <DividendCard 
            key={dividend.symbol} 
            dividend={dividend}
            onSelect={() => setSelectedDividend(dividend)}
          />
        ))}
      </div>

      {/* Formula Note */}
      <div className="px-4 pb-6">
        <div className="bg-zinc-950 rounded-2xl p-4 border border-zinc-900">
          <p className="text-[9px] font-mono text-zinc-600 text-center">
            Dividend Yield = Annual Dividends / Current Price
          </p>
        </div>
      </div>
    </div>
  )
}

function DividendCard({ dividend, onSelect }: { dividend: DividendStock; onSelect: () => void }) {
  const maxHistory = Math.max(...dividend.history)

  return (
    <div 
      className="bg-[#0a0a0a] rounded-3xl p-6 border border-zinc-900 cursor-pointer hover:border-zinc-700 transition-all"
      onClick={onSelect}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center text-sm font-black">
            {dividend.symbol.slice(0, 2)}
          </div>
          <div>
            <h4 className="text-sm font-black">{dividend.name}</h4>
            <p className="text-[9px] text-zinc-600 uppercase tracking-widest">{dividend.symbol}</p>
          </div>
        </div>
        <div className="px-3 py-1.5 rounded-full bg-gradient-to-r from-green-600 to-emerald-600">
          <span className="text-[9px] font-black uppercase tracking-widest">Yield {dividend.yieldTTM}%</span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="p-3 bg-zinc-950 rounded-2xl">
          <span className="text-[8px] font-bold uppercase tracking-widest text-zinc-700">Div Yield</span>
          <p className="text-sm font-black text-[#10b981] mt-1 tabular-nums">{dividend.yieldTTM}%</p>
        </div>
        <div className="p-3 bg-zinc-950 rounded-2xl">
          <span className="text-[8px] font-bold uppercase tracking-widest text-zinc-700">Payout</span>
          <p className="text-sm font-black text-white mt-1 tabular-nums">{dividend.payoutLFY}%</p>
        </div>
        <div className="p-3 bg-zinc-950 rounded-2xl">
          <span className="text-[8px] font-bold uppercase tracking-widest text-zinc-700">Frequency</span>
          <p className="text-sm font-black text-white mt-1">{dividend.frequency}</p>
        </div>
      </div>

      {/* History Chart */}
      <div className="mb-6">
        <h5 className="text-[9px] font-bold uppercase tracking-[0.3em] text-zinc-600 mb-4">Dividend History (TTM)</h5>
        <div className="flex items-end justify-between h-24 gap-1">
          {dividend.history.map((amount, i) => (
            <div key={i} className="flex-1 flex flex-col items-center">
              <div 
                className="w-full bg-[#2E6BE6] rounded-t-lg" 
                style={{ height: `${(amount / maxHistory) * 100}%` }} 
              />
              <span className="text-[8px] font-black text-zinc-700 mt-2 tabular-nums">${amount.toFixed(2)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Key Dates */}
      <div className="space-y-3 pt-4 border-t border-zinc-900">
        <div className="flex justify-between items-center">
          <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-700">Ex-Div Date</span>
          <span className="text-xs font-black text-white">{dividend.exDivDate}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-700">Payment Date</span>
          <span className="text-xs font-black text-white">{dividend.paymentDate}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-700">Next DPS</span>
          <span className="text-xs font-black text-[#10b981]">${dividend.nextDPS.toFixed(2)} (Est.)</span>
        </div>
      </div>
    </div>
  )
}
