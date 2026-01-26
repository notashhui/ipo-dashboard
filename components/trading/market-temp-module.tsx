'use client'

import { useRouter } from 'next/navigation'
import { ChevronLeft } from 'lucide-react'
import type { Stock } from '@/lib/types'
import { mockStocks } from '@/lib/mock-data'

interface MarketTempModuleProps {
  onBack: () => void
  onStockSelect: (stock: Stock) => void
}

export function MarketTempModule({ onBack, onStockSelect }: MarketTempModuleProps) {
  const router = useRouter()
  const temperature = 65

  return (
    <div className="min-h-screen bg-black text-white pb-24">
      {/* Header */}
      <div className="sticky top-0 bg-black/95 backdrop-blur-md z-50 border-b border-zinc-900">
        <div className="flex items-center px-4 py-3">
          <button onClick={onBack} className="p-2 hover:bg-zinc-900 rounded-full">
            <ChevronLeft size={22} className="text-zinc-400" />
          </button>
          <h1 className="flex-1 text-center font-black text-sm uppercase tracking-widest">Market Temperature</h1>
          <div className="w-10" />
        </div>
      </div>

      {/* Temperature Gauge */}
      <div className="px-4 py-8">
        <div className="bg-[#0a0a0a] rounded-3xl p-6 border border-zinc-900">
          <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600 mb-6">Market Temperature</h3>
          
          <div className="flex justify-center mb-6">
            <div className="relative w-48 h-28">
              <svg className="w-full h-full" viewBox="0 0 200 110">
                {/* Background arc */}
                <path 
                  d="M 20 90 A 80 80 0 0 1 180 90" 
                  fill="none" 
                  stroke="#18181b" 
                  strokeWidth="12" 
                  strokeLinecap="round"
                />
                {/* Value arc */}
                <path 
                  d="M 20 90 A 80 80 0 0 1 150 55" 
                  fill="none" 
                  stroke="#f59e0b" 
                  strokeWidth="12" 
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-center">
                <span className="text-4xl font-black tabular-nums text-[#f59e0b]">{temperature}°</span>
                <p className="text-[8px] font-bold uppercase tracking-widest text-zinc-600 mt-1">Moderate Heat</p>
              </div>
            </div>
          </div>

          {/* Dimension Indicators */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex justify-between items-center p-3 bg-zinc-950 rounded-2xl">
              <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-700">Valuation</span>
              <span className="text-xs font-black text-[#F04438]">HIGH</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-zinc-950 rounded-2xl">
              <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-700">Sentiment</span>
              <span className="text-xs font-black text-[#10b981]">CALM</span>
            </div>
          </div>

          {/* Trend Line */}
          <div className="mt-6 h-20">
            <svg className="w-full h-full" viewBox="0 0 300 60">
              <polyline 
                points="0,40 50,30 100,35 150,20 200,25 250,15 300,20" 
                fill="none" 
                stroke="#3b82f6" 
                strokeWidth="2" 
              />
              <circle cx="300" cy="20" r="3" fill="#3b82f6" />
            </svg>
          </div>
        </div>
      </div>

      {/* Sector Heatmap */}
      <div className="px-4 pb-6">
        <div className="bg-[#0a0a0a] rounded-3xl p-6 border border-zinc-900">
          <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600 mb-6">Sector Heatmap</h3>
          
          <div className="grid grid-cols-4 gap-1 h-64">
            {/* Large block (2x2) */}
            <button
              type="button"
              onClick={() => router.push('/sector/technology')}
              className="col-span-2 row-span-2 bg-[#F04438] bg-opacity-20 border border-[#F04438] rounded-2xl p-3 flex flex-col justify-between cursor-pointer hover:bg-opacity-30 transition-all text-left"
            >
              <span className="text-[9px] font-black uppercase tracking-widest text-[#F04438]">Technology</span>
              <div>
                <p className="text-lg font-black text-white">+3.2%</p>
                <p className="text-[8px] text-zinc-600">$2.4T</p>
              </div>
            </button>

            {/* Medium block (1x2) */}
            <button
              type="button"
              onClick={() => router.push('/sector/finance')}
              className="row-span-2 bg-[#10b981] bg-opacity-20 border border-[#10b981] rounded-2xl p-3 flex flex-col justify-between cursor-pointer hover:bg-opacity-30 transition-all text-left"
            >
              <span className="text-[9px] font-black uppercase tracking-widest text-[#10b981]">Finance</span>
              <div>
                <p className="text-sm font-black text-white">+1.8%</p>
                <p className="text-[8px] text-zinc-600">$1.2T</p>
              </div>
            </button>

            {/* Small blocks */}
            <button
              type="button"
              onClick={() => router.push('/sector/energy')}
              className="bg-[#2E6BE6] bg-opacity-20 border border-[#2E6BE6] rounded-xl p-2 cursor-pointer hover:bg-opacity-30 transition-all text-left"
            >
              <span className="text-[8px] font-black uppercase tracking-widest text-[#2E6BE6]">Energy</span>
              <p className="text-xs font-black text-white mt-1">-0.5%</p>
            </button>
            <button
              type="button"
              onClick={() => router.push('/sector/healthcare')}
              className="bg-[#10b981] bg-opacity-20 border border-[#10b981] rounded-xl p-2 cursor-pointer hover:bg-opacity-30 transition-all text-left"
            >
              <span className="text-[8px] font-black uppercase tracking-widest text-[#10b981]">Health</span>
              <p className="text-xs font-black text-white mt-1">+0.9%</p>
            </button>

            {/* Bottom row */}
            <button
              type="button"
              onClick={() => router.push('/sector/consumer')}
              className="col-span-2 bg-[#2E6BE6] bg-opacity-20 border border-[#2E6BE6] rounded-xl p-2 cursor-pointer hover:bg-opacity-30 transition-all text-left"
            >
              <span className="text-[8px] font-black uppercase tracking-widest text-[#2E6BE6]">Consumer</span>
              <p className="text-xs font-black text-white mt-1">-1.2%</p>
            </button>
            <button
              type="button"
              onClick={() => router.push('/sector/industrial')}
              className="col-span-2 bg-[#F04438] bg-opacity-20 border border-[#F04438] rounded-xl p-2 cursor-pointer hover:bg-opacity-30 transition-all text-left"
            >
              <span className="text-[8px] font-black uppercase tracking-widest text-[#F04438]">Industrial</span>
              <p className="text-xs font-black text-white mt-1">+2.1%</p>
            </button>
          </div>

          {/* Sector Stocks */}
          <div className="mt-6 pt-6 border-t border-zinc-900">
            <h4 className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-600 mb-4">Technology Stocks</h4>
            <div className="space-y-2">
              {mockStocks.slice(0, 3).map(stock => (
                <div 
                  key={stock.symbol}
                  className="flex items-center justify-between p-3 bg-zinc-950 rounded-2xl cursor-pointer hover:bg-zinc-900 transition-all"
                  onClick={() => onStockSelect(stock)}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-zinc-900 flex items-center justify-center text-xs font-black">
                      {stock.symbol.slice(0, 2)}
                    </div>
                    <div>
                      <p className="text-xs font-black">{stock.symbol}</p>
                      <p className="text-[9px] text-zinc-600">{stock.name}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-black ${stock.changePercent >= 0 ? 'text-[#F04438]' : 'text-[#2E6BE6]'}`}>
                      {stock.changePercent >= 0 ? '+' : ''}{stock.changePercent}%
                    </p>
                    <p className="text-[9px] text-zinc-600">${stock.price.toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
