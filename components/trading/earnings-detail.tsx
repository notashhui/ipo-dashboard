'use client'

import { useState } from 'react'
import { ChevronLeft, Heart, Info, ExternalLink, ChevronRight, MessageCircle } from 'lucide-react'
import type { EarningsReport, Stock, Order } from '@/lib/types'
import { OrderDrawer } from './order-drawer'

interface EarningsDetailProps {
  report: EarningsReport
  onBack: () => void
  onOrderSubmit?: (order: Order) => void
  onNavigateToTrade?: () => void
  availableBalance?: number
}

const tabLabels = ['Revenue', 'EBIT', 'EPS']

export function EarningsDetail({ 
  report, 
  onBack, 
  onOrderSubmit, 
  onNavigateToTrade,
  availableBalance = 1284560 
}: EarningsDetailProps) {
  const [activeTab, setActiveTab] = useState<'quote' | 'overview' | 'financials'>('financials')
  const [chartMetric, setChartMetric] = useState<'revenue' | 'ebit' | 'eps'>('revenue')
  const [orderDrawer, setOrderDrawer] = useState<{ isOpen: boolean; type: 'buy' | 'sell' }>({
    isOpen: false,
    type: 'buy'
  })

  const stock: Stock = {
    symbol: report.symbol,
    name: report.name,
    price: report.price,
    change: report.change,
    changePercent: report.changePercent
  }

  const isPositive = report.change >= 0

  // Calculate chart points for the dual-line chart
  const chartWidth = 280
  const chartHeight = 100
  const padding = 20
  const dataPoints = report.historicalData
  const maxValue = Math.max(...dataPoints.flatMap(d => [d.actual, d.forecast])) * 1.1
  const minValue = Math.min(...dataPoints.flatMap(d => [d.actual, d.forecast])) * 0.9

  const getY = (value: number) => {
    return chartHeight - padding - ((value - minValue) / (maxValue - minValue)) * (chartHeight - 2 * padding)
  }

  const getX = (index: number) => {
    return padding + (index / (dataPoints.length - 1)) * (chartWidth - 2 * padding)
  }

  const actualPath = dataPoints.map((d, i) => `${i === 0 ? 'M' : 'L'}${getX(i)},${getY(d.actual)}`).join(' ')
  const forecastPath = dataPoints.map((d, i) => `${i === 0 ? 'M' : 'L'}${getX(i)},${getY(d.forecast)}`).join(' ')

  return (
    <div className="min-h-screen bg-black text-white pb-36">
      {/* Header */}
      <div className="sticky top-0 bg-black/95 backdrop-blur-md z-50 border-b border-zinc-900">
        <div className="flex items-center justify-between px-4 py-3">
          <button onClick={onBack} className="p-2 hover:bg-zinc-900 rounded-full">
            <ChevronLeft size={22} className="text-zinc-400" />
          </button>
          <div className="text-center">
            <h1 className="text-sm font-black">{report.symbol} {report.name}</h1>
            <p className={`text-xs font-bold ${isPositive ? 'text-[#10b981]' : 'text-[#F04438]'}`}>
              {report.reportTime === 'after-hours' ? 'After Hours' : 'Pre-Market'} {report.price.toFixed(3)} {isPositive ? '+' : ''}{report.change.toFixed(3)} ({isPositive ? '+' : ''}{report.changePercent.toFixed(2)}%)
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-zinc-900 rounded-full">
              <Heart size={20} className="text-[#F04438] fill-[#F04438]" />
            </button>
            <span className="text-[10px] text-zinc-500">32k</span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center gap-8 px-4 pb-3">
          {['Quote', 'Overview', 'Financials'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab.toLowerCase() as 'quote' | 'overview' | 'financials')}
              className={`text-sm font-bold pb-2 border-b-2 transition-all ${
                activeTab === tab.toLowerCase()
                  ? 'text-white border-white'
                  : 'text-zinc-600 border-transparent'
              }`}
            >
              {tab === 'Financials' ? <span className="font-black">{tab}</span> : tab}
            </button>
          ))}
        </div>
      </div>

      {/* Summary Card */}
      <div className="px-4 py-4">
        <div className="bg-zinc-900/40 rounded-2xl p-4 border border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 flex items-center justify-center">
              <div className="w-5 h-5 rounded bg-blue-500" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-white">Quick Read: {report.reportPeriod} Report</p>
              <p className="text-xs text-zinc-500">Fast insights into {report.name} financials</p>
            </div>
            <ChevronRight size={18} className="text-zinc-600" />
          </div>
        </div>
      </div>

      {/* Currency & Period Selector */}
      <div className="px-4 py-2 flex items-center justify-between">
        <p className="text-xs text-zinc-500">Currency: <span className="text-white font-bold">{report.currency}</span></p>
        <button className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-zinc-800 text-xs font-bold">
          Quarterly <ChevronRight size={14} className="text-zinc-500 rotate-90" />
        </button>
      </div>

      {/* Report Title */}
      <div className="px-4 py-4">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-black text-white">{report.reportPeriod} Report</h2>
          <button className="p-1 hover:bg-zinc-900 rounded-full">
            <Info size={14} className="text-zinc-600" />
          </button>
          <button className="p-1 hover:bg-zinc-900 rounded-full">
            <ExternalLink size={14} className="text-zinc-600" />
          </button>
          <div className="flex-1" />
          <button className="text-xs text-zinc-500 flex items-center gap-1">
            More <ChevronRight size={14} />
          </button>
        </div>
        <p className="text-[10px] text-zinc-600 uppercase tracking-widest mt-1">
          Report Period: {report.dateRange}
        </p>
      </div>

      {/* Summary Text */}
      <div className="px-4 pb-4">
        <p className="text-xs text-zinc-400 leading-relaxed">{report.summary}</p>
      </div>

      {/* Comparison Table */}
      <div className="px-4 py-4">
        <div className="bg-zinc-900/40 rounded-2xl border border-zinc-800 overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-3 gap-2 px-4 py-3 border-b border-zinc-800">
            <div />
            <div className="text-center">
              <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Actual</p>
              <p className="text-[9px] text-zinc-600">YoY</p>
            </div>
            <div className="text-center">
              <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Forecast</p>
              <p className="text-[9px] text-zinc-600">YoY</p>
            </div>
          </div>

          {/* Revenue Row */}
          <div className="grid grid-cols-3 gap-2 px-4 py-4 border-b border-zinc-800">
            <div>
              <p className="text-sm font-black text-white">Revenue</p>
              <p className={`text-[10px] font-bold ${report.financials.revenue.status === 'beat' ? 'text-[#F04438]' : 'text-blue-400'}`}>
                {report.financials.revenue.status === 'beat' ? 'Beat' : 'Miss'}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm font-black text-white">{report.financials.revenue.actual}</p>
              <p className={`text-xs font-bold ${report.financials.revenue.actualChange >= 0 ? 'text-[#F04438]' : 'text-blue-400'}`}>
                +{report.financials.revenue.actualChange.toFixed(2)}%
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm font-black text-white">{report.financials.revenue.forecast}</p>
              <p className={`text-xs font-bold ${report.financials.revenue.forecastChange >= 0 ? 'text-[#F04438]' : 'text-blue-400'}`}>
                +{report.financials.revenue.forecastChange.toFixed(2)}%
              </p>
            </div>
          </div>

          {/* EBIT Row */}
          <div className="grid grid-cols-3 gap-2 px-4 py-4 border-b border-zinc-800">
            <div>
              <p className="text-sm font-black text-white">EBIT</p>
              <p className={`text-[10px] font-bold ${report.financials.ebit.status === 'beat' ? 'text-[#F04438]' : 'text-blue-400'}`}>
                {report.financials.ebit.status === 'beat' ? 'Beat' : 'Miss'}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm font-black text-white">{report.financials.ebit.actual}</p>
              <p className={`text-xs font-bold ${report.financials.ebit.actualChange >= 0 ? 'text-[#F04438]' : 'text-blue-400'}`}>
                +{report.financials.ebit.actualChange.toFixed(2)}%
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm font-black text-white">{report.financials.ebit.forecast}</p>
              <p className={`text-xs font-bold ${report.financials.ebit.forecastChange >= 0 ? 'text-[#F04438]' : 'text-blue-400'}`}>
                +{report.financials.ebit.forecastChange.toFixed(2)}%
              </p>
            </div>
          </div>

          {/* EPS Row */}
          <div className="grid grid-cols-3 gap-2 px-4 py-4">
            <div>
              <p className="text-sm font-black text-white">EPS</p>
              <p className={`text-[10px] font-bold ${report.financials.eps.status === 'beat' ? 'text-[#F04438]' : 'text-blue-400'}`}>
                {report.financials.eps.status === 'beat' ? 'Beat' : 'Miss'}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm font-black text-white">{report.financials.eps.actual}</p>
              <p className={`text-xs font-bold ${report.financials.eps.actualChange >= 0 ? 'text-[#F04438]' : 'text-blue-400'}`}>
                +{report.financials.eps.actualChange.toFixed(2)}%
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm font-black text-white">{report.financials.eps.forecast}</p>
              <p className={`text-xs font-bold ${report.financials.eps.forecastChange >= 0 ? 'text-[#F04438]' : 'text-blue-400'}`}>
                +{report.financials.eps.forecastChange.toFixed(2)}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Chart Metric Tabs */}
      <div className="px-4 py-2">
        <div className="flex gap-2">
          {(['revenue', 'ebit', 'eps'] as const).map((metric) => (
            <button
              key={metric}
              onClick={() => setChartMetric(metric)}
              className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
                chartMetric === metric
                  ? 'bg-zinc-800 text-white border border-zinc-700'
                  : 'text-zinc-600 border border-zinc-900'
              }`}
            >
              {metric === 'revenue' ? 'Revenue' : metric === 'ebit' ? 'EBIT' : 'EPS'}
            </button>
          ))}
        </div>
      </div>

      {/* Chart Legend */}
      <div className="px-4 py-2 flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-blue-500" />
          <span className="text-[10px] text-zinc-500">Actual</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-0.5 bg-zinc-500" style={{ borderStyle: 'dashed' }} />
          <span className="text-[10px] text-zinc-500">Forecast</span>
        </div>
      </div>

      {/* Dual-Line Chart */}
      <div className="px-4 py-4">
        <div className="bg-zinc-900/40 rounded-2xl p-4 border border-zinc-800">
          <svg className="w-full" viewBox={`0 0 ${chartWidth} ${chartHeight + 30}`}>
            {/* Grid lines */}
            {[0, 1, 2, 3].map((i) => (
              <line
                key={i}
                x1={padding}
                y1={padding + (i * (chartHeight - 2 * padding)) / 3}
                x2={chartWidth - padding}
                y2={padding + (i * (chartHeight - 2 * padding)) / 3}
                stroke="#27272a"
                strokeWidth="1"
              />
            ))}

            {/* Forecast line (dashed) */}
            <path
              d={forecastPath}
              fill="none"
              stroke="#71717a"
              strokeWidth="2"
              strokeDasharray="4 4"
            />

            {/* Actual line (solid) */}
            <path
              d={actualPath}
              fill="none"
              stroke="#2E6BE6"
              strokeWidth="2"
            />

            {/* Data points for actual */}
            {dataPoints.map((d, i) => (
              <g key={i}>
                <circle
                  cx={getX(i)}
                  cy={getY(d.actual)}
                  r="4"
                  fill="#2E6BE6"
                />
                {/* Value label */}
                <text
                  x={getX(i)}
                  y={getY(d.actual) - 10}
                  textAnchor="middle"
                  className="fill-blue-400 text-[8px] font-bold"
                >
                  {d.actual >= 100 ? `${(d.actual / 100).toFixed(2)}B` : `${d.actual}M`}
                </text>
                {/* Quarter label */}
                <text
                  x={getX(i)}
                  y={chartHeight + 15}
                  textAnchor="middle"
                  className="fill-zinc-600 text-[8px]"
                >
                  {d.quarter}
                </text>
              </g>
            ))}

            {/* Forecast dots */}
            {dataPoints.map((d, i) => (
              <circle
                key={`forecast-${i}`}
                cx={getX(i)}
                cy={getY(d.forecast)}
                r="3"
                fill="#71717a"
              />
            ))}
          </svg>
        </div>
      </div>

      {/* Sticky Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-black border-t border-zinc-900 z-50 max-w-[430px] mx-auto">
        {/* Footer Tabs */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-900">
          <div className="flex items-center gap-4">
            <button className="text-xs font-bold text-white flex items-center gap-1">
              News <span className="w-1.5 h-1.5 rounded-full bg-[#F04438]" />
            </button>
            <button className="text-xs font-bold text-zinc-600 flex items-center gap-1">
              Discussion <span className="w-1.5 h-1.5 rounded-full bg-[#F04438]" />
            </button>
            <button className="text-xs font-bold text-zinc-600 flex items-center gap-1">
              Announcements <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            </button>
          </div>
          <button className="w-8 h-8 rounded-full bg-zinc-900 flex items-center justify-center">
            <MessageCircle size={16} className="text-zinc-500" />
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 px-4 py-3 pb-8">
          <button className="p-3 rounded-xl bg-zinc-900 hover:bg-zinc-800">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-zinc-400">
              <rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2" />
              <rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2" />
              <rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2" />
              <rect x="14" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2" />
            </svg>
          </button>
          <button className="p-3 rounded-xl bg-zinc-900 hover:bg-zinc-800">
            <ExternalLink size={20} className="text-zinc-400" />
          </button>
          <button className="p-3 rounded-xl bg-zinc-900 hover:bg-zinc-800">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-zinc-400">
              <rect x="4" y="4" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="2" />
              <path d="M4 9H20" stroke="currentColor" strokeWidth="2" />
            </svg>
          </button>
          <div className="flex-1 flex gap-2">
            <button 
              onClick={() => setOrderDrawer({ isOpen: true, type: 'buy' })}
              className="flex-1 bg-[#10b981] text-white py-3.5 rounded-xl font-black text-xs uppercase tracking-widest"
            >
              Buy
            </button>
            <button 
              onClick={() => setOrderDrawer({ isOpen: true, type: 'sell' })}
              className="flex-1 bg-[#F04438] text-white py-3.5 rounded-xl font-black text-xs uppercase tracking-widest"
            >
              Sell
            </button>
          </div>
        </div>
      </div>

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
  )
}
