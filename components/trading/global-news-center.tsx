'use client'

import { useState, useEffect, useRef } from 'react'
import { Globe, ChevronRight } from 'lucide-react'

interface MarketPoint {
  id: string
  name: string
  region: 'us' | 'europe' | 'asia' | 'oceania'
  change: number
  x: number
  y: number
  marketCap?: number // For collision detection priority
}

export interface NewsItem {
  id: string
  source: string
  time: string
  headline: string
  isBreaking: boolean
  region: 'us' | 'europe' | 'asia' | 'oceania' | 'global'
  body?: string
}

// Only 5 major market indices
const marketPoints: MarketPoint[] = [
  // Americas
  { id: 'nasdaq', name: 'NASDAQ', region: 'us', change: 0.28, x: 18, y: 32, marketCap: 25.0 },
  // Europe
  { id: 'dax', name: 'DAX', region: 'europe', change: 0.18, x: 52, y: 26, marketCap: 2.1 },
  // Asia
  { id: 'nikkei', name: 'NIKKEI 225', region: 'asia', change: 0.29, x: 85, y: 32, marketCap: 6.5 },
  { id: 'sse', name: 'SSE', region: 'asia', change: 0.33, x: 78, y: 36, marketCap: 7.2 },
  // Pacific
  { id: 'asx', name: 'ASX 200', region: 'oceania', change: 0.13, x: 88, y: 68, marketCap: 1.8 },
]

// Region center coordinates for map scrolling
const regionCenters: Record<string, { x: number; y: number }> = {
  'us': { x: 18, y: 32 },
  'europe': { x: 52, y: 26 },
  'asia': { x: 81, y: 34 },
  'oceania': { x: 88, y: 68 },
}

// Collision detection: minimum distance between labels (in percentage)
const MIN_LABEL_DISTANCE = 8 // Increased from default to prevent overlap

const newsItems: NewsItem[] = [
  {
    id: '1',
    source: 'Bloomberg',
    time: '10m ago',
    headline: 'Fed Chair hints at slower rate cuts as inflation remains sticky.',
    isBreaking: true,
    region: 'us'
  },
  {
    id: '2',
    source: 'Reuters',
    time: '25m ago',
    headline: 'Tech stocks rally as NVIDIA reports record quarterly earnings.',
    isBreaking: false,
    region: 'us'
  },
  {
    id: '3',
    source: 'FT',
    time: '32m ago',
    headline: 'FTSE 100 slips as UK inflation data exceeds expectations.',
    isBreaking: false,
    region: 'europe'
  },
  {
    id: '4',
    source: 'Nikkei',
    time: '45m ago',
    headline: 'Bank of Japan signals potential rate adjustment in March meeting.',
    isBreaking: true,
    region: 'asia'
  },
  {
    id: '5',
    source: 'SCMP',
    time: '1h ago',
    headline: 'Hong Kong stocks surge on positive mainland sentiment data.',
    isBreaking: false,
    region: 'asia'
  },
  {
    id: '6',
    source: 'AFR',
    time: '1h ago',
    headline: 'ASX 200 edges higher amid mining sector strength.',
    isBreaking: false,
    region: 'oceania'
  },
  {
    id: '7',
    source: 'WSJ',
    time: '2h ago',
    headline: 'Global markets await US jobs data release on Friday.',
    isBreaking: false,
    region: 'global'
  },
]

interface GlobalNewsCenterProps {
  onNewsSelect?: (news: NewsItem) => void
}

export function GlobalNewsCenter({ onNewsSelect }: GlobalNewsCenterProps) {
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null)
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const [visiblePoints, setVisiblePoints] = useState<MarketPoint[]>(marketPoints)
  const [mapTransform, setMapTransform] = useState({ x: 0, y: 0 })

  const filteredNews = selectedRegion
    ? newsItems.filter(news => news.region === selectedRegion || news.region === 'global')
    : newsItems

  // Collision detection: filter points that are too close, keeping higher market cap
  useEffect(() => {
    const sorted = [...marketPoints].sort((a, b) => (b.marketCap || 0) - (a.marketCap || 0))
    const filtered: MarketPoint[] = []
    
    for (const point of sorted) {
      let hasCollision = false
      for (const existing of filtered) {
        const distance = Math.sqrt(
          Math.pow(point.x - existing.x, 2) + Math.pow(point.y - existing.y, 2)
        )
        if (distance < MIN_LABEL_DISTANCE) {
          hasCollision = true
          break
        }
      }
      if (!hasCollision) {
        filtered.push(point)
      }
    }
    
    setVisiblePoints(filtered)
  }, [])

  const handleMarketClick = (region: string) => {
    setSelectedRegion(selectedRegion === region ? null : region)
  }

  const handleRegionPillClick = (region: string) => {
    const center = regionCenters[region]
    if (center && mapContainerRef.current) {
      const container = mapContainerRef.current
      const mapWidth = container.offsetWidth
      const mapHeight = container.offsetHeight
      
      // Calculate transform to center the region (using percentage)
      // Since points use percentage positioning, we calculate offset to center the region
      const targetXPercent = center.x / 100
      const targetYPercent = center.y / 100
      
      // Calculate transform: move so the target point is at center
      const transformX = mapWidth / 2 - targetXPercent * mapWidth
      const transformY = mapHeight / 2 - targetYPercent * mapHeight
      
      // Smooth transition
      setMapTransform({ x: transformX, y: transformY })
    }
    handleMarketClick(region)
  }

  return (
    <div className="px-4 pb-6">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Globe size={16} className="text-blue-400" />
          <h3 className="text-xs font-black uppercase tracking-widest text-zinc-300">Global Markets</h3>
        </div>
        {selectedRegion && (
          <button 
            onClick={() => setSelectedRegion(null)}
            className="text-[10px] text-blue-400 font-bold uppercase tracking-wider"
          >
            Clear Filter
          </button>
        )}
      </div>

      {/* Interactive Map */}
      <div className="relative bg-zinc-900/40 rounded-2xl border border-zinc-800/50 overflow-hidden mb-4">
        <div ref={mapContainerRef} className="relative w-full h-48 overflow-hidden">
          {/* Map content container with smooth transform */}
          <div 
            className="relative w-full h-full transition-transform duration-700 ease-out"
            style={{
              transform: `translate(${mapTransform.x}px, ${mapTransform.y}px)`
            }}
          >
            {/* Dot Matrix World Map SVG */}
            <svg 
              ref={svgRef}
              viewBox="0 0 100 60" 
              className="w-full h-full"
              preserveAspectRatio="xMidYMid slice"
            >
            {/* Background grid dots - reduced opacity for unselected points */}
            <defs>
              <pattern id="dotPattern" x="0" y="0" width="2" height="2" patternUnits="userSpaceOnUse">
                <circle cx="1" cy="1" r="0.3" fill="#27272a" opacity="0.4" />
              </pattern>
            </defs>
            <rect width="100" height="60" fill="url(#dotPattern)" />
            
            {/* Simplified continent outlines using dots - reduced brightness */}
            {/* North America */}
            {[...Array(15)].map((_, i) => (
              <circle key={`na-${i}`} cx={15 + (i % 5) * 3} cy={25 + Math.floor(i / 5) * 3} r="0.6" fill="#3f3f46" opacity="0.3" />
            ))}
            {/* Europe */}
            {[...Array(12)].map((_, i) => (
              <circle key={`eu-${i}`} cx={45 + (i % 4) * 2.5} cy={22 + Math.floor(i / 4) * 2.5} r="0.5" fill="#3f3f46" opacity="0.3" />
            ))}
            {/* Asia */}
            {[...Array(20)].map((_, i) => (
              <circle key={`as-${i}`} cx={65 + (i % 5) * 4} cy={28 + Math.floor(i / 5) * 3} r="0.6" fill="#3f3f46" opacity="0.3" />
            ))}
            {/* Australia */}
            {[...Array(6)].map((_, i) => (
              <circle key={`au-${i}`} cx={82 + (i % 3) * 3} cy={55 + Math.floor(i / 3) * 3} r="0.5" fill="#3f3f46" opacity="0.3" />
            ))}
          </svg>

            {/* Market Points with Labels - only visible points after collision detection */}
            {visiblePoints.map((point) => {
              const isPositive = point.change >= 0
              const isSelected = selectedRegion === point.region
              
              return (
                <button
                  key={point.id}
                  onClick={() => handleMarketClick(point.region)}
                  className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-200 ${
                    isSelected ? 'scale-110 z-20' : 'z-10 hover:scale-105'
                  }`}
                  style={{ left: `${point.x}%`, top: `${point.y}%` }}
                >
                  {/* Pulse ring for selected */}
                  {isSelected && (
                    <div className={`absolute inset-0 w-3 h-3 -m-0.5 rounded-full animate-ping ${
                      isPositive ? 'bg-red-500/30' : 'bg-emerald-500/30'
                    }`} />
                  )}
                  
                  {/* Indicator dot */}
                  <div className={`w-2 h-2 rounded-full ${
                    isPositive ? 'bg-red-500' : 'bg-emerald-500'
                  } ${isSelected ? 'ring-2 ring-white/20' : ''}`} />
                  
                  {/* Label - with increased spacing */}
                  <div className={`absolute whitespace-nowrap ${
                    point.x > 70 ? 'right-4' : 'left-4'
                  } top-1/2 -translate-y-1/2`}>
                    <p className={`text-[10px] font-bold ${
                      isSelected ? 'text-white' : 'text-zinc-300'
                    }`}>
                      {point.name}
                    </p>
                    <p className={`text-[11px] font-black tabular-nums ${
                      isPositive ? 'text-red-400' : 'text-emerald-400'
                    }`}>
                      {isPositive ? '+' : ''}{point.change.toFixed(2)}%
                    </p>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Region Filter Pills */}
        <div className="flex items-center gap-2 px-3 pb-3 overflow-x-auto no-scrollbar">
          {['us', 'europe', 'asia', 'oceania'].map((region) => (
            <button
              key={region}
              onClick={() => handleRegionPillClick(region)}
              className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-colors ${
                selectedRegion === region
                  ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                  : 'bg-zinc-800/50 text-zinc-500 border border-zinc-700/50 hover:text-zinc-400'
              }`}
            >
              {region === 'us' ? 'Americas' : region === 'oceania' ? 'Pacific' : region.charAt(0).toUpperCase() + region.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* News Feed Section Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-1 h-4 bg-emerald-500 rounded-full" />
          <h4 className="text-[11px] font-black uppercase tracking-widest text-zinc-400">
            {selectedRegion 
              ? `${selectedRegion === 'us' ? 'Americas' : selectedRegion === 'oceania' ? 'Pacific' : selectedRegion.charAt(0).toUpperCase() + selectedRegion.slice(1)} News` 
              : 'Market Headlines'}
          </h4>
        </div>
        <button className="flex items-center gap-1 text-[10px] text-zinc-500 hover:text-zinc-400">
          <span>View All</span>
          <ChevronRight size={12} />
        </button>
      </div>

      {/* News Cards */}
      <div className="space-y-3">
        {filteredNews.slice(0, 3).map((news) => (
          <div
            key={news.id}
            onClick={() => onNewsSelect?.(news)}
            className="w-full text-left bg-zinc-900/40 rounded-2xl p-4 border border-zinc-800/50 active:scale-[0.99] transition-transform cursor-pointer"
          >
            <div className="flex items-center gap-2 mb-2">
              {news.isBreaking && (
                <span className="px-2 py-0.5 bg-red-500/20 text-red-400 text-[10px] font-bold uppercase tracking-wider rounded">
                  Breaking
                </span>
              )}
              <span className="text-xs text-zinc-500">{news.source} • {news.time}</span>
            </div>
            <p className="text-sm text-zinc-200 leading-relaxed">{news.headline}</p>
          </div>
        ))}
      </div>

      {/* Show more indicator if filtered */}
      {filteredNews.length > 3 && (
        <button className="w-full mt-3 py-2 text-center text-[11px] font-bold text-blue-400 uppercase tracking-wider hover:text-blue-300">
          +{filteredNews.length - 3} more {selectedRegion ? 'regional' : ''} headlines
        </button>
      )}
    </div>
  )
}
