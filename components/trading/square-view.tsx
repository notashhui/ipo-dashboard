'use client'

import { useState, useEffect } from 'react'
import { Search, Bell, Award, Target, Calendar, BarChart3, Clock, BellRing, Layers, TrendingUp, Send, ArrowUpRight, MessageCircle } from 'lucide-react'
import type { ViewType, Stock } from '@/lib/types'
import { GlobalNewsCenter, type NewsItem } from './global-news-center'

interface SquareViewProps {
  onNavigate: (view: ViewType) => void
  onNewsSelect?: (news: NewsItem) => void
}

const marketIndices = [
  { name: 'NASDAQ', value: '18,987.47', change: '+120.30', percent: '+0.64%', isUp: true },
  { name: 'HANG SENG', value: '19,420.15', change: '-156.40', percent: '-0.80%', isUp: false },
  { name: 'DOW JONES', value: '43,870.20', change: '+54.10', percent: '+0.12%', isUp: true },
]

// Color mapping: Tailwind class -> hex color
const colorMap: Record<string, string> = {
  'bg-amber-500': '#f59e0b',
  'bg-blue-500': '#3b82f6',
  'bg-purple-500': '#a855f7',
  'bg-yellow-500': '#eab308',
  'bg-emerald-500': '#10b981',
  'bg-rose-500': '#f43f5e',
  'bg-teal-500': '#14b8a6',
  'bg-sky-500': '#0ea5e9',
}

const moduleIcons = [
  { id: 'ipo' as ViewType, label: 'IPO Center', icon: Award, bgColor: 'bg-amber-500' },
  { id: 'market-temp' as ViewType, label: 'Themes', icon: Target, bgColor: 'bg-blue-500' },
  { id: 'earnings' as ViewType, label: 'Earnings', icon: Calendar, bgColor: 'bg-purple-500' },
  { id: 'dividend' as ViewType, label: 'Dividends', icon: BarChart3, bgColor: 'bg-yellow-500' },
  { id: 'fund-holdings' as ViewType, label: 'Institutions', icon: Clock, bgColor: 'bg-emerald-500' },
  { id: 'signals' as ViewType, label: 'Smart Scan', icon: BellRing, bgColor: 'bg-rose-500' },
  { id: 'rankings' as ViewType, label: 'Top Lists', icon: Layers, bgColor: 'bg-teal-500' },
  { id: 'industry-chain' as ViewType, label: 'Chain', icon: TrendingUp, bgColor: 'bg-sky-500' },
]



export function SquareView({ onNavigate, onNewsSelect }: SquareViewProps) {
  const [aiPrompt, setAiPrompt] = useState('')
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  return (
    <div className="min-h-screen bg-black text-white pb-24">
      {/* Header */}
      <header className="px-4 pt-4 pb-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 overflow-hidden">
              <img
                src="/images/avatar.jpg"
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-black" />
          </div>
          <div>
            <p className="text-sm text-zinc-400">Good Morning</p>
            <p className="text-base font-bold italic">JELLY</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-zinc-900 rounded-full transition-colors">
            <Search size={22} className="text-zinc-300" />
          </button>
          <button className="p-2 hover:bg-zinc-900 rounded-full transition-colors relative">
            <Bell size={22} className="text-zinc-300" />
            <div className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border border-black" />
          </button>
        </div>
      </header>

      {/* Divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-zinc-800 to-transparent mx-4" />

      {/* Market Indices - Horizontal Scroll */}
      <div className="px-4 py-5">
        <div className="flex gap-3 overflow-x-auto no-scrollbar">
          {marketIndices.map((index) => (
            <div
              key={index.name}
              className="flex-shrink-0 w-[160px] bg-zinc-900/60 rounded-2xl p-4 border border-zinc-800/50"
            >
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">
                {index.name}
              </p>
              <p className={`text-xl font-black tabular-nums ${index.isUp ? 'text-emerald-400' : 'text-red-500'}`}>
                {index.value}
              </p>
              <p className={`text-xs font-semibold tabular-nums mt-1 ${index.isUp ? 'text-emerald-400' : 'text-red-500'}`}>
                {index.change} {index.percent}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Icon Grid 4x2 */}
      <div className="px-4 pb-6">
        <div className="grid grid-cols-4 gap-y-6">
          {moduleIcons.map((module) => {
            const Icon = module.icon
            const bgColorHex = colorMap[module.bgColor] || '#3b82f6'
            const iconColorClass = module.bgColor.replace('bg-', 'text-').replace('-500', '-400')
            
            if (!isMounted) {
              return (
                <button
                  key={module.id}
                  className="flex flex-col items-center gap-2"
                  disabled
                >
                  <div className="w-14 h-14 rounded-full bg-zinc-800 flex items-center justify-center" />
                  <span className="text-[11px] text-zinc-400 font-medium text-center leading-tight">
                    {module.label}
                  </span>
                </button>
              )
            }

            return (
              <button
                key={module.id}
                onClick={() => onNavigate(module.id)}
                className="flex flex-col items-center gap-2 active:scale-95 transition-transform"
              >
                <div className="relative w-14 h-14 flex items-center justify-center">
                  {/* Layer 1: Background container with 20% opacity */}
                  <div 
                    className="absolute inset-0 rounded-full" 
                    style={{ backgroundColor: bgColorHex, opacity: 0.2 }} 
                  />
                  
                  {/* Layer 2: Inner white ring (1px border, 2px inset) */}
                  <div className="absolute inset-[2px] rounded-full border border-white/30 pointer-events-none z-10" />
                  
                  {/* Layer 3: Icon (ensured on top layer) */}
                  <Icon size={24} className={`${iconColorClass} relative z-20`} />
                </div>
                <span className="text-[11px] text-zinc-400 font-medium text-center leading-tight">
                  {module.label}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Global News Center */}
      <GlobalNewsCenter onNewsSelect={onNewsSelect} />

      {/* AI Market Analyst Card */}
      <div className="px-4 pb-6">
        <div className="relative bg-gradient-to-br from-zinc-900 via-zinc-900 to-blue-950/50 rounded-3xl p-5 border border-zinc-800/50 overflow-hidden">
          {/* Gemini Star Icon */}
          <div className="absolute top-4 right-4 opacity-30">
            <svg width="60" height="60" viewBox="0 0 24 24" fill="none" className="text-blue-400">
              <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" fill="currentColor" />
              <circle cx="18" cy="6" r="2" fill="currentColor" opacity="0.5" />
            </svg>
          </div>
          
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 rounded-lg bg-blue-500/20 flex items-center justify-center">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-emerald-400">
                <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" fill="currentColor" />
              </svg>
            </div>
            <h3 className="text-base font-bold text-emerald-400">AI Market Analyst</h3>
          </div>
          
          <p className="text-sm text-zinc-400 mb-4 pr-12">
            Get professional-grade insights powered by Gemini. Ask about stock sentiment, technicals, or earnings.
          </p>
          
          <div className="flex items-center gap-2 bg-zinc-800/50 rounded-full pl-4 pr-2 py-2 border border-zinc-700/50">
            <input
              type="text"
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              placeholder="e.g. Analysis on NVDA 2025 outlook?"
              className="flex-1 bg-transparent text-sm text-white placeholder:text-zinc-500 outline-none"
            />
            <button className="w-9 h-9 rounded-full bg-zinc-700/50 flex items-center justify-center hover:bg-zinc-600/50 transition-colors">
              <Send size={16} className="text-zinc-400" />
            </button>
          </div>
        </div>
      </div>

          </div>
  )
}
