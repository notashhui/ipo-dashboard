'use client'

import { useParams, useRouter } from 'next/navigation'
import { ChevronLeft } from 'lucide-react'
import { mockStocks } from '@/lib/mock-data'
import { sectors } from '@/lib/mock/sectors'

function getStockByTicker(ticker: string): { symbol: string; name: string; price: number; changePercent: number } | null {
  const fromMock = mockStocks.find((s) => s.symbol === ticker)
  if (fromMock) return { symbol: fromMock.symbol, name: fromMock.name, price: fromMock.price, changePercent: fromMock.changePercent }
  for (const sec of sectors) {
    const s = sec.topStocks.find((t) => t.ticker === ticker)
    if (s) return { symbol: s.ticker, name: s.name, price: s.price, changePercent: s.changePercent }
  }
  return null
}

export default function StockDetailPage() {
  const params = useParams()
  const router = useRouter()
  const ticker = typeof params.ticker === 'string' ? params.ticker.toUpperCase() : ''
  const stock = getStockByTicker(ticker)

  if (!stock) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4">
        <p className="text-zinc-500 text-sm">Stock not found</p>
        <button
          onClick={() => router.back()}
          className="mt-4 text-amber-500 text-sm font-bold uppercase"
        >
          Back
        </button>
      </div>
    )
  }

  const isPositive = stock.changePercent >= 0
  const changeColor = isPositive ? 'text-[#F04438]' : 'text-[#2E6BE6]'

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
            {stock.symbol}
          </h1>
          <div className="w-10" />
        </div>
      </div>

      {/* Price */}
      <div className="px-4 py-8 border-b border-zinc-900">
        <div className="bg-zinc-900/40 rounded-2xl p-6 border border-zinc-900">
          <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-2">
            {stock.name}
          </p>
          <p className="text-4xl font-black tabular-nums tracking-tight text-white">
            ${stock.price.toFixed(2)}
          </p>
          <p className={`text-lg font-black tabular-nums mt-2 ${changeColor}`}>
            {isPositive ? '+' : ''}{stock.changePercent.toFixed(2)}%
          </p>
        </div>
      </div>
    </div>
  )
}
