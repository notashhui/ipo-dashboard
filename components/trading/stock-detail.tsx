'use client'

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { ChevronLeft, Star, Share2, TrendingUp, Clock, LayoutGrid, PieChart, Activity } from 'lucide-react'
import type { Stock, StockMetrics, CapitalFlow, Order } from '@/lib/types'
import { mockStockMetrics, mockCapitalFlow } from '@/lib/mock-data'
import { OrderDrawer } from './order-drawer'

interface StockDetailProps {
  stock: Stock
  badge?: string
  badgeColor?: string
  onBack: () => void
  onOrderSubmit?: (order: Order) => void
  onNavigateToTrade?: () => void
  availableBalance?: number
}

const intervals = ['Intraday', '5D', 'Daily', 'Weekly', 'Monthly', 'Yearly', '1Min']
const tabs = ['Quote', 'Overview', 'Financials']

export function StockDetail({ 
  stock, 
  badge, 
  badgeColor = 'from-blue-600 to-purple-600', 
  onBack,
  onOrderSubmit,
  onNavigateToTrade,
  availableBalance = 1284560
}: StockDetailProps) {
  const [activeInterval, setActiveInterval] = useState('Daily')
  const [activeTab, setActiveTab] = useState('Quote')
  const [mounted, setMounted] = useState(false)
  const [orderDrawer, setOrderDrawer] = useState<{ isOpen: boolean; type: 'buy' | 'sell' }>({
    isOpen: false,
    type: 'buy'
  })

  useEffect(() => {
    setMounted(true)
  }, [])
  
  const metrics = mockStockMetrics
  const capitalFlow = mockCapitalFlow
  
  const isPositive = stock.changePercent >= 0
  const priceColor = isPositive ? 'text-[#F04438]' : 'text-[#2E6BE6]'

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-[428px] mx-auto" style={{ paddingBottom: 'calc(5rem + env(safe-area-inset-bottom, 0px))' }}>
        {/* Top Navigation */}
        <div className="sticky top-0 bg-black/95 backdrop-blur-md z-50 flex items-center justify-between px-4 py-3 border-b border-zinc-900/50">
        <button onClick={onBack} className="p-2 hover:bg-zinc-900 rounded-full">
          <ChevronLeft size={22} className="text-zinc-400" />
        </button>
        
        <div className="flex-1 text-center">
          <div className="flex items-center justify-center gap-2">
            <h2 className="font-black text-xs tracking-tight uppercase italic">{stock.symbol} {stock.name}</h2>
            {badge && (
              <div className={`px-3 py-1.5 rounded-full bg-gradient-to-r ${badgeColor}`}>
                <span className="text-[9px] font-black uppercase tracking-widest">{badge}</span>
              </div>
            )}
          </div>
          <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest mt-1">
            Real-time Quote
          </p>
        </div>
        
        <div className="flex gap-2">
          <button className="p-2 hover:bg-zinc-900 rounded-full">
            <Star size={18} className="text-zinc-400" />
          </button>
          <button className="p-2 hover:bg-zinc-900 rounded-full">
            <Share2 size={18} className="text-zinc-400" />
          </button>
        </div>
      </div>

      {/* Price Display */}
      <div className="px-4 py-6 border-b border-zinc-900/50">
        <div className="flex items-end gap-4 mb-2">
          <span className="text-5xl font-black tabular-nums tracking-tighter">{stock.price.toFixed(3)}</span>
          <div className="flex items-center gap-2 pb-2">
            <TrendingUp size={20} className={priceColor} />
            <span className={`text-lg font-black tabular-nums ${priceColor}`}>
              {isPositive ? '+' : ''}{stock.change.toFixed(3)}
            </span>
            <span className={`text-sm font-bold ${priceColor}`}>
              ({isPositive ? '+' : ''}{stock.changePercent.toFixed(2)}%)
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 text-zinc-600 text-[9px] font-bold uppercase tracking-widest">
          <Clock size={10} />
          <span>Real-time Quote</span>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-zinc-900/50 px-4">
        {tabs.map(tab => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-4 text-xs font-black uppercase tracking-[0.3em] border-b-2 ${
              activeTab === tab 
                ? 'text-white border-white' 
                : 'text-zinc-600 border-transparent'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* 4x6 Data Matrix (24 Metrics) */}
      <div className="px-4 py-6 border-b border-zinc-900/50 bg-zinc-950/20">
        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600 mb-6 px-1">Key Metrics</h3>
        
        <div className="grid grid-cols-4 gap-x-4 gap-y-6">
          {/* Row 1: Price */}
          <MetricItem label="High" value={metrics.high.toFixed(3)} highlight />
          <MetricItem label="Low" value={metrics.low.toFixed(3)} highlight />
          <MetricItem label="Open" value={metrics.open.toFixed(3)} highlight />
          <MetricItem label="Prev Close" value={metrics.prevClose.toFixed(3)} />
          
          {/* Row 2: Volume */}
          <MetricItem label="Volume" value={metrics.volume} />
          <MetricItem label="Turnover" value={metrics.turnover} />
          <MetricItem label="PE(TTM)" value={metrics.peTTM.toFixed(2)} />
          <MetricItem label="PE(Static)" value={metrics.peStatic.toFixed(2)} />
          
          {/* Row 3: Market Cap */}
          <MetricItem label="Mkt Cap" value={metrics.marketCap} />
          <MetricItem label="Shares" value={metrics.totalShares} />
          <MetricItem label="Turnover Rate" value={metrics.turnoverRate} />
          <MetricItem label="P/B Ratio" value={metrics.pbRatio.toFixed(2)} />
          
          {/* Row 4: 52 Week */}
          <MetricItem label="52W High" value={`$${metrics.high52w}`} />
          <MetricItem label="52W Low" value={`$${metrics.low52w}`} />
          <MetricItem label="Bid Ratio" value={metrics.bidRatio} />
          <MetricItem label="Vol Ratio" value={metrics.volRatio.toFixed(2)} />
          
          {/* Row 5: Technical */}
          <MetricItem label="Amplitude" value={metrics.amplitude} />
          <MetricItem label="ATH" value={`$${metrics.allTimeHigh}`} />
          <MetricItem label="ATL" value={`$${metrics.allTimeLow}`} />
          <MetricItem label="Avg Price" value={metrics.avgPrice.toFixed(3)} />
          
          {/* Row 6: Dividend & Risk */}
          <MetricItem label="Div(TTM)" value={metrics.divTTM.toFixed(2)} />
          <MetricItem label="Div(LFY)" value={metrics.divLFY.toFixed(2)} />
          <MetricItem label="Lot Size" value={metrics.lotSize.toString()} />
          <MetricItem label="Beta" value={metrics.beta.toFixed(2)} />
        </div>
      </div>

      {/* K-Line Chart Area */}
      <div className="px-4 py-8">
        <div className="flex gap-2 overflow-x-auto no-scrollbar mb-6">
          {intervals.map(interval => (
            <button 
              key={interval}
              onClick={() => setActiveInterval(interval)}
              className={`px-5 py-2.5 rounded-full border text-[10px] font-black uppercase tracking-widest whitespace-nowrap ${
                activeInterval === interval 
                  ? 'bg-white text-black border-white' 
                  : 'border-zinc-900 hover:border-zinc-700'
              }`}
            >
              {interval}
            </button>
          ))}
        </div>

        {/* SVG Candlestick Chart */}
        <div className="relative min-h-[200px]">
          <svg className="w-full h-56" viewBox="0 0 400 150">
            <line x1="0" y1="50" x2="400" y2="50" stroke="#18181b" strokeWidth="0.5" />
            <line x1="0" y1="100" x2="400" y2="100" stroke="#18181b" strokeWidth="0.5" strokeDasharray="4 4" />
            
            {Array.from({ length: 24 }).map((_, i) => {
              const seed = i * 7 + 13
              const height = 15 + (seed % 50)
              const y = 90 - height
              const isUp = seed % 3 !== 0
              const color = isUp ? '#F04438' : '#2E6BE6'
              
              return (
                <g key={i}>
                  <line x1={15 + i * 16} y1={y - 5} x2={15 + i * 16} y2={y + height + 5} stroke={color} strokeWidth="1" />
                  <rect 
                    x={11 + i * 16} 
                    y={y} 
                    width="8" 
                    height={height} 
                    fill={isUp ? 'transparent' : color} 
                    stroke={color} 
                    strokeWidth="1.5" 
                  />
                </g>
              )
            })}
          </svg>
        </div>
      </div>

      {/* 270° Arc Chart (Capital Flow) */}
      <div className="px-4 py-6">
        <div className="bg-[#0a0a0a] rounded-3xl p-6 border border-zinc-900 shadow-xl">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-500">Capital Flow Distribution</h3>
            <LayoutGrid size={14} className="text-zinc-700" />
          </div>

          <div className="flex flex-col items-center">
            <CapitalFlowArc capitalFlow={capitalFlow} />

            {/* Comparison Bar */}
            <div className="w-full mt-10 space-y-5">
              <div className="flex justify-between items-end mb-1">
                <div className="flex flex-col">
                  <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest mb-1">Total Inflow</span>
                  <span className="text-sm font-black text-[#10b981]">{capitalFlow.totalInflow.toLocaleString()}</span>
                </div>
                <div className="flex flex-col text-right">
                  <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest mb-1">Total Outflow</span>
                  <span className="text-sm font-black text-[#F04438]">{capitalFlow.totalOutflow.toLocaleString()}</span>
                </div>
              </div>
              
              <div className="h-1.5 w-full bg-zinc-900 rounded-full flex overflow-hidden">
                <div className="bg-[#10b981] h-full" style={{ width: `${(capitalFlow.totalInflow / (capitalFlow.totalInflow + capitalFlow.totalOutflow)) * 100}%` }} />
                <div className="bg-[#F04438] h-full" style={{ width: `${(capitalFlow.totalOutflow / (capitalFlow.totalInflow + capitalFlow.totalOutflow)) * 100}%` }} />
              </div>

              {/* Large & Mid Order Breakdown */}
              <div className="grid grid-cols-2 gap-x-10 gap-y-4 pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-[9px] font-bold text-zinc-700 uppercase">Large Order In</span>
                  <span className="text-[10px] font-black tabular-nums text-[#10b981]">{capitalFlow.largeInflow.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[9px] font-bold text-zinc-700 uppercase">Large Order Out</span>
                  <span className="text-[10px] font-black tabular-nums text-[#F04438]">{capitalFlow.largeOutflow.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[9px] font-bold text-zinc-700 uppercase">Mid Order In</span>
                  <span className="text-[10px] font-black tabular-nums text-zinc-500">{capitalFlow.midInflow.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[9px] font-bold text-zinc-700 uppercase">Mid Order Out</span>
                  <span className="text-[10px] font-black tabular-nums text-zinc-500">{capitalFlow.midOutflow.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fixed Bottom Trading Bar */}
      {mounted &&
        createPortal(
          <div className="fixed bottom-0 w-full z-[9999]">
            <div
              className="max-w-[428px] mx-auto px-4 py-3 bg-black border-t border-zinc-900 shadow-[0_-20px_50px_rgba(0,0,0,1)] flex items-center gap-3"
              style={{
                paddingBottom: 'env(safe-area-inset-bottom, 0.75rem)',
              }}
            >
              <div className="flex shrink-0 gap-4 border-r border-zinc-900 pr-4">
                <div className="flex flex-col items-center gap-1 cursor-pointer group min-w-0">
                  <LayoutGrid size={16} className="shrink-0 text-zinc-600 group-hover:text-white" />
                  <span className="text-[7px] font-black uppercase tracking-widest text-zinc-600 truncate">More</span>
                </div>
                <div className="flex flex-col items-center gap-1 cursor-pointer group min-w-0">
                  <PieChart size={16} className="shrink-0 text-zinc-600 group-hover:text-white" />
                  <span className="text-[7px] font-black uppercase tracking-widest text-zinc-600 truncate">Options</span>
                </div>
              </div>

              <div className="flex min-w-0 flex-1 gap-2">
                <button
                  onClick={() => setOrderDrawer({ isOpen: true, type: 'buy' })}
                  className="min-w-0 flex-1 bg-[#F04438] py-3.5 rounded-[2px] font-black text-xs uppercase tracking-[0.3em] text-white shadow-xl shadow-[#F04438]/20 active:scale-95"
                >
                  Buy
                </button>
                <button
                  onClick={() => setOrderDrawer({ isOpen: true, type: 'sell' })}
                  className="min-w-0 flex-1 bg-[#2E6BE6] py-3.5 rounded-[2px] font-black text-xs uppercase tracking-[0.3em] text-white shadow-xl shadow-[#2E6BE6]/20 active:scale-95"
                >
                  Sell
                </button>
              </div>

              <div className="absolute -top-12 right-4 hidden w-10 h-10 bg-white rounded-full items-center justify-center shadow-2xl shadow-blue-500/20 cursor-pointer hover:scale-110 active:scale-90 border-2 border-black sm:flex">
                <Activity size={20} className="text-black" />
                <div className="absolute top-0 right-0 w-2.5 h-2.5 bg-[#F04438] border-2 border-black rounded-full animate-pulse" />
              </div>
            </div>
          </div>,
          document.body
        )}

      {/* Order Drawer */}
      {orderDrawer.isOpen && (
        <OrderDrawer
          stock={stock}
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
    </div>
  )
}

function MetricItem({ label, value, highlight = false }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex flex-col">
      <span className="text-[8px] font-bold text-zinc-700 uppercase tracking-widest mb-1.5">{label}</span>
      <span className={`text-sm font-black tabular-nums ${highlight ? 'text-[#F04438]' : 'text-white'}`}>{value}</span>
    </div>
  )
}

function CapitalFlowArc({ capitalFlow }: { capitalFlow: CapitalFlow }) {
  const total = capitalFlow.totalInflow + capitalFlow.totalOutflow
  const inflowPercent = capitalFlow.totalInflow / total
  const outflowPercent = capitalFlow.totalOutflow / total
  
  // 270 degrees = 3/4 of circle
  // circumference of circle with r=42 is 2*PI*42 = 263.89
  const fullArc = 263.89 * 0.75 // 197.92 for 270 degrees
  const inflowArc = fullArc * inflowPercent
  const outflowArc = fullArc * outflowPercent
  
  const isNetOutflow = capitalFlow.netInflow < 0
  
  return (
    <div className="relative w-52 h-52">
      <svg className="w-full h-full transform -rotate-[135deg]" viewBox="0 0 100 100">
        {/* Background arc (270 degrees) */}
        <circle 
          cx="50" 
          cy="50" 
          r="42" 
          fill="none" 
          stroke="#18181b" 
          strokeWidth="8" 
          strokeDasharray={`${fullArc} 263.89`}
          strokeLinecap="round"
        />
        
        {/* Inflow arc (green) */}
        <circle 
          cx="50" 
          cy="50" 
          r="42" 
          fill="none" 
          stroke="#10b981" 
          strokeWidth="8" 
          strokeDasharray={`${inflowArc} 263.89`}
          strokeDashoffset="0"
          strokeLinecap="round"
        />
        
        {/* Outflow arc (red) */}
        <circle 
          cx="50" 
          cy="50" 
          r="42" 
          fill="none" 
          stroke="#F04438" 
          strokeWidth="8" 
          strokeDasharray={`${outflowArc} 263.89`}
          strokeDashoffset={`-${inflowArc}`}
          strokeLinecap="round"
        />
      </svg>

      {/* Center Value */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="text-zinc-600 text-[9px] font-black uppercase tracking-widest">
          {isNetOutflow ? 'Net Outflow' : 'Net Inflow'}
        </span>
        <span className={`font-black text-2xl tabular-nums tracking-tighter mt-1 ${isNetOutflow ? 'text-[#F04438]' : 'text-[#10b981]'}`}>
          {Math.abs(capitalFlow.netInflow).toLocaleString()}
        </span>
        <span className="text-zinc-700 text-[8px] font-bold uppercase mt-1">USD (10k)</span>
      </div>
    </div>
  )
}
