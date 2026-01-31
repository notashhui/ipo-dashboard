'use client'

import { MarketMovers } from './market-movers'

export interface NewsItem {
  id: string
  source: string
  time: string
  headline: string
  isBreaking: boolean
  region: 'us' | 'europe' | 'asia' | 'oceania' | 'global'
  body?: string
}

interface GlobalNewsCenterProps {
  onNewsSelect?: (news: NewsItem) => void
}

export function GlobalNewsCenter({ onNewsSelect: _onNewsSelect }: GlobalNewsCenterProps) {
  return (
    <div className="px-4 pb-6">
      <MarketMovers />
    </div>
  )
}
