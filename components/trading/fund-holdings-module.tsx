'use client'

import { useState } from 'react'
import { ChevronLeft, Info } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import type { Stock } from '@/lib/types'
import { 
  mockInstitutionalStats, 
  mockChartData, 
  mockTopHolders, 
  mockInstitutionalActivity 
} from '@/lib/mock/institutional-holdings'

interface FundHoldingsModuleProps {
  onBack: () => void
  onStockSelect: (stock: Stock, badge?: string) => void
  onInstitutionSelect?: (institutionName: string) => void
}

type ActivityFilter = 'ALL' | 'INCREASE' | 'DECREASE' | 'NEW' | 'CLEAR'

export function FundHoldingsModule({ onBack, onStockSelect, onInstitutionSelect }: FundHoldingsModuleProps) {
  const [activityFilter, setActivityFilter] = useState<ActivityFilter>('ALL')

  // Format large numbers
  const formatShares = (shares: number): string => {
    if (shares >= 100000000) {
      return `${(shares / 100000000).toFixed(2)}亿`
    } else if (shares >= 10000) {
      return `${(shares / 10000).toFixed(2)}万`
    }
    return shares.toLocaleString()
  }

  const formatAmount = (amount: number): string => {
    if (amount >= 100000000) {
      return `${(amount / 100000000).toFixed(2)}亿`
    } else if (amount >= 10000) {
      return `${(amount / 10000).toFixed(2)}万`
    }
    return amount.toLocaleString()
  }

  // Filter activity based on selected tab
  const filteredActivity = activityFilter === 'ALL' 
    ? mockInstitutionalActivity 
    : mockInstitutionalActivity.filter(activity => activity.activityType === activityFilter)

  return (
    <div className="min-h-screen bg-black text-white pb-24">
      {/* Header */}
      <div className="sticky top-0 bg-black/95 backdrop-blur-md z-50 border-b border-zinc-900">
        <div className="flex items-center px-4 py-3">
          <button onClick={onBack} className="p-2 hover:bg-zinc-900 rounded-full">
            <ChevronLeft size={22} className="text-zinc-400" />
          </button>
          <h1 className="flex-1 text-center font-black text-sm uppercase tracking-widest">Institutional Holdings</h1>
          <div className="w-10" />
        </div>
      </div>

      {/* Stock Info Header (placeholder - can be passed as prop) */}
      <div className="px-4 py-4 border-b border-zinc-900">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-black">AAPL</h2>
            <p className="text-xs text-zinc-400">Apple Inc.</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-black">$178.23</p>
            <p className="text-xs text-emerald-400">+5.92 (+3.45%)</p>
          </div>
        </div>
      </div>

      {/* Institutional Statistics Overview */}
      <div className="px-4 py-4 border-b border-zinc-900">
        <div className="flex items-center gap-2 mb-4">
          <h3 className="text-xs font-black uppercase tracking-widest text-zinc-300">Institutional Statistics</h3>
          <Info size={12} className="text-zinc-500" />
        </div>
        <div className="grid grid-cols-3 gap-3">
          {/* Holding Percentage */}
          <div className="bg-zinc-900/40 rounded-xl p-3 border border-zinc-800/50">
            <p className="text-[9px] text-zinc-500 uppercase tracking-wider mb-1">Holding %</p>
            <p className="text-base font-black tabular-nums">{mockInstitutionalStats.holdingPercentage.toFixed(2)}%</p>
            <p className={`text-[10px] font-bold mt-1 ${
              mockInstitutionalStats.holdingPercentageChange >= 0 ? 'text-red-400' : 'text-emerald-400'
            }`}>
              {mockInstitutionalStats.holdingPercentageChange >= 0 ? '+' : ''}{mockInstitutionalStats.holdingPercentageChange.toFixed(2)}%
            </p>
          </div>

          {/* Shares Held */}
          <div className="bg-zinc-900/40 rounded-xl p-3 border border-zinc-800/50">
            <p className="text-[9px] text-zinc-500 uppercase tracking-wider mb-1">Shares Held</p>
            <p className="text-base font-black tabular-nums">{formatShares(mockInstitutionalStats.sharesHeld)}</p>
            <p className={`text-[10px] font-bold mt-1 ${
              mockInstitutionalStats.sharesHeldChange >= 0 ? 'text-red-400' : 'text-emerald-400'
            }`}>
              {mockInstitutionalStats.sharesHeldChange >= 0 ? '+' : ''}{formatShares(mockInstitutionalStats.sharesHeldChange)}
            </p>
          </div>

          {/* Institutions Count */}
          <div className="bg-zinc-900/40 rounded-xl p-3 border border-zinc-800/50">
            <p className="text-[9px] text-zinc-500 uppercase tracking-wider mb-1">Institutions</p>
            <p className="text-base font-black tabular-nums">{mockInstitutionalStats.institutionsCount}家</p>
            <p className={`text-[10px] font-bold mt-1 ${
              mockInstitutionalStats.institutionsCountChange >= 0 ? 'text-red-400' : 'text-emerald-400'
            }`}>
              {mockInstitutionalStats.institutionsCountChange >= 0 ? '+' : ''}{mockInstitutionalStats.institutionsCountChange}家
            </p>
          </div>
        </div>
      </div>

      {/* Trend Chart Section */}
      <div className="px-4 py-4 border-b border-zinc-900">
        <div className="bg-zinc-900/40 rounded-xl p-4 border border-zinc-800/50">
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={mockChartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
              <XAxis 
                dataKey="quarter" 
                stroke="#71717a"
                tick={{ fill: '#71717a', fontSize: 10 }}
                interval="preserveStartEnd"
              />
              <YAxis 
                yAxisId="left"
                stroke="#3b82f6"
                tick={{ fill: '#3b82f6', fontSize: 10 }}
                label={{ value: 'Holding %', angle: -90, position: 'insideLeft', fill: '#3b82f6', fontSize: 10 }}
              />
              <YAxis 
                yAxisId="right"
                orientation="right"
                stroke="#71717a"
                tick={{ fill: '#71717a', fontSize: 10 }}
                label={{ value: 'Asset Price', angle: 90, position: 'insideRight', fill: '#71717a', fontSize: 10 }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#18181b', 
                  border: '1px solid #27272a',
                  borderRadius: '8px',
                  color: '#fff'
                }}
              />
              <Legend 
                wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }}
                iconType="line"
              />
              <Line 
                yAxisId="left"
                type="monotone" 
                dataKey="holdingPercentage" 
                stroke="#3b82f6" 
                strokeWidth={2}
                dot={false}
                name="Holding %"
              />
              <Line 
                yAxisId="right"
                type="monotone" 
                dataKey="assetPrice" 
                stroke="#71717a" 
                strokeWidth={2}
                dot={false}
                name="Price"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Holders List */}
      <div className="px-4 py-4 border-b border-zinc-900">
        <h3 className="text-xs font-black uppercase tracking-widest text-zinc-300 mb-3">Top Holders</h3>
        <div className="space-y-2">
          {mockTopHolders.map((holder, index) => (
            <div
              key={holder.name}
              onClick={() => onInstitutionSelect?.(holder.name)}
              className="flex items-center justify-between p-3 bg-zinc-900/40 rounded-xl border border-zinc-800/50 cursor-pointer hover:bg-zinc-900/60 transition-colors"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <span className="text-[10px] text-zinc-500 font-bold w-4">{index + 1}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-white truncate">{holder.name}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-right">
                <div>
                  <p className="text-xs font-black tabular-nums">{holder.holdingPercentage.toFixed(2)}%</p>
                </div>
                <div className="w-20">
                  <p className={`text-xs font-black tabular-nums ${
                    holder.sharesChange >= 0 ? 'text-red-400' : 'text-emerald-400'
                  }`}>
                    {holder.sharesChange >= 0 ? '+' : ''}{formatShares(holder.sharesChange)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Institutional Activity Section */}
      <div className="px-4 py-4">
        <h3 className="text-xs font-black uppercase tracking-widest text-zinc-300 mb-3">Institutional Activity</h3>
        
        {/* Filter Tabs */}
        <div className="flex items-center gap-2 mb-4 overflow-x-auto no-scrollbar">
          {(['ALL', 'INCREASE', 'DECREASE', 'NEW', 'CLEAR'] as ActivityFilter[]).map((filter) => (
            <button
              key={filter}
              onClick={() => setActivityFilter(filter)}
              className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider whitespace-nowrap transition-colors ${
                activityFilter === filter
                  ? 'bg-zinc-800 text-white border border-zinc-700'
                  : 'bg-zinc-900/40 text-zinc-500 border border-zinc-800/50 hover:text-zinc-400'
              }`}
            >
              {filter === 'ALL' ? 'All' : filter === 'INCREASE' ? 'Increase' : filter === 'DECREASE' ? 'Decrease' : filter === 'NEW' ? 'New Position' : 'Clear Position'}
            </button>
          ))}
        </div>

        {/* Activity Table Header */}
        <div className="grid grid-cols-4 gap-2 px-2 py-2 mb-2 bg-zinc-900/40 rounded-lg border border-zinc-800/50">
          <div className="text-[9px] font-bold uppercase tracking-wider text-zinc-500">Institution</div>
          <div className="text-[9px] font-bold uppercase tracking-wider text-zinc-500 text-right flex items-center justify-end gap-1">
            Shares Change
            <span className="text-zinc-600">↕</span>
          </div>
          <div className="text-[9px] font-bold uppercase tracking-wider text-zinc-500 text-right">Ratio Change</div>
          <div className="text-[9px] font-bold uppercase tracking-wider text-zinc-500 text-right">Amount Change</div>
        </div>

        {/* Activity List */}
        <div className="space-y-1">
          {filteredActivity.map((activity, index) => (
            <div
              key={`${activity.institutionName}-${index}`}
              onClick={() => onInstitutionSelect?.(activity.institutionName)}
              className="grid grid-cols-4 gap-2 px-2 py-3 bg-zinc-900/40 rounded-lg border border-zinc-800/50 cursor-pointer hover:bg-zinc-900/60 transition-colors"
            >
              <div className="min-w-0">
                <p className="text-xs font-bold text-white truncate">{activity.institutionName}</p>
              </div>
              <div className="text-right">
                <p className={`text-xs font-black tabular-nums ${
                  activity.sharesChange >= 0 ? 'text-red-400' : 'text-emerald-400'
                }`}>
                  {activity.sharesChange >= 0 ? '+' : ''}{formatShares(activity.sharesChange)}
                </p>
              </div>
              <div className="text-right">
                <p className={`text-xs font-black tabular-nums ${
                  activity.ratioChange >= 0 ? 'text-red-400' : 'text-emerald-400'
                }`}>
                  {activity.ratioChange >= 0 ? '+' : ''}{activity.ratioChange.toFixed(2)}%
                </p>
              </div>
              <div className="text-right">
                <p className={`text-xs font-black tabular-nums ${
                  activity.amountChange >= 0 ? 'text-red-400' : 'text-emerald-400'
                }`}>
                  {activity.amountChange >= 0 ? '+' : ''}{formatAmount(activity.amountChange)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
