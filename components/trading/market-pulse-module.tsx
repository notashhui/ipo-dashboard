'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronLeft, Clock } from 'lucide-react'
import type { Stock } from '@/lib/types'
import type { MarketPulseNewsItem, MarketPulseRegion } from '@/lib/types'
import { mockMarketPulseNews } from '@/lib/mock/market-pulse'

interface MarketPulseModuleProps {
  onBack: () => void
  onStockSelect?: (stock: Stock, badge?: string) => void
}

const REGIONS: MarketPulseRegion[] = ['Americas', 'Europe', 'Asia', 'Global']

export function MarketPulseModule({ onBack, onStockSelect }: MarketPulseModuleProps) {
  const router = useRouter()
  const [selectedRegion, setSelectedRegion] = useState<MarketPulseRegion>('Global')
  const [selectedArticle, setSelectedArticle] = useState<MarketPulseNewsItem | null>(null)

  const filteredNews = selectedRegion === 'Global'
    ? mockMarketPulseNews
    : mockMarketPulseNews.filter((n) => n.region === selectedRegion)

  const handleStockTagClick = (symbol: string) => {
    router.push(`/stock/${symbol}`)
  }

  const handleNewsCardClick = (item: MarketPulseNewsItem) => {
    setSelectedArticle(item)
  }

  const handleDetailBack = () => {
    setSelectedArticle(null)
  }

  // News detail view (full article)
  if (selectedArticle) {
    return (
      <MarketPulseNewsDetail
        article={selectedArticle}
        onBack={handleDetailBack}
        onStockTagClick={handleStockTagClick}
      />
    )
  }

  return (
    <div className="min-h-screen bg-black text-white pb-24">
      {/* Header */}
      <div className="sticky top-0 bg-black/95 backdrop-blur-md z-50 border-b border-zinc-900">
        <div className="flex items-center px-4 py-3">
          <button onClick={onBack} className="p-2 hover:bg-zinc-900 rounded-full">
            <ChevronLeft size={22} className="text-zinc-400" />
          </button>
          <h1 className="flex-1 text-center font-black text-sm uppercase tracking-widest">Market Pulse</h1>
          <div className="w-10" />
        </div>
      </div>

      {/* Page Title */}
      <div className="px-4 pt-6 pb-2">
        <h2 className="text-2xl font-bold text-white">Market Pulse</h2>
      </div>

      {/* Region Tabs */}
      <div className="px-4 py-4">
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {REGIONS.map((region) => (
            <button
              key={region}
              onClick={() => setSelectedRegion(region)}
              className={`px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-colors ${
                selectedRegion === region
                  ? 'bg-emerald-500 text-white'
                  : 'bg-transparent border border-zinc-700/80 text-zinc-400 hover:border-zinc-600'
              }`}
            >
              {region}
            </button>
          ))}
        </div>
      </div>

      {/* News Timeline */}
      <div className="px-4 py-4 space-y-3">
        {filteredNews.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-sm text-zinc-500">No news for this region.</p>
          </div>
        ) : (
          filteredNews.map((item) => (
            <NewsCard
              key={item.id}
              item={item}
              onCardClick={handleNewsCardClick}
              onStockTagClick={handleStockTagClick}
            />
          ))
        )}
      </div>
    </div>
  )
}

function NewsCard({
  item,
  onCardClick,
  onStockTagClick,
}: {
  item: MarketPulseNewsItem
  onCardClick: (item: MarketPulseNewsItem) => void
  onStockTagClick: (symbol: string) => void
}) {
  return (
    <div
      onClick={() => onCardClick(item)}
      className="bg-zinc-900/40 rounded-xl p-4 border border-zinc-800/50 cursor-pointer hover:bg-zinc-900/60 transition-colors active:scale-[0.99]"
    >
      {/* Timestamp (left) + Region tag (right) */}
      <div className="flex items-center justify-between mb-3">
        <span className="flex items-center gap-1.5 text-xs text-zinc-500">
          <Clock size={12} />
          {item.timestamp}
        </span>
        <span className="px-2.5 py-1 rounded-md bg-zinc-800/80 text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
          {item.region}
        </span>
      </div>

      {/* Title */}
      <h3 className="text-base font-semibold text-white leading-snug line-clamp-2 mb-2" style={{ lineHeight: 1.4 }}>
        {item.title}
      </h3>

      {/* Source */}
      <p className="text-xs text-zinc-500 mb-4">{item.source}</p>

      {/* Related stocks */}
      {item.relatedStocks.length > 0 && (
        <>
          <p className="text-xs text-zinc-500 mb-2">Related stocks:</p>
          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            {item.relatedStocks.map((s) => {
              const isUp = s.change >= 0
              return (
                <button
                  key={s.symbol}
                  onClick={(e) => {
                    e.stopPropagation()
                    onStockTagClick(s.symbol)
                  }}
                  className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold tabular-nums cursor-pointer hover:opacity-90 transition-opacity whitespace-nowrap ${
                    isUp ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                  }`}
                >
                  {s.symbol} {isUp ? '+' : ''}{s.change}%
                </button>
              )
            })}
          </div>
        </>
      )}

      {/* Optional: Heat & Comments */}
      {(item.heat != null || item.comments != null) && (
        <div className="flex items-center gap-4 mt-4 pt-3 border-t border-zinc-800/50 text-[11px] text-zinc-500">
          {item.heat != null && (
            <span>
              🔥 {item.heat}/10
            </span>
          )}
          {item.comments != null && (
            <span>
              💬 {item.comments} comments
            </span>
          )}
        </div>
      )}
    </div>
  )
}

interface MarketPulseNewsDetailProps {
  article: MarketPulseNewsItem
  onBack: () => void
  onStockTagClick: (symbol: string) => void
}

function MarketPulseNewsDetail({ article, onBack, onStockTagClick }: MarketPulseNewsDetailProps) {
  return (
    <div className="min-h-screen bg-black text-white pb-24">
      {/* Header */}
      <div className="sticky top-0 bg-black/95 backdrop-blur-md z-50 border-b border-zinc-900">
        <div className="flex items-center px-4 py-3">
          <button onClick={onBack} className="p-2 hover:bg-zinc-900 rounded-full">
            <ChevronLeft size={22} className="text-zinc-400" />
          </button>
          <h1 className="flex-1 text-center font-black text-sm uppercase tracking-widest truncate px-2">
            Article
          </h1>
          <div className="w-10" />
        </div>
      </div>

      {/* Article */}
      <div className="px-4 pt-6 pb-8">
        {/* Source, Timestamp, Region */}
        <div className="flex items-center gap-2 mb-4 flex-wrap">
          <span className="text-xs text-zinc-500 font-medium">{article.source}</span>
          <span className="text-zinc-700">•</span>
          <span className="text-xs text-zinc-500 flex items-center gap-1">
            <Clock size={12} />
            {article.timestamp}
          </span>
          <span className="text-zinc-700">•</span>
          <span className="px-2 py-0.5 rounded bg-zinc-800/80 text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
            {article.region}
          </span>
        </div>

        {/* Headline */}
        <h1 className="text-xl font-bold text-white leading-relaxed mb-6">
          {article.title}
        </h1>

        {/* Body */}
        <div className="text-[15px] text-zinc-300 leading-[1.8] space-y-4">
          {article.body.split('\n\n').map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>

        {/* Heat & Comments */}
        {(article.heat != null || article.comments != null) && (
          <div className="flex items-center gap-6 mt-8 pt-6 border-t border-zinc-800/50 text-sm text-zinc-500">
            {article.heat != null && <span>🔥 Heat {article.heat}/10</span>}
            {article.comments != null && <span>💬 {article.comments} comments</span>}
          </div>
        )}

        {/* Related stocks */}
        {article.relatedStocks.length > 0 && (
          <div className="mt-8 pt-6 border-t border-zinc-800/50">
            <h3 className="text-xs font-black uppercase tracking-widest text-zinc-400 mb-4">
              Related stocks
            </h3>
            <div className="flex flex-wrap gap-2">
              {article.relatedStocks.map((s) => {
                const isUp = s.change >= 0
                return (
                  <button
                    key={s.symbol}
                    onClick={() => onStockTagClick(s.symbol)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold tabular-nums cursor-pointer hover:opacity-90 transition-opacity ${
                      isUp ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                    }`}
                  >
                    {s.symbol} {isUp ? '+' : ''}{s.change}%
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* Source attribution */}
        <div className="mt-8 pt-6 border-t border-zinc-800/50">
          <p className="text-xs text-zinc-600 leading-relaxed">
            Source: {article.source}. This article is for informational purposes only.
          </p>
        </div>
      </div>
    </div>
  )
}
