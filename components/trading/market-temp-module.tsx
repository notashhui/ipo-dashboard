'use client'

import { useState, useMemo, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronLeft } from 'lucide-react'
import { Treemap, ResponsiveContainer } from 'recharts'
import type { Stock } from '@/lib/types'
import {
  marketTemperatureData,
  sectorHeatmapData,
  getHeatmapColor,
  type MarketTempMarket,
  type SectorHeatmapItem,
} from '@/lib/mock/market-temperature'

const MARKETS: { id: MarketTempMarket; label: string; flag: string }[] = [
  { id: 'US', label: 'US', flag: '🇺🇸' },
  { id: 'HK', label: 'HK', flag: '🇭🇰' },
  { id: 'CN', label: 'CN', flag: '🇨🇳' },
]

/** Build Treemap data: flat array of sectors (value = marketCap for tile size; change/slug for color & navigation) */
function buildTreemapData(sectors: SectorHeatmapItem[]) {
  return sectors.map((s) => ({
    name: s.name,
    value: s.marketCap,
    slug: s.slug,
    change: s.change,
  }))
}

/** Treemap cell: rect by change color, white text; small cells get smaller font */
function CustomizedTreemapContent(props: {
  x?: number
  y?: number
  width?: number
  height?: number
  name?: string
  value?: number
  slug?: string
  change?: number
  depth?: number
  index?: number
  children?: unknown
}) {
  const { x = 0, y = 0, width = 0, height = 0, name = '', slug, change = 0, depth } = props
  const isLeaf = depth === 0 || depth === 1
  if (!isLeaf || width < 20 || height < 20) return null
  const color = getHeatmapColor(change)
  const small = width < 80 || height < 50
  const nameSize = small ? 10 : 14
  const changeSize = small ? 12 : 18
  const changeStr = (change >= 0 ? '+' : '') + change.toFixed(2) + '%'
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill={color}
        stroke="#000"
        strokeWidth={1}
      />
      {width >= 60 && height >= 50 && (
        <>
          <text
            x={x + width / 2}
            y={y + height / 2 - (small ? 6 : 10)}
            textAnchor="middle"
            fill="#fff"
            fontSize={nameSize}
            fontWeight={600}
            style={{ pointerEvents: 'none' }}
          >
            {name.length > 12 ? name.slice(0, 10) + '…' : name}
          </text>
          <text
            x={x + width / 2}
            y={y + height / 2 + (small ? 8 : 12)}
            textAnchor="middle"
            fill="#fff"
            fontSize={changeSize}
            fontWeight={700}
            style={{ pointerEvents: 'none' }}
          >
            {changeStr}
          </text>
        </>
      )}
    </g>
  )
}

interface MarketTempModuleProps {
  onBack: () => void
  onStockSelect: (stock: Stock) => void
}

function getTempArcColor(value: number): string {
  if (value < 25) return '#2E7D32'
  if (value < 45) return '#66BB6A'
  if (value < 55) return '#eab308'
  if (value < 75) return '#f59e0b'
  return '#ef4444'
}

export function MarketTempModule({ onBack, onStockSelect: _onStockSelect }: MarketTempModuleProps) {
  const router = useRouter()
  const [market, setMarket] = useState<MarketTempMarket>('US')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const tempConfig = marketTemperatureData[market]
  const sectors = sectorHeatmapData[market]
  const showTempCard = tempConfig.hasIndex && tempConfig.index
  const treemapData = useMemo(() => buildTreemapData(sectors), [sectors])

  const handleTreemapClick = (node: { slug?: string; name?: string; depth?: number }) => {
    if (node?.depth !== 0 && node?.depth !== 1) return
    const slug = node.slug ?? sectors.find((s) => s.name === node?.name)?.slug
    if (slug) router.push(`/sector/${slug}`)
  }

  return (
    <div className="min-h-screen bg-black text-white pb-24">
      {/* Header */}
      <div className="sticky top-0 bg-black/95 backdrop-blur-md z-50 border-b border-zinc-900">
        <div className="flex items-center px-4 py-3">
          <button onClick={onBack} className="p-2 hover:bg-zinc-900 rounded-full">
            <ChevronLeft size={22} className="text-zinc-400" />
          </button>
          <h1 className="flex-1 text-center font-black text-sm uppercase tracking-widest">
            Market Temperature
          </h1>
          <div className="w-10" />
        </div>
      </div>

      {/* Market Tabs */}
      <div className="px-4 py-4">
        <div className="flex gap-3 overflow-x-auto no-scrollbar">
          {MARKETS.map((m) => (
            <button
              key={m.id}
              onClick={() => setMarket(m.id)}
              className={`shrink-0 px-6 py-2.5 rounded-full text-xs font-bold transition-colors ${
                market === m.id
                  ? 'bg-emerald-500 text-white'
                  : 'bg-transparent border border-white/20 text-zinc-500 hover:text-zinc-400'
              }`}
            >
              {m.flag} {m.label}
            </button>
          ))}
        </div>
      </div>

      {/* Market Temperature Card (US / CN only; hide for HK) */}
      {showTempCard && tempConfig.index && (
        <div className="px-4 pb-6">
          <div className="bg-[#0a0a0a] rounded-3xl p-6 border border-zinc-900">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600 mb-6">
              {market === 'US' ? 'Market Temperature' : 'Market Sentiment'}
            </h3>

            <div className="flex justify-center mb-6">
              <div className="relative w-48 h-28">
                <svg className="w-full h-full" viewBox="0 0 200 110">
                  <path
                    d="M 20 90 A 80 80 0 0 1 180 90"
                    fill="none"
                    stroke="#18181b"
                    strokeWidth="12"
                    strokeLinecap="round"
                  />
                  {(() => {
                    const v = tempConfig.index!.value
                    const angle = Math.PI - (v / 100) * Math.PI
                    const ex = 100 + 80 * Math.cos(angle)
                    const ey = 90 - 80 * Math.sin(angle)
                    return (
                      <path
                        d={`M 20 90 A 80 80 0 0 1 ${ex.toFixed(1)} ${ey.toFixed(1)}`}
                        fill="none"
                        stroke={getTempArcColor(v)}
                        strokeWidth="12"
                        strokeLinecap="round"
                      />
                    )
                  })()}
                </svg>
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-center">
                  <span
                    className="text-4xl font-black tabular-nums"
                    style={{ color: getTempArcColor(tempConfig.index.value) }}
                  >
                    {tempConfig.index.value}°
                  </span>
                  <p className="text-[8px] font-bold uppercase tracking-widest text-zinc-600 mt-1">
                    {tempConfig.index.label}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex justify-between items-center p-3 bg-zinc-950 rounded-2xl">
                <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-700">
                  Valuation
                </span>
                <span className="text-xs font-black text-[#F04438]">{tempConfig.index.valuation}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-zinc-950 rounded-2xl">
                <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-700">
                  Sentiment
                </span>
                <span className="text-xs font-black text-[#10b981]">{tempConfig.index.sentiment}</span>
              </div>
            </div>

            <div className="mt-6 h-20">
              <svg className="w-full h-full" viewBox="0 0 300 60">
                {(() => {
                  const d = tempConfig.index!.trendData
                  const n = d.length
                  const den = n > 1 ? n - 1 : 1
                  const pts = d.map((v, i) => `${(i * 300) / den},${60 - (v / 100) * 50}`).join(' ')
                  const last = d[n - 1]!
                  return (
                    <>
                      <polyline points={pts} fill="none" stroke="#3b82f6" strokeWidth="2" />
                      <circle cx={n > 1 ? 300 : 0} cy={60 - (last / 100) * 50} r="3" fill="#3b82f6" />
                    </>
                  )
                })()}
              </svg>
            </div>
          </div>
        </div>
      )}

      {/* Sector Heatmap - Treemap 布局：按市值比例、直角、无圆角、涨跌幅配色 */}
      <div className="px-4 pb-6">
        <div className="bg-[#0a0a0a] rounded-3xl p-6 border border-zinc-900">
          <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600 mb-6">
            Sector Heatmap
          </h3>

          <div className="w-full h-[400px] [&_.recharts-wrapper]:outline-none">
            {mounted ? (
              <ResponsiveContainer width="100%" height={400}>
                <Treemap
                  data={treemapData}
                  dataKey="value"
                  type="flat"
                  aspectRatio={4 / 3}
                  stroke="#000"
                  content={<CustomizedTreemapContent />}
                  onClick={handleTreemapClick}
                  style={{ cursor: 'pointer' }}
                />
              </ResponsiveContainer>
            ) : (
              <div className="w-full h-full min-h-[400px] flex items-center justify-center bg-zinc-900/50 rounded-xl text-zinc-500 text-sm">
                Loading chart…
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
