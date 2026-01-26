'use client'

import { useState } from 'react'
import { ChevronLeft } from 'lucide-react'
import type { RankingStock, Stock } from '@/lib/types'
import { mockRankings } from '@/lib/mock-data'

interface RankingsModuleProps {
  onBack: () => void
  onStockSelect: (stock: Stock, badge?: string) => void
}

const lists = ['Gainers', 'Volume', '5-Min Movers', 'Amplitude', 'Turnover Rate']

export function RankingsModule({ onBack, onStockSelect }: RankingsModuleProps) {
  const [activeList, setActiveList] = useState('Gainers')

  return (
    <div className="min-h-screen bg-black text-white pb-24">
      {/* Header */}
      <div className="sticky top-0 bg-black/95 backdrop-blur-md z-50 border-b border-zinc-900">
        <div className="flex items-center px-4 py-3">
          <button onClick={onBack} className="p-2 hover:bg-zinc-900 rounded-full">
            <ChevronLeft size={22} className="text-zinc-400" />
          </button>
          <h1 className="flex-1 text-center font-black text-sm uppercase tracking-widest">Top Rankings</h1>
          <div className="w-10" />
        </div>

        <div className="px-4 py-4">
          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            {lists.map(list => (
              <button
                key={list}
                onClick={() => setActiveList(list)}
                className={`px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest whitespace-nowrap ${
                  activeList === list ? 'bg-white text-black' : 'border border-zinc-900'
                }`}
              >
                {list}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Rankings List */}
      <div className="px-4 py-6">
        <div className="space-y-2">
          {mockRankings.map((stock) => (
            <RankingCard 
              key={stock.symbol}
              stock={stock}
              onSelect={() => onStockSelect(stock, `Rank #${stock.rank}`)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

function RankingCard({ stock, onSelect }: { stock: RankingStock; onSelect: () => void }) {
  const isTopThree = stock.rank <= 3
  const isPositive = stock.changePercent >= 0
  
  const rankColors = {
    1: 'from-amber-500 to-orange-600',
    2: 'from-zinc-400 to-zinc-500',
    3: 'from-amber-700 to-amber-800'
  }

  if (isTopThree) {
    return (
      <div 
        className={`${stock.rank === 1 
          ? 'bg-gradient-to-r from-amber-500/10 to-orange-600/10 border-amber-500/30' 
          : 'bg-[#0a0a0a] border-zinc-900'
        } border rounded-3xl p-5 relative overflow-hidden cursor-pointer hover:border-zinc-700 transition-all`}
        onClick={onSelect}
      >
        <div className={`absolute top-3 left-3 w-8 h-8 bg-gradient-to-r ${rankColors[stock.rank as 1 | 2 | 3]} rounded-full flex items-center justify-center`}>
          <span className="text-sm font-black">{stock.rank}</span>
        </div>

        <div className="flex items-center justify-between ml-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center text-sm font-black">
              {stock.symbol.slice(0, 2)}
            </div>
            <div>
              <h4 className="text-sm font-black">{stock.symbol}</h4>
              <p className="text-[9px] text-zinc-600 uppercase tracking-widest">{stock.name}</p>
            </div>
          </div>
          <div className="text-right">
            <p className={`text-lg font-black tabular-nums ${isPositive ? 'text-[#F04438]' : 'text-[#2E6BE6]'}`}>
              {isPositive ? '+' : ''}{stock.changePercent.toFixed(2)}%
            </p>
            <p className="text-sm font-bold text-zinc-600">{stock.turnover}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div 
      className="bg-[#0a0a0a] border border-zinc-900 rounded-2xl p-4 flex items-center justify-between cursor-pointer hover:border-zinc-700 transition-all"
      onClick={onSelect}
    >
      <div className="flex items-center gap-3">
        <span className="text-sm font-black text-zinc-700 w-6">{stock.rank}</span>
        <div className="w-8 h-8 rounded-full bg-zinc-900 flex items-center justify-center text-xs font-black">
          {stock.symbol.slice(0, 2)}
        </div>
        <div>
          <p className="text-xs font-black">{stock.symbol}</p>
          <p className="text-[9px] text-zinc-700">{stock.name}</p>
        </div>
      </div>
      <div className="text-right">
        <p className={`text-sm font-black ${isPositive ? 'text-[#F04438]' : 'text-[#2E6BE6]'}`}>
          {isPositive ? '+' : ''}{stock.changePercent.toFixed(2)}%
        </p>
        <p className="text-xs text-zinc-700">{stock.turnover}</p>
      </div>
    </div>
  )
}
