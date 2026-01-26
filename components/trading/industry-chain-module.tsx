'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight, Plus, Minus, X } from 'lucide-react'
import type { IndustryChain, IndustrySubSector, Stock } from '@/lib/types'
import { mockIndustryChains } from '@/lib/mock-data'

interface IndustryChainModuleProps {
  onBack: () => void
  onStockSelect: (stock: Stock, badge?: string) => void
}

type DrillLevel = 'industries' | 'tree' | 'stocks'

export function IndustryChainModule({ onBack, onStockSelect }: IndustryChainModuleProps) {
  const [drillLevel, setDrillLevel] = useState<DrillLevel>('industries')
  const [selectedChain, setSelectedChain] = useState<IndustryChain | null>(null)
  const [selectedSubSector, setSelectedSubSector] = useState<IndustrySubSector | null>(null)

  const handleChainSelect = (chain: IndustryChain) => {
    setSelectedChain(chain)
    setDrillLevel('tree')
  }

  const handleSubSectorSelect = (subSector: IndustrySubSector) => {
    setSelectedSubSector(subSector)
    setDrillLevel('stocks')
  }

  const handleBack = () => {
    if (drillLevel === 'stocks') {
      setDrillLevel('tree')
      setSelectedSubSector(null)
    } else if (drillLevel === 'tree') {
      setDrillLevel('industries')
      setSelectedChain(null)
    } else {
      onBack()
    }
  }

  return (
    <div className="min-h-screen bg-black text-white pb-24">
      {/* Header */}
      <div className="sticky top-0 bg-black/95 backdrop-blur-md z-50 border-b border-zinc-900">
        <div className="flex items-center px-4 py-4">
          <button onClick={handleBack} className="w-11 h-11 flex items-center justify-center hover:bg-zinc-900 rounded-full border border-zinc-800">
            <ChevronLeft size={20} className="text-zinc-400" />
          </button>
          <h1 className="flex-1 text-center text-sm font-black uppercase tracking-[0.2em]">
            Industry Chains
          </h1>
          <div className="w-11" />
        </div>
      </div>

      {/* Level 1: Industry Cards */}
      {drillLevel === 'industries' && (
        <div className="px-4 py-6 space-y-4">
          {mockIndustryChains.map((chain) => (
            <IndustryCard 
              key={chain.id}
              chain={chain}
              onSelect={() => handleChainSelect(chain)}
            />
          ))}
        </div>
      )}

      {/* Level 2: Vertical Tree Path */}
      {drillLevel === 'tree' && selectedChain && (
        <TreePathView 
          chain={selectedChain}
          onSubSectorSelect={handleSubSectorSelect}
        />
      )}

      {/* Level 3: Constituent Stocks Drawer */}
      {drillLevel === 'stocks' && selectedSubSector && (
        <StocksDrawer 
          subSector={selectedSubSector}
          onClose={() => setDrillLevel('tree')}
          onStockSelect={onStockSelect}
        />
      )}
    </div>
  )
}

// Level 1: Industry Card Component
function IndustryCard({ chain, onSelect }: { chain: IndustryChain; onSelect: () => void }) {
  return (
    <div 
      className="bg-zinc-900/40 rounded-3xl overflow-hidden cursor-pointer hover:bg-zinc-900/60 transition-all border border-zinc-800/50"
      onClick={onSelect}
    >
      {/* Gradient Header */}
      <div className={`h-36 bg-gradient-to-br ${chain.gradient} relative p-6 flex flex-col justify-end`}>
        <h3 className="text-xl font-black uppercase tracking-tight">{chain.name}</h3>
        <p className="text-[10px] text-zinc-400 uppercase tracking-widest mt-1">{chain.description}</p>
        <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-600" size={24} />
      </div>

      {/* Stock Ticker Pills */}
      <div className="p-4 flex gap-2 flex-wrap bg-zinc-950/50">
        {chain.stocks.map(ticker => (
          <div key={ticker} className="px-4 py-2 bg-zinc-900/80 rounded-full border border-zinc-800/50">
            <span className="text-[10px] font-black uppercase tracking-widest text-teal-400">{ticker}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// Level 2: Tree Path View Component
function TreePathView({ 
  chain, 
  onSubSectorSelect 
}: { 
  chain: IndustryChain
  onSubSectorSelect: (subSector: IndustrySubSector) => void 
}) {
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({
    upstream: true,
    midstream: true,
    downstream: true
  })

  const toggleNode = (level: string) => {
    setExpandedNodes(prev => ({ ...prev, [level]: !prev[level] }))
  }

  const levelConfig = {
    upstream: { color: 'emerald', label: 'UPSTREAM' },
    midstream: { color: 'amber', label: 'MIDSTREAM' },
    downstream: { color: 'rose', label: 'DOWNSTREAM' }
  }

  return (
    <div className="px-4 py-6">
      {/* Chain Header */}
      <div className="bg-zinc-900/40 rounded-2xl p-5 mb-6 border border-zinc-800/50">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Market Cap (USD)</span>
            <p className="text-2xl font-black mt-1">{chain.marketCap}</p>
          </div>
          <div className="text-right">
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Related Stocks</span>
            <p className="text-2xl font-black mt-1">{chain.stockCount}</p>
          </div>
        </div>
      </div>

      {/* Vertical Tree */}
      <div className="relative">
        {chain.segments.map((segment, segmentIndex) => {
          const config = levelConfig[segment.level]
          const isExpanded = expandedNodes[segment.level]
          const isLast = segmentIndex === chain.segments.length - 1

          return (
            <div key={segment.level} className="relative">
              {/* Level Node */}
              <div className="flex items-start gap-4 mb-6">
                {/* Vertical Line & Node */}
                <div className="relative flex flex-col items-center">
                  {/* Level Button */}
                  <button
                    onClick={() => toggleNode(segment.level)}
                    className={`w-20 py-2.5 rounded-lg font-black text-[10px] uppercase tracking-wider transition-all ${
                      config.color === 'emerald' ? 'bg-emerald-900/40 text-emerald-400 border border-emerald-800/50' :
                      config.color === 'amber' ? 'bg-amber-900/40 text-amber-400 border border-amber-800/50' :
                      'bg-rose-900/40 text-rose-400 border border-rose-800/50'
                    }`}
                  >
                    {config.label}
                  </button>
                  
                  {/* Vertical Connector */}
                  {!isLast && (
                    <div className="w-0.5 h-12 bg-zinc-800 mt-2" />
                  )}
                  
                  {/* Arrow down */}
                  {!isLast && (
                    <div className="text-zinc-700">
                      <svg width="12" height="8" viewBox="0 0 12 8" fill="currentColor">
                        <path d="M6 8L0 0h12L6 8z" />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Sub-sectors */}
                <div className="flex-1 space-y-3">
                  {/* Toggle Button */}
                  <button
                    onClick={() => toggleNode(segment.level)}
                    className="w-8 h-8 rounded-full border border-zinc-700 flex items-center justify-center hover:bg-zinc-800 transition-colors"
                  >
                    {isExpanded ? (
                      <Minus size={14} className="text-zinc-500" />
                    ) : (
                      <Plus size={14} className="text-zinc-500" />
                    )}
                  </button>

                  {/* Expanded Sub-sectors */}
                  {isExpanded && (
                    <div className="space-y-2 pl-2">
                      {segment.subSectors.map((subSector) => (
                        <button
                          key={subSector.id}
                          onClick={() => onSubSectorSelect(subSector)}
                          className="w-full flex items-center justify-between p-4 bg-zinc-900/60 rounded-xl border border-zinc-800/50 hover:bg-zinc-800/60 transition-all group"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-1.5 h-1.5 rounded-full bg-zinc-600" />
                            <span className="text-sm font-bold text-zinc-300">{subSector.name}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] text-zinc-600 font-bold">{subSector.stocks.length} stocks</span>
                            <Plus size={14} className="text-zinc-600 group-hover:text-zinc-400 transition-colors" />
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// Level 3: Constituent Stocks Drawer
function StocksDrawer({ 
  subSector, 
  onClose,
  onStockSelect 
}: { 
  subSector: IndustrySubSector
  onClose: () => void
  onStockSelect: (stock: Stock, badge?: string) => void
}) {
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50" onClick={onClose}>
      <div 
        className="fixed bottom-0 left-0 right-0 bg-zinc-950 border-t border-zinc-800 rounded-t-3xl max-w-[430px] mx-auto max-h-[75vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drag Handle */}
        <div className="flex justify-center py-4">
          <div className="w-12 h-1 bg-zinc-800 rounded-full" />
        </div>

        <div className="px-6 pb-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-black uppercase tracking-tight">{subSector.name}</h3>
              <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1">
                {subSector.stocks.length} Constituents
              </p>
            </div>
            <button onClick={onClose} className="w-10 h-10 flex items-center justify-center hover:bg-zinc-900 rounded-full border border-zinc-800">
              <X size={18} className="text-zinc-500" />
            </button>
          </div>

          {/* Stock List */}
          <div className="space-y-3 max-h-[50vh] overflow-y-auto no-scrollbar">
            {subSector.stocks.map((stock) => (
              <div 
                key={stock.symbol}
                className="flex items-center justify-between p-4 bg-zinc-900/60 rounded-2xl cursor-pointer hover:bg-zinc-800/60 transition-all border border-zinc-800/30"
                onClick={() => onStockSelect(stock, subSector.name)}
              >
                <div className="flex items-center gap-4">
                  {/* Stock Avatar */}
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xs font-black ${
                    stock.changePercent >= 0 ? 'bg-rose-900/40 text-rose-400' : 'bg-blue-900/40 text-blue-400'
                  }`}>
                    {stock.symbol.slice(0, 4)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-black">{stock.symbol}</p>
                      <span className="px-1.5 py-0.5 bg-zinc-800 rounded text-[8px] font-bold text-zinc-500">L2</span>
                    </div>
                    <p className="text-[10px] text-zinc-500 uppercase tracking-widest mt-0.5">{stock.name}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-black text-zinc-300">${stock.price.toFixed(2)}</p>
                  <p className={`text-xs font-bold ${stock.changePercent >= 0 ? 'text-[#F04438]' : 'text-[#2E6BE6]'}`}>
                    {stock.changePercent >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
