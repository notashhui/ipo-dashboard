'use client'

import { useState } from 'react'
import { ChevronLeft, Search, Info, ChevronRight } from 'lucide-react'
import type { DividendStock, Stock, Order } from '@/lib/types'
import { OrderDrawer } from './order-drawer'

interface DividendDetailProps {
  dividend: DividendStock
  onBack: () => void
  onStockSelect?: (stock: Stock) => void
  onOrderSubmit?: (order: Order) => void
  onNavigateToTrade?: () => void
  availableBalance?: number
}

export function DividendDetail({
  dividend,
  onBack,
  onOrderSubmit,
  onNavigateToTrade,
  availableBalance = 1284560
}: DividendDetailProps) {
  const [orderDrawer, setOrderDrawer] = useState<{ isOpen: boolean; type: 'buy' | 'sell' }>({
    isOpen: false,
    type: 'buy'
  })

  const maxDPS = Math.max(...dividend.history)
  const maxYield = Math.max(...dividend.yieldHistory)

  // SVG dimensions for the chart - optimized for spacing
  const chartWidth = 340
  const chartHeight = 160
  const barWidth = 32
  const barGap = 36
  const chartPadding = 30

  return (
    <div className="min-h-screen bg-black text-white pb-36">
      {/* Header */}
      <div className="sticky top-0 bg-black/95 backdrop-blur-md z-50 border-b border-zinc-900">
        <div className="flex items-center justify-between px-4 py-4">
          <button onClick={onBack} className="p-2 hover:bg-zinc-900 rounded-full">
            <ChevronLeft size={22} className="text-zinc-400" />
          </button>
          <h1 className="font-black text-sm uppercase tracking-widest">Dividends</h1>
          <button className="p-2 hover:bg-zinc-900 rounded-full">
            <Search size={20} className="text-zinc-400" />
          </button>
        </div>
      </div>

      {/* Stock Info - More breathing room */}
      <div className="px-5 pt-8 pb-6">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-black">{dividend.symbol}</h2>
          <span className="text-zinc-500 text-base">{dividend.name}</span>
        </div>
        <div className="flex items-center gap-3 mt-2">
          <span className={`text-xl font-bold ${dividend.change >= 0 ? 'text-[#F04438]' : 'text-[#2E6BE6]'}`}>
            {dividend.price.toFixed(3)}
          </span>
          <span className={`text-sm ${dividend.change >= 0 ? 'text-[#F04438]' : 'text-[#2E6BE6]'}`}>
            {dividend.change >= 0 ? '+' : ''}{dividend.change.toFixed(3)} {dividend.changePercent.toFixed(2)}%
          </span>
        </div>
      </div>

      {/* Payout Statistics Card - Increased padding */}
      <div className="px-5 pb-8">
        <div className="bg-zinc-900/40 rounded-2xl p-6 border border-zinc-800/30">
          <div className="flex items-center gap-2 mb-5">
            <h3 className="text-[11px] font-black uppercase tracking-widest text-zinc-400">Payout Statistics</h3>
            <Info size={14} className="text-zinc-600" />
          </div>

          {/* Latest Dividend Banner */}
          <div className="bg-zinc-950/80 rounded-xl px-5 py-4 mb-8 flex items-center justify-between border border-zinc-800/50">
            <span className="text-[10px] text-zinc-500 uppercase tracking-wider">
              Latest: {dividend.paymentDate}
            </span>
            <span className="text-sm font-bold text-white">
              1 Share = {dividend.latestDPS.toFixed(2)} {dividend.currency}
            </span>
            <ChevronRight size={14} className="text-zinc-600" />
          </div>

          {/* Key Metrics - More vertical space */}
          <div className="grid grid-cols-3 gap-6">
            <div className="text-center py-2">
              <p className="text-[9px] font-bold uppercase tracking-widest text-zinc-600 mb-2">Div Yield TTM</p>
              <p className="text-2xl font-black text-white tabular-nums">{dividend.yieldTTM.toFixed(2)}%</p>
            </div>
            <div className="text-center py-2 border-x border-zinc-800/50">
              <p className="text-[9px] font-bold uppercase tracking-widest text-zinc-600 mb-2">Payout Ratio LFY</p>
              <p className="text-2xl font-black text-white tabular-nums">{dividend.payoutLFY.toFixed(2)}%</p>
            </div>
            <div className="text-center py-2">
              <p className="text-[9px] font-bold uppercase tracking-widest text-zinc-600 mb-2">Frequency</p>
              <p className="text-2xl font-black text-white tabular-nums">{dividend.frequencyCount}x/yr</p>
            </div>
          </div>
        </div>
      </div>

      {/* 5-Year Dividend Trend Chart Card - Standardized container */}
      <div className="px-5 pb-8">
        <div className="bg-zinc-900/40 rounded-2xl p-6 border border-zinc-800/30">
          {/* Chart Header with Legend */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-[11px] font-black uppercase tracking-widest text-zinc-400">5-Year Dividend Trend</h3>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-sm bg-[#2E6BE6]" />
                <span className="text-[8px] font-bold text-zinc-500 uppercase tracking-wider">DPS</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-4 h-0.5 bg-[#f59e0b] rounded-full" />
                <span className="text-[8px] font-bold text-zinc-500 uppercase tracking-wider">Yield</span>
              </div>
            </div>
          </div>

          {/* Mixed Bar-Line Chart - With proper padding */}
          <div className="relative px-2">
            {/* Horizontal Grid Lines - Reduced count */}
            <div className="absolute inset-x-0 top-0 h-full flex flex-col justify-between pointer-events-none" style={{ height: chartHeight }}>
              {[0, 1, 2].map((i) => (
                <div key={i} className="border-t border-zinc-800/30 w-full" />
              ))}
            </div>

            <svg
              width="100%"
              height={chartHeight + 70}
              viewBox={`0 0 ${chartWidth} ${chartHeight + 70}`}
              preserveAspectRatio="xMidYMid meet"
              className="overflow-visible"
            >
              {/* Bars for DPS */}
              {dividend.history.map((dps, i) => {
                const barHeight = (dps / maxDPS) * (chartHeight - 30)
                const x = chartPadding + i * (barWidth + barGap)
                const y = chartHeight - barHeight
                return (
                  <rect
                    key={`bar-${i}`}
                    x={x}
                    y={y}
                    width={barWidth}
                    height={barHeight}
                    fill="#2E6BE6"
                    rx={4}
                    ry={4}
                    opacity={0.9}
                  />
                )
              })}

              {/* Line for Yield */}
              <polyline
                points={dividend.yieldHistory.map((yld, i) => {
                  const x = chartPadding + i * (barWidth + barGap) + barWidth / 2
                  const y = chartHeight - (yld / maxYield) * (chartHeight - 40) - 15
                  return `${x},${y}`
                }).join(' ')}
                fill="none"
                stroke="#f59e0b"
                strokeWidth={2.5}
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Data Points for Yield */}
              {dividend.yieldHistory.map((yld, i) => {
                const x = chartPadding + i * (barWidth + barGap) + barWidth / 2
                const y = chartHeight - (yld / maxYield) * (chartHeight - 40) - 15
                return (
                  <circle
                    key={`point-${i}`}
                    cx={x}
                    cy={y}
                    r={5}
                    fill="#f59e0b"
                    stroke="#18181b"
                    strokeWidth={2}
                  />
                )
              })}

              {/* Year Labels - More padding */}
              {dividend.historyYears.map((year, i) => {
                const x = chartPadding + i * (barWidth + barGap) + barWidth / 2
                return (
                  <text
                    key={`year-${i}`}
                    x={x}
                    y={chartHeight + 22}
                    textAnchor="middle"
                    fill="#71717a"
                    fontSize={11}
                    fontWeight="bold"
                  >
                    {year}
                  </text>
                )
              })}

              {/* DPS Values */}
              {dividend.history.map((dps, i) => {
                const x = chartPadding + i * (barWidth + barGap) + barWidth / 2
                return (
                  <text
                    key={`dps-${i}`}
                    x={x}
                    y={chartHeight + 40}
                    textAnchor="middle"
                    fill="#2E6BE6"
                    fontSize={10}
                    fontWeight="bold"
                  >
                    {dps.toFixed(2)}
                  </text>
                )
              })}

              {/* Yield Values */}
              {dividend.yieldHistory.map((yld, i) => {
                const x = chartPadding + i * (barWidth + barGap) + barWidth / 2
                return (
                  <text
                    key={`yield-${i}`}
                    x={x}
                    y={chartHeight + 56}
                    textAnchor="middle"
                    fill="#f59e0b"
                    fontSize={10}
                    fontWeight="bold"
                  >
                    {yld.toFixed(2)}%
                  </text>
                )
              })}
            </svg>
          </div>
        </div>
      </div>

      {/* Dividend Record Card - Improved spacing */}
      <div className="px-5 pb-8">
        <div className="bg-zinc-900/40 rounded-2xl p-6 border border-zinc-800/30">
          <h3 className="text-[11px] font-black uppercase tracking-widest text-zinc-400 mb-5">Dividend Record</h3>
          
          {/* Latest Payout */}
          <div className="mb-6 pb-5 border-b border-zinc-800/50">
            <span className="text-lg font-black text-white">
              1 Share = {dividend.latestDPS.toFixed(2)} {dividend.currency}
            </span>
          </div>

          {/* Date Records - Increased spacing */}
          <div className="space-y-5">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-600">Record Date</span>
              <span className="text-sm font-bold text-white tabular-nums">{dividend.recordDate}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-600">Ex-Dividend Date</span>
              <span className="text-sm font-bold text-white tabular-nums">{dividend.exDivDate}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-600">Payout Date</span>
              <span className="text-sm font-bold text-white tabular-nums">{dividend.paymentDate}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-600">Announcement Date</span>
              <span className="text-sm font-bold text-white tabular-nums">{dividend.announcementDate}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Footer */}
      <div className="fixed bottom-16 left-0 right-0 bg-black/95 backdrop-blur-md border-t border-zinc-900 z-50 max-w-[430px] mx-auto">
        <div className="px-5 py-4">
          <div className="flex gap-3">
            <button 
              onClick={() => setOrderDrawer({ isOpen: true, type: 'buy' })}
              className="flex-1 bg-[#F04438] text-white py-4 rounded-xl font-black text-xs uppercase tracking-widest shadow-xl shadow-[#F04438]/20 active:scale-95"
            >
              Buy
            </button>
            <button 
              onClick={() => setOrderDrawer({ isOpen: true, type: 'sell' })}
              className="flex-1 bg-[#2E6BE6] text-white py-4 rounded-xl font-black text-xs uppercase tracking-widest shadow-xl shadow-[#2E6BE6]/20 active:scale-95"
            >
              Sell
            </button>
          </div>
        </div>
      </div>

      {/* Order Drawer */}
      {orderDrawer.isOpen && (
        <OrderDrawer
          stock={dividend}
          type={orderDrawer.type}
          onClose={() => setOrderDrawer({ isOpen: false, type: 'buy' })}
          onSubmit={(order) => {
            onOrderSubmit?.(order)
          }}
          onNavigateToTrade={onNavigateToTrade}
          availableBalance={availableBalance}
        />
      )}
    </div>
  )
}
