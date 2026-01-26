'use client'

import { useState } from 'react'
import { ChevronLeft, BarChart3, MoreHorizontal, Heart, ThumbsUp, Bookmark, MessageCircle, Share2, ChevronRight } from 'lucide-react'
import type { Stock } from '@/lib/types'

interface RelatedSecurity {
  symbol: string
  name: string
  market: 'US' | 'HK' | 'CN'
  price: number
  change: number
  changePercent: number
  afterHoursPrice?: number
  afterHoursChange?: number
  likes: number
  isLiked: boolean
}

interface NewsArticle {
  id: string
  source: string
  timestamp: string
  headline: string
  body: string
  relatedSecurities: RelatedSecurity[]
  disclaimer: string
}

interface NewsDetailProps {
  article: NewsArticle
  onBack: () => void
  onStockSelect: (stock: Stock) => void
}

export function NewsDetail({ article, onBack, onStockSelect }: NewsDetailProps) {
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const [securities, setSecurities] = useState(article.relatedSecurities)

  const toggleWatchlist = (symbol: string) => {
    setSecurities(prev => prev.map(s => 
      s.symbol === symbol ? { ...s, isLiked: !s.isLiked, likes: s.isLiked ? s.likes - 1 : s.likes + 1 } : s
    ))
  }

  const handleStockClick = (security: RelatedSecurity) => {
    onStockSelect({
      symbol: security.symbol,
      name: security.name,
      price: security.price,
      change: security.change,
      changePercent: security.changePercent
    })
  }

  return (
    <div className="min-h-screen bg-black text-white pb-24">
      {/* Header */}
      <div className="sticky top-0 bg-black/90 backdrop-blur-xl z-40 border-b border-zinc-900">
        <div className="flex items-center justify-between px-4 py-3">
          <button
            onClick={onBack}
            className="w-10 h-10 rounded-full bg-zinc-900/60 flex items-center justify-center hover:bg-zinc-800/60 transition-colors"
          >
            <ChevronLeft size={20} className="text-zinc-400" />
          </button>
          <div className="flex items-center gap-3">
            <button className="w-10 h-10 rounded-full bg-zinc-900/60 flex items-center justify-center hover:bg-zinc-800/60 transition-colors">
              <BarChart3 size={18} className="text-zinc-400" />
            </button>
            <button className="w-10 h-10 rounded-full bg-zinc-900/60 flex items-center justify-center hover:bg-zinc-800/60 transition-colors">
              <MoreHorizontal size={18} className="text-zinc-400" />
            </button>
          </div>
        </div>
      </div>

      {/* Article Content */}
      <div className="px-4 pt-6 pb-8">
        {/* Source & Timestamp */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xs text-zinc-500 font-medium">{article.source}</span>
          <span className="text-zinc-700">•</span>
          <span className="text-xs text-zinc-500">{article.timestamp}</span>
        </div>

        {/* Headline */}
        <h1 className="text-xl font-bold text-amber-500 leading-relaxed mb-6">
          {article.headline}
        </h1>

        {/* Article Body */}
        <div className="text-[15px] text-zinc-300 leading-[1.8] space-y-4">
          {article.body.split('\n\n').map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>

        {/* Source Attribution */}
        <div className="mt-8 pt-6 border-t border-zinc-800/50">
          <p className="text-xs text-zinc-600 leading-relaxed">
            Source: {article.source}. Copyright belongs to the original author/institution.
          </p>
          <p className="text-xs text-zinc-600 leading-relaxed mt-2">
            {article.disclaimer}
          </p>
        </div>
      </div>

      {/* Divider */}
      <div className="h-2 bg-zinc-900/50" />

      {/* Related Securities Section */}
      <div className="px-4 py-6">
        <h3 className="text-xs font-black uppercase tracking-widest text-zinc-400 mb-4">
          Related Securities
        </h3>

        <div className="space-y-1">
          {securities.map((security) => {
            const isPositive = security.changePercent >= 0

            return (
              <button
                key={security.symbol}
                onClick={() => handleStockClick(security)}
                className="w-full flex items-center justify-between py-4 border-b border-zinc-800/30 hover:bg-zinc-900/30 transition-colors -mx-2 px-2 rounded-lg"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-base font-bold text-white">{security.name}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className={`text-xs font-bold ${
                      security.market === 'HK' ? 'text-red-400' : 
                      security.market === 'US' ? 'text-blue-400' : 'text-amber-400'
                    }`}>
                      {security.market}
                    </span>
                    <span className="text-xs text-zinc-500">{security.symbol}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-base font-bold text-white tabular-nums">
                      {security.price.toFixed(security.market === 'HK' ? 3 : 2)}
                    </p>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-bold tabular-nums ${
                        isPositive ? 'text-red-400' : 'text-emerald-400'
                      }`}>
                        {isPositive ? '+' : ''}{security.changePercent.toFixed(2)}%
                      </span>
                      {security.afterHoursPrice && (
                        <span className="text-[10px] text-zinc-600 px-1 py-0.5 bg-zinc-800/50 rounded">
                          After Hours
                        </span>
                      )}
                    </div>
                    {security.afterHoursPrice && (
                      <div className="flex items-center gap-1 mt-0.5">
                        <span className="text-xs text-zinc-500 tabular-nums">
                          {security.afterHoursPrice.toFixed(2)}
                        </span>
                        <span className={`text-xs tabular-nums ${
                          (security.afterHoursChange || 0) >= 0 ? 'text-red-400' : 'text-emerald-400'
                        }`}>
                          {(security.afterHoursChange || 0) >= 0 ? '+' : ''}{(security.afterHoursChange || 0).toFixed(2)}%
                        </span>
                      </div>
                    )}
                  </div>

                  <div
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleWatchlist(security.symbol)
                    }}
                    className="flex flex-col items-center gap-0.5"
                  >
                    <Heart 
                      size={20} 
                      className={security.isLiked ? 'text-red-500 fill-red-500' : 'text-zinc-600'} 
                    />
                    <span className="text-[10px] text-zinc-500 tabular-nums">
                      {security.likes >= 1000 ? `${(security.likes / 1000).toFixed(0)}k` : security.likes}
                    </span>
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Sticky Bottom Interaction Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-zinc-900/90 backdrop-blur-xl border-t border-zinc-800/50 z-50 max-w-[430px] mx-auto">
        <div className="flex items-center px-4 py-3 gap-3">
          {/* Comment Input */}
          <div className="flex-1 bg-zinc-800/50 rounded-full px-4 py-2.5 border border-zinc-700/50">
            <span className="text-sm text-zinc-500">Share your thoughts...</span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-1">
            <button 
              onClick={() => setIsLiked(!isLiked)}
              className="flex flex-col items-center p-2 hover:bg-zinc-800/50 rounded-lg transition-colors"
            >
              <ThumbsUp size={20} className={isLiked ? 'text-blue-400 fill-blue-400' : 'text-zinc-500'} />
              <span className="text-[10px] text-zinc-500 mt-0.5">Like</span>
            </button>
            <button 
              onClick={() => setIsBookmarked(!isBookmarked)}
              className="flex flex-col items-center p-2 hover:bg-zinc-800/50 rounded-lg transition-colors"
            >
              <Bookmark size={20} className={isBookmarked ? 'text-amber-400 fill-amber-400' : 'text-zinc-500'} />
              <span className="text-[10px] text-zinc-500 mt-0.5">Save</span>
            </button>
            <button className="flex flex-col items-center p-2 hover:bg-zinc-800/50 rounded-lg transition-colors">
              <MessageCircle size={20} className="text-zinc-500" />
              <span className="text-[10px] text-zinc-500 mt-0.5">Reply</span>
            </button>
            <button className="flex flex-col items-center p-2 hover:bg-zinc-800/50 rounded-lg transition-colors">
              <Share2 size={20} className="text-zinc-500" />
              <span className="text-[10px] text-zinc-500 mt-0.5">Share</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Sample article data for testing
export const sampleNewsArticle: NewsArticle = {
  id: '1',
  source: 'Wall Street Insights',
  timestamp: '2026-01-24 06:44',
  headline: 'MSCI Emerging Markets Index rises 0.4%, hitting record highs with five consecutive trading days of gains - the longest winning streak since May 2025.',
  body: `Alibaba, TSMC, MediaTek Inc. and other Asian tech stocks contributed significantly to the gains. Year-to-date in 2025, the index has risen approximately 7.0%, while the S&P 500 has gained about 1% over the same period.

Latin American markets rose on Friday, with regional indices climbing approximately 1.3%. Year-to-date gains now approach 14%. The MSCI Emerging Markets Latin America Equity Index closed at its highest level since 2018.

Brazil's benchmark index led Friday's gains, rising approximately 8.7% for the week. Strong commodity prices and improving fiscal outlook supported the rally. Foreign investors have increased allocations to emerging market equities amid expectations of a weaker dollar.

Technical indicators suggest the rally may have room to extend, with momentum indicators remaining in bullish territory. However, analysts warn that upcoming U.S. economic data could introduce volatility.`,
  relatedSecurities: [
    { symbol: '09988', name: 'Alibaba-W', market: 'HK', price: 168.500, change: 3.71, changePercent: 2.25, likes: 24900, isLiked: true },
    { symbol: 'EVLU', name: 'iShares MSCI Emerging Mkts Val Fac ETF', market: 'US', price: 34.760, change: 0.19, changePercent: 0.55, afterHoursPrice: 34.760, afterHoursChange: 0.00, likes: 4, isLiked: false },
    { symbol: 'EEM', name: 'iShares MSCI Emerging Markets ETF', market: 'US', price: 59.070, change: 0.37, changePercent: 0.63, afterHoursPrice: 59.190, afterHoursChange: 0.20, likes: 958, isLiked: false },
    { symbol: 'IEMG', name: 'iShares Core MSCI Emerging Markets ETF', market: 'US', price: 72.400, change: 0.44, changePercent: 0.61, afterHoursPrice: 72.510, afterHoursChange: 0.15, likes: 731, isLiked: false },
    { symbol: 'VWO', name: 'Vanguard FTSE Emerging Markets ETF', market: 'US', price: 56.770, change: 0.22, changePercent: 0.39, afterHoursPrice: 56.950, afterHoursChange: 0.32, likes: 1000, isLiked: false },
  ],
  disclaimer: 'The content represents only the author\'s views and does not constitute investment advice. Content is for reference only and does not constitute any investment recommendations. Please contact us if you have any questions or suggestions about the content services provided.'
}
