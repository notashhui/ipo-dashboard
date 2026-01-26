'use client'

import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { getSectorBySlug } from '@/lib/mock/sectors'

export default function SectorDetailPage() {
  const params = useParams()
  const router = useRouter()
  const slug = typeof params.slug === 'string' ? params.slug : ''
  const sector = getSectorBySlug(slug)

  if (!sector) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4">
        <p className="text-zinc-500 text-sm">Sector not found</p>
        <Link href="/" className="mt-4 text-amber-500 text-sm font-bold uppercase">
          Back to Home
        </Link>
      </div>
    )
  }

  const isPositive = sector.change >= 0
  const changeColor = isPositive ? 'text-[#F04438]' : 'text-[#2E6BE6]'
  const tag = sector.change >= 2 ? 'High' : sector.change <= 0.5 && sector.change >= -0.5 ? 'Calm' : null

  return (
    <div className="min-h-screen bg-black text-white pb-24 max-w-[430px] mx-auto">
      {/* Header */}
      <div className="sticky top-0 bg-black/95 backdrop-blur-md z-50 border-b border-zinc-900">
        <div className="flex items-center px-4 py-3">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-zinc-900 rounded-full"
          >
            <ChevronLeft size={22} className="text-zinc-400" />
          </button>
          <h1 className="flex-1 text-center font-black text-sm uppercase tracking-widest">
            {sector.name}
          </h1>
          <div className="w-10" />
        </div>
      </div>

      {/* Summary */}
      <div className="px-4 py-6 border-b border-zinc-900">
        <div className="bg-zinc-900/40 rounded-2xl p-5 border border-zinc-900">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">
              Sector
            </span>
            {tag && (
              <span
                className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${
                  tag === 'High' ? 'bg-[#F04438]/20 text-[#F04438]' : 'bg-[#10b981]/20 text-[#10b981]'
                }`}
              >
                {tag}
              </span>
            )}
          </div>
          <p className={`text-2xl font-black tabular-nums ${changeColor}`}>
            {isPositive ? '+' : ''}{sector.change}%
          </p>
          <p className="text-[10px] text-zinc-600 mt-1">Market cap {sector.weight}</p>
        </div>
      </div>

      {/* Constituents */}
      <div className="px-4 py-6">
        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 mb-4">
          Constituents
        </h3>
        <div className="space-y-2">
          {sector.topStocks.map((s) => {
            const up = s.changePercent >= 0
            return (
              <button
                key={s.ticker}
                onClick={() => router.push(`/stock/${s.ticker}`)}
                className="w-full flex items-center justify-between p-3 bg-zinc-900/40 rounded-2xl border border-zinc-900 hover:bg-zinc-900/60 transition-all text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-zinc-800 flex items-center justify-center text-[10px] font-black">
                    {s.ticker.slice(0, 2)}
                  </div>
                  <div>
                    <p className="text-xs font-black">{s.ticker}</p>
                    <p className="text-[9px] text-zinc-600">{s.name}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-black tabular-nums ${up ? 'text-[#F04438]' : 'text-[#2E6BE6]'}`}>
                    {up ? '+' : ''}{s.changePercent.toFixed(2)}%
                  </p>
                  <p className="text-[9px] text-zinc-600">${s.price.toFixed(2)}</p>
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
