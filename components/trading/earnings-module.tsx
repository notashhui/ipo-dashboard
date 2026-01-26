'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { EarningsReport, Stock, Order } from '@/lib/types'
import { mockEarnings } from '@/lib/mock-data'
import { EarningsDetail } from './earnings-detail'

interface EarningsModuleProps {
  onBack: () => void
  onStockSelect: (stock: Stock, badge?: string) => void
  onOrderSubmit?: (order: Order) => void
  onNavigateToTrade?: () => void
  availableBalance?: number
}

const periods = ['Today', 'This Week', 'Next Week', 'This Month']

export function EarningsModule({ 
  onBack, 
  onStockSelect,
  onOrderSubmit,
  onNavigateToTrade,
  availableBalance
}: EarningsModuleProps) {
  const [activePeriod, setActivePeriod] = useState('This Week')
  const [selectedReport, setSelectedReport] = useState<EarningsReport | null>(null)

  // If a report is selected, show the detail view
  if (selectedReport) {
    return (
      <EarningsDetail
        report={selectedReport}
        onBack={() => setSelectedReport(null)}
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
          <h1 className="flex-1 text-center font-black text-sm uppercase tracking-widest">Earnings Calendar</h1>
          <div className="w-10" />
        </div>

        <div className="px-4 py-4">
          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            {periods.map(period => (
              <button
                key={period}
                onClick={() => setActivePeriod(period)}
                className={`px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest whitespace-nowrap ${
                  activePeriod === period ? 'bg-white text-black' : 'border border-zinc-900'
                }`}
              >
                {period}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Date Header */}
      <div className="px-4 py-6">
        <h3 className="text-xs font-black uppercase tracking-[0.3em] text-zinc-500">Monday, Jan 27</h3>
      </div>

      {/* Earnings Cards */}
      <div className="px-4 space-y-3">
        {mockEarnings.map((report) => (
          <EarningsCard 
            key={report.symbol} 
            report={report}
            onSelect={() => setSelectedReport(report)}
          />
        ))}
      </div>

      {/* Market Insight */}
      <div className="px-4 py-6">
        <div className="bg-zinc-900/40 rounded-2xl p-4 border border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-purple-600/20 flex items-center justify-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-purple-500">
                <path d="M3 17L9 11L13 15L21 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M17 7H21V11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-sm font-black uppercase tracking-wide text-white">Earnings Season Insight</p>
              <p className="text-xs text-zinc-500 mt-0.5">Tech sector beating estimates by 8.2% on average this quarter.</p>
            </div>
            <ChevronRight size={18} className="text-zinc-600" />
          </div>
        </div>
      </div>
    </div>
  )
}

function EarningsCard({ report, onSelect }: { report: EarningsReport; onSelect: () => void }) {
  const isPositive = report.change >= 0
  const hasBeat = report.financials?.revenue.status === 'beat' || 
                  report.financials?.ebit.status === 'beat' || 
                  report.financials?.eps.status === 'beat'

  return (
    <div 
      className="bg-zinc-900/40 rounded-2xl p-5 border border-zinc-800 cursor-pointer hover:border-zinc-700 transition-all active:scale-[0.98]"
      onClick={onSelect}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full bg-zinc-800 flex items-center justify-center text-[10px] font-black text-white">
            {report.symbol.slice(0, 4)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-black text-white">{report.symbol}</h4>
              <span className="px-1.5 py-0.5 rounded text-[8px] font-bold bg-zinc-800 text-zinc-400">L2</span>
            </div>
            <p className="text-[10px] text-zinc-500 uppercase tracking-wider">{report.name}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm font-black text-white tabular-nums">{report.price.toFixed(2)}</p>
          <p className={`text-[10px] font-bold ${isPositive ? 'text-[#10b981]' : 'text-[#F04438]'}`}>
            {isPositive ? '+' : ''}{report.changePercent.toFixed(2)}%
          </p>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2 p-3 bg-black/40 rounded-xl">
        <div>
          <span className="text-[8px] font-bold uppercase tracking-widest text-zinc-600">Report</span>
          <p className="text-[10px] font-black text-white mt-1">{report.reportPeriod || 'Q4'}</p>
        </div>
        <div>
          <span className="text-[8px] font-bold uppercase tracking-widest text-zinc-600">Time</span>
          <p className="text-[10px] font-black text-white mt-1">
            {report.reportTime === 'pre-market' ? 'Pre-Mkt' : 'After-Hrs'}
          </p>
        </div>
        <div>
          <span className="text-[8px] font-bold uppercase tracking-widest text-zinc-600">Est. EPS</span>
          <p className="text-[10px] font-black text-white mt-1">${report.estEPS.toFixed(2)}</p>
        </div>
        <div>
          <span className="text-[8px] font-bold uppercase tracking-widest text-zinc-600">Status</span>
          <p className={`text-[10px] font-black mt-1 ${hasBeat ? 'text-[#10b981]' : report.surprise ? 'text-[#F04438]' : 'text-amber-500'}`}>
            {hasBeat ? 'Beat' : report.surprise ? 'Miss' : 'Pending'}
          </p>
        </div>
      </div>

      {/* Quick Financials Preview */}
      {report.financials && (
        <div className="flex items-center gap-4 mt-3 pt-3 border-t border-zinc-800/50">
          <div className="flex items-center gap-1.5">
            <span className="text-[9px] text-zinc-600">Rev:</span>
            <span className={`text-[10px] font-bold ${report.financials.revenue.status === 'beat' ? 'text-[#10b981]' : 'text-[#F04438]'}`}>
              {report.financials.revenue.status === 'beat' ? 'Beat' : 'Miss'}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[9px] text-zinc-600">EBIT:</span>
            <span className={`text-[10px] font-bold ${report.financials.ebit.status === 'beat' ? 'text-[#10b981]' : 'text-[#F04438]'}`}>
              {report.financials.ebit.status === 'beat' ? 'Beat' : 'Miss'}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[9px] text-zinc-600">EPS:</span>
            <span className={`text-[10px] font-bold ${report.financials.eps.status === 'beat' ? 'text-[#10b981]' : 'text-[#F04438]'}`}>
              {report.financials.eps.status === 'beat' ? 'Beat' : 'Miss'}
            </span>
          </div>
          <ChevronRight size={14} className="text-zinc-600 ml-auto" />
        </div>
      )}
    </div>
  )
}
