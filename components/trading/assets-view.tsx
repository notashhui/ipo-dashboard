'use client'

import { Eye, EyeOff, Download, Upload, ArrowLeftRight, FileText, TrendingUp, ChevronRight, SlidersHorizontal, Landmark, Wallet, Percent } from 'lucide-react'
import { useState } from 'react'
import type { Holding, Order } from '@/lib/types'

interface AssetsViewProps {
  holdings: Holding[]
  cashBalance: number
  onStockSelect?: (symbol: string) => void
}

export function AssetsView({ holdings, cashBalance, onStockSelect }: AssetsViewProps) {
  const [showBalance, setShowBalance] = useState(true)

  // Calculate totals
  const securitiesValue = holdings.reduce((sum, h) => sum + h.marketValue, 0)
  const earnValue = 187330.23 // Fixed earn/yield value
  const totalValuation = securitiesValue + cashBalance + earnValue
  const dayPL = holdings.reduce((sum, h) => sum + h.unrealizedPL, 0)
  const dayPLPercent = totalValuation > 0 ? (dayPL / totalValuation) * 100 : 0

  // Mini area chart path for valuation
  const chartPath = "M0,40 L15,35 L30,38 L45,30 L60,32 L75,25 L90,28 L105,20 L120,22 L135,15 L150,18"

  return (
    <div className="min-h-screen bg-black text-white pb-24">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-4 border-b border-zinc-900/50">
        <div className="flex items-center gap-3">
          <div className="relative w-11 h-11 rounded-full overflow-hidden border-2 border-zinc-800">
            <img
              src="/images/avatar.jpg"
              alt="Profile"
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-black" />
          </div>
          <div>
            <p className="text-[10px] font-medium text-zinc-500 uppercase tracking-wider">Good Morning</p>
            <p className="text-sm font-black italic text-white">JELLY</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="w-10 h-10 rounded-full bg-zinc-900/60 flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-zinc-400">
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
          </button>
          <button className="w-10 h-10 rounded-full bg-zinc-900/60 flex items-center justify-center relative">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-zinc-400">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            <div className="absolute top-2 right-2 w-2 h-2 bg-[#F04438] rounded-full" />
          </button>
        </div>
      </header>

      {/* Total Valuation Section */}
      <div className="px-4 py-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">Total Valuation</span>
            <button onClick={() => setShowBalance(!showBalance)}>
              {showBalance ? <Eye size={14} className="text-zinc-600" /> : <EyeOff size={14} className="text-zinc-600" />}
            </button>
          </div>
          {/* Mini Area Chart */}
          <svg width="100" height="40" className="opacity-80">
            <defs>
              <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ec4899" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#ec4899" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d={chartPath} fill="none" stroke="#ec4899" strokeWidth="2" />
            <path d={`${chartPath} L150,40 L0,40 Z`} fill="url(#chartGradient)" />
          </svg>
        </div>

        <div className="flex items-baseline gap-3 mb-2">
          <span className="text-[42px] font-black tabular-nums tracking-tight leading-none">
            {showBalance ? totalValuation.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '****'}
          </span>
          <span className="text-sm font-medium text-zinc-500">USD</span>
        </div>

        <button className="flex items-center gap-1">
          <span className={`text-sm font-bold ${dayPL >= 0 ? 'text-emerald-500' : 'text-[#F04438]'}`}>
            Day P/L {showBalance ? `${dayPL >= 0 ? '+' : ''}${dayPL.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })} (${dayPL >= 0 ? '+' : ''}${dayPLPercent.toFixed(2)}%)` : '****'}
          </span>
          <ChevronRight size={14} className={dayPL >= 0 ? 'text-emerald-500' : 'text-[#F04438]'} />
        </button>
      </div>

      {/* Action Buttons */}
      <div className="px-4 pb-6">
        <div className="flex justify-around">
          {[
            { icon: Download, label: 'Deposit', color: 'bg-teal-500/20', iconColor: 'text-teal-400' },
            { icon: Upload, label: 'Withdraw', color: 'bg-amber-500/20', iconColor: 'text-amber-400' },
            { icon: ArrowLeftRight, label: 'Transfer', color: 'bg-blue-500/20', iconColor: 'text-blue-400' },
            { icon: FileText, label: 'Bills', color: 'bg-zinc-700/40', iconColor: 'text-zinc-400' },
          ].map((action) => (
            <button key={action.label} className="flex flex-col items-center gap-2">
              <div className={`w-14 h-14 rounded-full ${action.color} flex items-center justify-center`}>
                <action.icon size={22} className={action.iconColor} />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">{action.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Earn Banner */}
      <div className="px-4 pb-6">
        <div className="bg-zinc-900/40 rounded-2xl p-4 flex items-center justify-between border border-zinc-800/50">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[#F04438]/10 flex items-center justify-center">
              <TrendingUp size={24} className="text-[#F04438]" />
            </div>
            <div>
              <p className="text-sm font-bold text-white">Earn with Idle Cash</p>
              <p className="text-xs text-zinc-500">YIELD UP TO <span className="text-emerald-400 font-bold">5.51% APY</span></p>
            </div>
          </div>
          <span className="text-xs text-zinc-600 font-medium">2/2</span>
        </div>
      </div>

      {/* Account Distribution */}
      <div className="px-4 pb-4">
        <div className="flex items-center justify-between mb-4">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">Account Distribution</span>
          <ChevronRight size={16} className="text-zinc-600" />
        </div>
        
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-zinc-900/40 rounded-2xl p-4 border border-zinc-800/50">
            <div className="flex items-center gap-2 mb-3">
              <Landmark size={14} className="text-zinc-500" />
              <span className="text-[9px] font-bold uppercase tracking-wider text-zinc-500">Securities</span>
            </div>
            <p className="text-base font-black text-white">
              {showBalance ? `$${securitiesValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '****'}
            </p>
          </div>
          <div className="bg-zinc-900/40 rounded-2xl p-4 border border-zinc-800/50">
            <div className="flex items-center gap-2 mb-3">
              <Wallet size={14} className="text-zinc-500" />
              <span className="text-[9px] font-bold uppercase tracking-wider text-zinc-500">Cash</span>
            </div>
            <p className="text-base font-black text-white">
              {showBalance ? `$${cashBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '****'}
            </p>
          </div>
          <div className="bg-zinc-900/40 rounded-2xl p-4 border border-zinc-800/50">
            <div className="flex items-center gap-2 mb-3">
              <Percent size={14} className="text-zinc-500" />
              <span className="text-[9px] font-bold uppercase tracking-wider text-zinc-500">Earn</span>
            </div>
            <p className="text-base font-black text-white">
              {showBalance ? `$${earnValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '****'}
            </p>
          </div>
        </div>
      </div>

      {/* Holdings List */}
      <div className="px-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-2xl font-black italic text-white">ASSETS</h2>
          <button className="w-9 h-9 rounded-full bg-zinc-900/60 flex items-center justify-center">
            <SlidersHorizontal size={16} className="text-zinc-500" />
          </button>
        </div>

        <div className="flex items-center justify-between mb-4 px-1">
          <span className="text-[9px] font-bold uppercase tracking-[0.15em] text-zinc-600">Name / Qty</span>
          <span className="text-[9px] font-bold uppercase tracking-[0.15em] text-zinc-600">Market Value / P/L</span>
        </div>

        <div className="space-y-3">
          {holdings.length === 0 ? (
            <div className="bg-zinc-900/40 rounded-2xl p-8 border border-zinc-800/50 text-center">
              <p className="text-zinc-500 text-sm">No holdings yet</p>
              <p className="text-zinc-600 text-xs mt-1">Your purchased securities will appear here</p>
            </div>
          ) : (
            holdings.map(holding => (
              <button 
                key={holding.symbol}
                className="w-full bg-zinc-900/40 rounded-2xl p-4 border border-zinc-800/50 flex items-center justify-between hover:border-zinc-700 transition-all"
                onClick={() => onStockSelect?.(holding.symbol)}
              >
                <div className="flex items-center gap-3">
                  <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center text-xs font-black text-white"
                    style={{ backgroundColor: holding.color }}
                  >
                    {holding.symbol.length > 4 ? holding.symbol.slice(0, 4) : holding.symbol}
                  </div>
                  <div className="text-left">
                    <div className="flex items-center gap-2">
                      <span className="text-base font-black text-white">{holding.symbol}</span>
                      <span className="px-1.5 py-0.5 rounded bg-zinc-800 text-[8px] font-bold text-zinc-400">L2</span>
                    </div>
                    <p className="text-[11px] font-medium text-zinc-500 uppercase tracking-wide">{holding.quantity} Shares</p>
                  </div>
                </div>
                <div className="text-right flex items-center gap-3">
                  <div>
                    <p className="text-base font-black text-white">
                      {showBalance ? `$${holding.marketValue.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}` : '****'}
                    </p>
                    <p className={`text-xs font-bold ${holding.unrealizedPL >= 0 ? 'text-emerald-500' : 'text-[#F04438]'}`}>
                      {showBalance ? (
                        <>
                          {holding.unrealizedPL >= 0 ? '+' : ''}${Math.abs(holding.unrealizedPL).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                          <br />
                          <span className="text-[10px]">({holding.unrealizedPL >= 0 ? '+' : ''}{holding.unrealizedPLPercent.toFixed(2)}%)</span>
                        </>
                      ) : '****'}
                    </p>
                  </div>
                  <ChevronRight size={16} className="text-zinc-600" />
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
