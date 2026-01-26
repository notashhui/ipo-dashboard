'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { IPOStock, Stock, IpoOrder } from '@/lib/types'
import { mockIPOs } from '@/lib/mock-data'
import { IPODetail } from './ipo-detail'
import { IpoOrderCard } from './ipo-order-card'

interface IPOModuleProps {
  onBack: () => void
  onStockSelect: (stock: Stock, badge?: string) => void
  ipoOrders: IpoOrder[]
  onIpoOrderSubmit: (order: IpoOrder) => void
  onNavigateToTrade?: () => void
  availableBalance?: number
}

const filters = ['All', 'Subscribing', 'Pending', 'Listed']

export function IPOModule({ 
  onBack, 
  onStockSelect,
  ipoOrders,
  onIpoOrderSubmit,
  onNavigateToTrade,
  availableBalance
}: IPOModuleProps) {
  const [activeFilter, setActiveFilter] = useState('All')
  const [selectedIPO, setSelectedIPO] = useState<IPOStock | null>(null)

  const filteredIPOs = mockIPOs.filter(ipo => {
    if (activeFilter === 'All') return true
    return ipo.status === activeFilter.toLowerCase()
  })

  if (selectedIPO) {
    return (
      <IPODetail 
        ipo={selectedIPO}
        onBack={() => setSelectedIPO(null)}
        onIpoOrderSubmit={onIpoOrderSubmit}
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
          <h1 className="flex-1 text-center font-black text-sm uppercase tracking-widest">IPO Center</h1>
          <div className="w-10" />
        </div>

        {/* Filter Tabs */}
        <div className="px-4 py-4">
          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            {filters.map(filter => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${
                  activeFilter === filter 
                    ? 'bg-white text-black' 
                    : 'border border-zinc-800 text-zinc-400 hover:border-zinc-700'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* My IPO Orders */}
      {ipoOrders.length > 0 && (
        <div className="px-4 py-4 border-b border-zinc-900">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-3">My IPO Orders</h3>
          <div className="space-y-3">
            {ipoOrders.map((o) => (
              <IpoOrderCard key={o.id} order={o} />
            ))}
          </div>
        </div>
      )}

      {/* IPO Cards */}
      <div className="px-4 py-6 space-y-4">
        {filteredIPOs.map((ipo) => (
          <IPOCard 
            key={ipo.symbol} 
            ipo={ipo} 
            onSelect={() => setSelectedIPO(ipo)}
          />
        ))}

        {filteredIPOs.length === 0 && (
          <div className="text-center py-12">
            <span className="text-zinc-600 text-sm">No IPOs in this category</span>
          </div>
        )}
      </div>
    </div>
  )
}

function IPOCard({ ipo, onSelect }: { ipo: IPOStock; onSelect: () => void }) {
  const statusColors = {
    subscribing: 'from-blue-600 to-blue-500',
    pending: 'from-amber-600 to-orange-500',
    listed: 'from-emerald-600 to-emerald-500'
  }

  const statusLabels = {
    subscribing: 'Subscribing',
    pending: 'Pending',
    listed: 'Listed'
  }

  const phases = [
    { label: 'Start', value: ipo.timeline.start },
    { label: 'End', value: ipo.timeline.end },
    { label: 'Result', value: ipo.timeline.result },
    { label: 'Gray', value: ipo.timeline.gray },
    { label: 'List', value: ipo.timeline.list },
  ]

  return (
    <div 
      className="bg-zinc-900/40 rounded-2xl p-5 border border-zinc-900/60 cursor-pointer hover:border-zinc-700/60 transition-all active:scale-[0.99]"
      onClick={onSelect}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-zinc-800 to-zinc-900 flex items-center justify-center border border-zinc-800">
            <span className="text-[10px] font-black text-zinc-400">{ipo.symbol.slice(0, 4)}</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-black">{ipo.symbol}</h3>
              <span className="px-1.5 py-0.5 bg-zinc-800 rounded text-[8px] font-bold text-zinc-500">L2</span>
            </div>
            <p className="text-xs text-zinc-500 font-medium">{ipo.name}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className={`px-3 py-1.5 rounded-full bg-gradient-to-r ${statusColors[ipo.status]}`}>
            <span className="text-[9px] font-black uppercase tracking-widest">{statusLabels[ipo.status]}</span>
          </div>
          <ChevronRight size={18} className="text-zinc-600" />
        </div>
      </div>

      {/* Price Range */}
      <div className="mb-4">
        <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">Issue Price</span>
        <div className="flex items-baseline gap-2 mt-1">
          <span className="text-2xl font-black">{ipo.issuePrice.toFixed(2)}</span>
          {ipo.issuePriceMax && ipo.issuePriceMax !== ipo.issuePrice && (
            <>
              <span className="text-lg font-light text-zinc-600">~</span>
              <span className="text-2xl font-black">{ipo.issuePriceMax.toFixed(2)}</span>
            </>
          )}
          <span className="text-xs font-bold text-zinc-600">{ipo.currency}</span>
        </div>
      </div>

      {/* 5-Node Timeline */}
      <div className="relative mb-4">
        <div className="absolute top-1.5 left-0 right-0 h-0.5 bg-zinc-800" />
        <div 
          className="absolute top-1.5 left-0 h-0.5 bg-blue-500 transition-all"
          style={{ width: `${Math.min(100, (ipo.currentPhase / 4) * 100)}%` }}
        />
        
        <div className="relative flex justify-between items-start">
          {phases.map((phase, index) => {
            const isCompleted = index < ipo.currentPhase
            const isCurrent = index === ipo.currentPhase
            
            return (
              <div key={phase.label} className="flex flex-col items-center">
                <div className="relative">
                  <div 
                    className={`w-3 h-3 rounded-full border-2 border-black z-10 ${
                      isCompleted || isCurrent
                        ? 'bg-blue-500' 
                        : 'bg-zinc-800'
                    }`} 
                  />
                  {isCurrent && (
                    <div className="absolute inset-0 rounded-full bg-blue-500 opacity-30 animate-ping" />
                  )}
                </div>
                <span className={`text-[8px] font-bold uppercase tracking-wider mt-2 ${
                  isCurrent ? 'text-blue-400' : 'text-zinc-700'
                }`}>
                  {phase.label}
                </span>
                <span className={`text-[9px] tabular-nums ${
                  isCurrent ? 'text-blue-400' : 'text-zinc-700'
                }`}>
                  {phase.value}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Key Data */}
      <div className="grid grid-cols-3 gap-4 pt-4 border-t border-zinc-800/60">
        <div>
          <span className="text-[8px] font-bold uppercase tracking-widest text-zinc-700">Entry Fee</span>
          <p className="text-sm font-black text-white mt-1">${ipo.entryFee.toLocaleString()}</p>
        </div>
        <div>
          <span className="text-[8px] font-bold uppercase tracking-widest text-zinc-700">Lot Size</span>
          <p className="text-sm font-black text-white mt-1">{ipo.lotSize} Shares</p>
        </div>
        <div>
          <span className="text-[8px] font-bold uppercase tracking-widest text-zinc-700">Industry</span>
          <p className="text-sm font-black text-white mt-1 truncate">{ipo.industry.split(' ')[0]}</p>
        </div>
      </div>
    </div>
  )
}
