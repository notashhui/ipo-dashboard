'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import {
  Search,
  Bell,
  Award,
  Target,
  Calendar,
  BarChart3,
  Clock,
  BellRing,
  Layers,
  TrendingUp,
  Send,
} from 'lucide-react'
import type { ViewType } from '@/lib/types'
import { GlobalNewsCenter, type NewsItem } from './global-news-center'

interface SquareViewProps {
  onNavigate: (view: ViewType) => void
  onNewsSelect?: (news: NewsItem) => void
}

// OLED 纯黑背景，严格避免亮色
const BG_OLED = '#020617'
const GLASS_BG = 'rgba(15, 23, 42, 0.65)'
const GLASS_BORDER = 'rgba(248, 250, 252, 0.08)'

const marketIndices = [
  { name: 'NASDAQ', value: '18,987.47', change: '+120.30', percent: '+0.64%', isUp: true, code: 'NASDAQ' as const },
  { name: 'HANG SENG', value: '19,420.15', change: '-156.40', percent: '-0.80%', isUp: false, code: 'HSI' as const },
  { name: 'DOW JONES', value: '43,870.20', change: '+54.10', percent: '+0.12%', isUp: true, code: 'DJI' as const },
]

const accentHex: Record<string, string> = {
  amber: '#f59e0b',
  blue: '#3b82f6',
  purple: '#a855f7',
  yellow: '#eab308',
  emerald: '#22c55e',
  rose: '#f43f5e',
  teal: '#14b8a6',
  sky: '#0ea5e9',
}

const moduleIcons: { id: ViewType; label: string; icon: typeof Award; accent: keyof typeof accentHex }[] = [
  { id: 'ipo', label: 'IPO Center', icon: Award, accent: 'amber' },
  { id: 'market-temp', label: 'Themes', icon: Target, accent: 'blue' },
  { id: 'earnings', label: 'Earnings', icon: Calendar, accent: 'purple' },
  { id: 'dividend', label: 'Dividends', icon: BarChart3, accent: 'yellow' },
  { id: 'fund-holdings', label: 'Market Pulse', icon: Clock, accent: 'emerald' },
  { id: 'signals', label: 'Smart Scan', icon: BellRing, accent: 'rose' },
  { id: 'rankings', label: 'Top Lists', icon: Layers, accent: 'teal' },
  { id: 'industry-chain', label: 'Chain', icon: TrendingUp, accent: 'sky' },
]

// 玻璃拟态卡片基类：金融级、无亮色
const glassCard =
  'rounded-xl border backdrop-blur-xl transition-transform duration-200 hover:scale-[1.02] cursor-pointer ' +
  'active:scale-[0.99] outline-none focus-visible:ring-2 focus-visible:ring-white/20'

export function SquareView({ onNavigate, onNewsSelect }: SquareViewProps) {
  const router = useRouter()
  const [aiPrompt, setAiPrompt] = useState('')
  const [isMounted, setIsMounted] = useState(false)
  const [journeyIndex, setJourneyIndex] = useState(0)
  const journeyRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Horizontal Scroll Journey：根据滚动位置更新进度
  useEffect(() => {
    const el = journeyRef.current
    if (!el) return
    const onScroll = () => {
      const { scrollLeft, scrollWidth, clientWidth } = el
      const total = scrollWidth - clientWidth
      if (total <= 0) {
        setJourneyIndex(0)
        return
      }
      const i = Math.round((scrollLeft / total) * 1)
      setJourneyIndex(Math.min(i, 1))
    }
    el.addEventListener('scroll', onScroll, { passive: true })
    return () => el.removeEventListener('scroll', onScroll)
  }, [])

  const handleIndexClick = (code: string) => {
    router.push(`/index/${code}`)
  }

  const scrollToChapter = (index: number) => {
    const el = journeyRef.current
    if (!el) return
    const w = el.clientWidth
    el.scrollTo({ left: index * w, behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen text-white pb-24" style={{ backgroundColor: BG_OLED }}>
      {/* ---------- 1. Intro (Vertical) ---------- */}
      <header className="sticky top-0 z-50 px-4 pt-4 pb-3 flex items-center justify-between border-b border-white/[0.08] backdrop-blur-xl" style={{ backgroundColor: `${BG_OLED}e6` }}>
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-full overflow-hidden border border-white/10">
              <img src="/images/avatar.jpg" alt="Profile" className="w-full h-full object-cover" />
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-[#020617]" style={{ backgroundColor: '#22c55e' }} />
          </div>
          <div>
            <p className="text-xs text-zinc-500 uppercase tracking-wide">Good Morning</p>
            <p className="text-sm font-bold tabular-nums">JELLY</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button type="button" className="p-2 rounded-full hover:bg-white/5 transition-colors duration-200" aria-label="Search">
            <Search size={20} className="text-zinc-400" />
          </button>
          <button type="button" className="p-2 rounded-full hover:bg-white/5 transition-colors duration-200 relative" aria-label="Notifications">
            <Bell size={20} className="text-zinc-400" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 border border-[#020617]" />
          </button>
        </div>
      </header>

      {/* Journey 进度条：Horizontal Scroll Journey 指示 */}
      <div className="flex justify-center gap-1.5 py-3">
        {[0, 1].map((i) => (
          <button
            key={i}
            type="button"
            onClick={() => scrollToChapter(i)}
            className={`h-1 rounded-full transition-all duration-200 ${
              journeyIndex === i ? 'w-6 bg-emerald-500' : 'w-1.5 bg-white/20 hover:bg-white/30'
            }`}
            aria-label={i === 0 ? 'Markets' : 'Tools'}
          />
        ))}
      </div>

      {/* ---------- 2. The Journey (Horizontal Scroll) — Bento 章节 ---------- */}
      <div
        ref={journeyRef}
        className="flex overflow-x-auto snap-x snap-mandatory gap-4 px-4 pb-5 no-scrollbar"
        style={{ scrollSnapType: 'x mandatory' }}
      >
        {/* Chapter 1: Markets — Bento Grid */}
        <section
          className="flex-shrink-0 w-[calc(100vw-2rem)] max-w-[calc(430px-2rem)] snap-center"
          style={{ scrollSnapAlign: 'center' }}
          aria-label="Markets"
        >
          <div className="grid grid-cols-2 grid-rows-2 gap-3">
            {/* 大卡：NASDAQ */}
            <button
              type="button"
              onClick={() => handleIndexClick(marketIndices[0].code)}
              className={`${glassCard} col-span-1 row-span-2 p-4 text-left flex flex-col justify-between`}
              style={{ backgroundColor: GLASS_BG, borderColor: GLASS_BORDER }}
            >
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{marketIndices[0].name}</p>
              <div>
                <p className={`text-2xl font-black tabular-nums ${marketIndices[0].isUp ? 'text-emerald-400' : 'text-red-400'}`}>
                  {marketIndices[0].value}
                </p>
                <p className={`text-xs font-semibold tabular-nums mt-1 ${marketIndices[0].isUp ? 'text-emerald-400' : 'text-red-400'}`}>
                  {marketIndices[0].change} {marketIndices[0].percent}
                </p>
              </div>
            </button>
            {/* 小卡：HSI */}
            <button
              type="button"
              onClick={() => handleIndexClick(marketIndices[1].code)}
              className={`${glassCard} col-span-1 row-span-1 p-3 text-left`}
              style={{ backgroundColor: GLASS_BG, borderColor: GLASS_BORDER }}
            >
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{marketIndices[1].name}</p>
              <p className={`text-lg font-black tabular-nums mt-1 ${marketIndices[1].isUp ? 'text-emerald-400' : 'text-red-400'}`}>
                {marketIndices[1].value}
              </p>
              <p className={`text-[10px] font-semibold tabular-nums ${marketIndices[1].isUp ? 'text-emerald-400' : 'text-red-400'}`}>
                {marketIndices[1].change} {marketIndices[1].percent}
              </p>
            </button>
            {/* 小卡：DJI */}
            <button
              type="button"
              onClick={() => handleIndexClick(marketIndices[2].code)}
              className={`${glassCard} col-span-1 row-span-1 p-3 text-left`}
              style={{ backgroundColor: GLASS_BG, borderColor: GLASS_BORDER }}
            >
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{marketIndices[2].name}</p>
              <p className={`text-lg font-black tabular-nums mt-1 ${marketIndices[2].isUp ? 'text-emerald-400' : 'text-red-400'}`}>
                {marketIndices[2].value}
              </p>
              <p className={`text-[10px] font-semibold tabular-nums ${marketIndices[2].isUp ? 'text-emerald-400' : 'text-red-400'}`}>
                {marketIndices[2].change} {marketIndices[2].percent}
              </p>
            </button>
          </div>
        </section>

        {/* Chapter 2: Tools — Bento Grid 4×2 */}
        <section
          className="flex-shrink-0 w-[calc(100vw-2rem)] max-w-[calc(430px-2rem)] snap-center"
          style={{ scrollSnapAlign: 'center' }}
          aria-label="Tools"
        >
          <div className="grid grid-cols-4 grid-rows-2 gap-2">
            {moduleIcons.map((m) => {
              const Icon = m.icon
              const hex = accentHex[m.accent] ?? accentHex.blue
              if (!isMounted) {
                return (
                  <div
                    key={m.id}
                    className="rounded-xl flex flex-col items-center justify-center gap-1.5 p-3 min-h-[72px]"
                    style={{ backgroundColor: GLASS_BG, border: `1px solid ${GLASS_BORDER}` }}
                  >
                    <div className="w-8 h-8 rounded-lg bg-white/10" />
                    <span className="text-[10px] text-zinc-500 font-medium text-center leading-tight">{m.label}</span>
                  </div>
                )
              }
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => onNavigate(m.id)}
                  className={`${glassCard} flex flex-col items-center justify-center gap-1.5 p-3 min-h-[72px]`}
                  style={{ backgroundColor: GLASS_BG, borderColor: GLASS_BORDER }}
                >
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${hex}20` }}
                  >
                    <Icon size={18} style={{ color: hex }} />
                  </div>
                  <span className="text-[10px] text-zinc-400 font-medium text-center leading-tight">{m.label}</span>
                </button>
              )
            })}
          </div>
        </section>
      </div>

      {/* ---------- 3. Detail Reveal (Vertical) — 高信息密度、金融级层级 ---------- */}
      <div className="px-4 space-y-4">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-0.5 h-4 rounded-full bg-emerald-500" />
          <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-500">Insights</h2>
        </div>
        <GlobalNewsCenter onNewsSelect={onNewsSelect} />

        {/* AI Market Analyst — 玻璃拟态，无亮色 */}
        <div
          className={`${glassCard} relative rounded-xl p-4 overflow-hidden`}
          style={{ backgroundColor: GLASS_BG, borderColor: GLASS_BORDER }}
        >
          <div className="absolute top-3 right-3 opacity-20 pointer-events-none">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" className="text-emerald-400">
              <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" fill="currentColor" />
            </svg>
          </div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'rgba(34, 197, 94, 0.2)' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-emerald-400">
                <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" fill="currentColor" />
              </svg>
            </div>
            <h3 className="text-sm font-bold text-emerald-400">AI Market Analyst</h3>
          </div>
          <p className="text-xs text-zinc-500 mb-3 pr-10">
            Professional-grade insights. Ask about sentiment, technicals, or earnings.
          </p>
          <div className="flex items-center gap-2 rounded-full pl-3 pr-1.5 py-1.5 border border-white/[0.08]" style={{ backgroundColor: 'rgba(15, 23, 42, 0.8)' }}>
            <input
              type="text"
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              placeholder="e.g. NVDA 2025 outlook?"
              className="flex-1 bg-transparent text-sm text-white placeholder:text-zinc-500 outline-none min-w-0"
            />
            <button type="button" className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors duration-200">
              <Send size={14} className="text-zinc-400" />
            </button>
          </div>
        </div>
      </div>

      {/* 4. Footer 由父级 BottomNav 渲染 */}
    </div>
  )
}
