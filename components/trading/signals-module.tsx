'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronLeft, Info, X, ArrowUpDown, Heart } from 'lucide-react'
import type { Stock } from '@/lib/types'
import { popularStrategies, indicators, mockScanResults } from '@/lib/mock/smart-scan'
import type { Indicator, ScanResult, ScanFilter } from '@/lib/types'

interface SignalsModuleProps {
  onBack: () => void
  onStockSelect: (stock: Stock, badge?: string) => void
}

type ViewMode = 'landing' | 'indicator-selection' | 'scan-results'
type MarketTab = 'market' | 'industry'
type SortField = 'price' | 'change' | 'revenue' | null
type SortDirection = 'asc' | 'desc'

export function SignalsModule({ onBack, onStockSelect }: SignalsModuleProps) {
  const router = useRouter()
  const [viewMode, setViewMode] = useState<ViewMode>('landing')
  const [selectedIndicators, setSelectedIndicators] = useState<Set<string>>(new Set())
  const [marketTab, setMarketTab] = useState<MarketTab>('market')
  const [selectedMarket, setSelectedMarket] = useState<string>('US Stock')
  const [showSaveToast, setShowSaveToast] = useState(false)
  const [activeFilters, setActiveFilters] = useState<ScanFilter[]>([])
  const [sortField, setSortField] = useState<SortField>(null)
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')

  // Load filters from URL params on mount and when view changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      const viewParam = params.get('view')
      const filtersParam = params.get('filters')
      
      // Set view mode from URL
      if (viewParam === 'scan-results') {
        setViewMode('scan-results')
      }
      
      // Load filters from URL
      if (filtersParam) {
        try {
          const filters = JSON.parse(decodeURIComponent(filtersParam)) as ScanFilter[]
          setActiveFilters(filters)
        } catch (e) {
          console.error('Failed to parse filters from URL', e)
        }
      }
    }
  }, [])

  // Toggle indicator selection
  const toggleIndicator = (indicatorId: string) => {
    setSelectedIndicators(prev => {
      const next = new Set(prev)
      if (next.has(indicatorId)) {
        next.delete(indicatorId)
      } else {
        next.add(indicatorId)
      }
      return next
    })
  }

  // Handle strategy selection
  const handleStrategySelect = (strategyId: string) => {
    // Navigate to indicator selection with pre-selected indicators based on strategy
    setViewMode('indicator-selection')
  }

  // Handle start customizing
  const handleStartCustomizing = () => {
    setViewMode('indicator-selection')
  }

  // Calculate matched results count
  const getMatchedCount = (): number => {
    // In a real app, this would call an API with the selected filters
    // For now, return a mock count based on selected indicators
    if (selectedIndicators.size === 0) return 0
    return Math.floor(Math.random() * 50) + 10 // Mock: 10-60 results
  }

  // Handle add filter / view results
  const handleViewResults = () => {
    if (selectedIndicators.size === 0) return
    
    // Build filters from selected indicators
    const filters: ScanFilter[] = []
    if (selectedMarket) {
      filters.push({ type: 'market', label: 'Market', value: selectedMarket })
    }
    selectedIndicators.forEach(indicatorId => {
      const indicator = Object.values(indicators).flat().find(i => i.id === indicatorId)
      if (indicator) {
        filters.push({ type: 'indicator', label: indicator.name, value: '10%~20%' })
      }
    })
    setActiveFilters(filters)
    
    // Navigate to results page with filters in URL params
    const filtersParam = encodeURIComponent(JSON.stringify(filters))
    if (typeof window !== 'undefined') {
      const currentUrl = new URL(window.location.href)
      currentUrl.searchParams.set('view', 'scan-results')
      currentUrl.searchParams.set('filters', filtersParam)
      router.push(currentUrl.pathname + currentUrl.search)
    }
    setViewMode('scan-results')
  }

  // Handle stock click - navigate to stock detail page
  const handleStockClick = (result: ScanResult) => {
    // Navigate to stock detail page using Next.js router
    router.push(`/stock/${result.symbol}`)
  }

  // Handle save strategy
  const handleSaveStrategy = () => {
    setShowSaveToast(true)
    setTimeout(() => setShowSaveToast(false), 2000)
  }

  // Handle sort
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('desc')
    }
  }

  // Get sorted results
  const getSortedResults = (): ScanResult[] => {
    const results = [...mockScanResults]
    if (!sortField) return results

    return results.sort((a, b) => {
      let aVal: number, bVal: number
      switch (sortField) {
        case 'price':
          aVal = a.price
          bVal = b.price
          break
        case 'change':
          aVal = a.changePercent
          bVal = b.changePercent
          break
        case 'revenue':
          aVal = a.revenue || 0
          bVal = b.revenue || 0
          break
        default:
          return 0
      }
      return sortDirection === 'asc' ? aVal - bVal : bVal - aVal
    })
  }

  // Format watchlist count
  const formatWatchlistCount = (count: number): string => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k`
    }
    return count.toString()
  }

  // Landing Page View
  if (viewMode === 'landing') {
    return (
      <div className="min-h-screen bg-black text-white pb-24">
        {/* Header */}
        <div className="sticky top-0 bg-black/95 backdrop-blur-md z-50 border-b border-zinc-900">
          <div className="flex items-center px-4 py-3">
            <button onClick={onBack} className="p-2 hover:bg-zinc-900 rounded-full">
              <ChevronLeft size={22} className="text-zinc-400" />
            </button>
            <h1 className="flex-1 text-center font-black text-sm uppercase tracking-widest">Smart Scan</h1>
            <button className="p-2 hover:bg-zinc-900 rounded-full">
              <Info size={20} className="text-zinc-400" />
            </button>
          </div>
        </div>

        {/* Popular Strategies Section */}
        <div className="px-4 py-6">
          <h2 className="text-base font-black mb-2">Popular Strategies</h2>
          <p className="text-xs text-zinc-400 mb-4">Don't know how to choose? Try the following strategies</p>
          
          <div className="grid grid-cols-2 gap-3 mb-8">
            {popularStrategies.map((strategy) => (
              <button
                key={strategy.id}
                onClick={() => handleStrategySelect(strategy.id)}
                className="bg-zinc-900/40 rounded-xl p-4 border border-zinc-800/50 text-left hover:bg-zinc-900/60 transition-colors"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">{strategy.icon}</span>
                  <span className="text-sm font-bold">{strategy.name}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* 3-Step Guide Section */}
        <div className="px-4 py-6">
          <h2 className="text-lg font-black text-center mb-6">3 Simple Steps to Find Your Favorite Stocks</h2>
          
          <div className="space-y-4">
            {/* Step 1 */}
            <div className="bg-zinc-900/40 rounded-xl p-4 border border-zinc-800/50">
              <p className="text-xs text-zinc-500 mb-2">Step 1</p>
              <h3 className="text-sm font-bold mb-3">Select Indicators</h3>
              <div className="flex flex-wrap gap-2">
                {['EPS', 'Assets & Liabilities', 'Price', 'P/B Ratio', 'Revenue', 'Debt-to-Asset Ratio', 'Financing Cash Flow'].map((indicator, i) => (
                  <span
                    key={i}
                    className={`px-3 py-1.5 rounded-full text-xs ${
                      indicator === 'P/B Ratio' 
                        ? 'bg-zinc-800 text-white' 
                        : 'bg-zinc-950 text-zinc-400'
                    }`}
                  >
                    {indicator}
                  </span>
                ))}
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-zinc-900/40 rounded-xl p-4 border border-zinc-800/50">
              <p className="text-xs text-zinc-500 mb-2">Step 2</p>
              <h3 className="text-sm font-bold mb-3">View Results</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 bg-zinc-950 rounded-lg">
                  <div>
                    <p className="text-xs font-bold">Alibaba</p>
                    <p className="text-[10px] text-zinc-500">BABA.US</p>
                  </div>
                  <p className="text-xs font-black text-red-400">475.5 +</p>
                </div>
                <div className="flex items-center justify-between p-2 bg-zinc-950 rounded-lg">
                  <div>
                    <p className="text-xs font-bold">Tencent Holdings</p>
                    <p className="text-[10px] text-zinc-500">00700.HK</p>
                  </div>
                  <p className="text-xs font-black text-red-400">475.5 +</p>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-zinc-900/40 rounded-xl p-4 border border-zinc-800/50">
              <p className="text-xs text-zinc-500 mb-2">Step 3</p>
              <h3 className="text-sm font-bold mb-3">Save Strategy</h3>
              <button className="w-full py-2 bg-zinc-800 text-white rounded-lg text-xs font-bold mb-2">
                Save Strategy
              </button>
              <p className="text-xs text-zinc-500 text-center">Save Successful</p>
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <div className="px-4 py-6">
          <button
            onClick={handleStartCustomizing}
            className="w-full py-4 bg-white text-black rounded-xl font-black text-sm uppercase tracking-wider hover:bg-zinc-100 transition-colors"
          >
            Start Customizing Strategy
          </button>
        </div>
      </div>
    )
  }

  // Indicator Selection View
  if (viewMode === 'indicator-selection') {
    return (
      <div className="min-h-screen bg-black text-white pb-24">
        {/* Header */}
        <div className="sticky top-0 bg-black/95 backdrop-blur-md z-50 border-b border-zinc-900">
          <div className="flex items-center px-4 py-3">
            <button onClick={() => setViewMode('landing')} className="p-2 hover:bg-zinc-900 rounded-full">
              <ChevronLeft size={22} className="text-zinc-400" />
            </button>
            <h1 className="flex-1 text-center font-black text-sm uppercase tracking-widest">Smart Scan</h1>
            <button 
              onClick={() => {
                setSelectedIndicators(new Set())
                setSelectedMarket('US Stock')
              }}
              className="px-3 py-1 text-xs text-zinc-400 hover:text-white"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Market/Industry Tabs */}
        <div className="px-4 py-4 border-b border-zinc-900">
          <p className="text-xs text-zinc-500 mb-2">Range</p>
          <div className="flex gap-3">
            <button
              onClick={() => setMarketTab('market')}
              className={`flex-1 py-3 rounded-lg border-2 text-sm font-bold transition-colors ${
                marketTab === 'market'
                  ? 'border-white bg-zinc-900 text-white'
                  : 'border-zinc-800 bg-zinc-950 text-zinc-500'
              }`}
            >
              Market {marketTab === 'market' && selectedMarket}
            </button>
            <button
              onClick={() => setMarketTab('industry')}
              className={`flex-1 py-3 rounded-lg border-2 text-sm font-bold transition-colors ${
                marketTab === 'industry'
                  ? 'border-white bg-zinc-900 text-white'
                  : 'border-zinc-800 bg-zinc-950 text-zinc-500'
              }`}
            >
              Industry
            </button>
          </div>
        </div>

        {/* Indicator Categories */}
        <div className="px-4 py-4 space-y-6">
          {Object.entries(indicators).map(([category, categoryIndicators]) => (
            <div key={category}>
              <h3 className="text-xs font-black uppercase tracking-wider text-zinc-400 mb-3">
                {category === 'common' ? 'Common Indicators' : 
                 category === 'market' ? 'Market Quote Indicators' :
                 category === 'valuation' ? 'Valuation Indicators' :
                 'Profitability, Operation & Growth Indicators'}
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {categoryIndicators.map((indicator) => (
                  <button
                    key={indicator.id}
                    onClick={() => toggleIndicator(indicator.id)}
                    className={`px-3 py-2 rounded-lg text-xs font-medium text-left transition-colors ${
                      selectedIndicators.has(indicator.id)
                        ? 'bg-zinc-800 text-white border border-zinc-700'
                        : 'bg-zinc-950 text-zinc-400 border border-zinc-900'
                    }`}
                  >
                    {indicator.name}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Action Bar */}
        <div className="fixed bottom-0 left-0 right-0 bg-black border-t border-zinc-900 px-4 py-3 z-50">
          <div className="flex gap-3">
            <button className="flex-1 py-3 bg-zinc-900 border border-zinc-800 rounded-lg text-sm font-bold text-zinc-400">
              Selected Conditions {selectedIndicators.size}
            </button>
            <button
              onClick={handleViewResults}
              disabled={selectedIndicators.size === 0}
              className={`flex-1 py-3 rounded-lg text-sm font-bold transition-colors ${
                selectedIndicators.size === 0
                  ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                  : 'bg-zinc-800 text-white hover:bg-zinc-700 cursor-pointer'
              }`}
            >
              {selectedIndicators.size === 0 
                ? 'Please Add Filter Conditions' 
                : `View Results (${getMatchedCount()} matches)`}
            </button>
          </div>
        </div>

        {/* Save Toast */}
        {showSaveToast && (
          <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
            <div className="bg-zinc-800 rounded-xl p-6 border border-zinc-700">
              <div className="flex flex-col items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-emerald-500 flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-sm font-bold text-white">Save Successful</p>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  // Scan Results View
  return (
    <div className="min-h-screen bg-black text-white pb-24">
      {/* Header */}
      <div className="sticky top-0 bg-black/95 backdrop-blur-md z-50 border-b border-zinc-900">
        <div className="flex items-center px-4 py-3">
          <button onClick={() => setViewMode('indicator-selection')} className="p-2 hover:bg-zinc-900 rounded-full">
            <ChevronLeft size={22} className="text-zinc-400" />
          </button>
          <h1 className="flex-1 text-center font-black text-sm uppercase tracking-widest">Scan Results</h1>
          <button
            onClick={handleSaveStrategy}
            className="px-3 py-1 text-xs text-zinc-400 hover:text-white"
          >
            Save Strategy
          </button>
        </div>
      </div>

      {/* Filter Tags */}
      <div className="px-4 py-4 border-b border-zinc-900">
        <p className="text-xs text-zinc-500 mb-2">Filter Conditions (click to modify)</p>
        <div className="flex flex-wrap gap-2">
          {activeFilters.map((filter, index) => (
            <div
              key={index}
              className="flex items-center gap-2 px-3 py-1.5 bg-zinc-900 rounded-full border border-zinc-800"
            >
              <span className="text-xs text-zinc-300">{filter.label}: {filter.value}</span>
              <button
                onClick={() => {
                  setActiveFilters(prev => prev.filter((_, i) => i !== index))
                }}
                className="text-zinc-500 hover:text-white"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Table Header */}
      <div className="px-4 py-3 border-b border-zinc-900 bg-zinc-950/50">
        <div className="grid grid-cols-12 gap-2 text-xs font-bold text-zinc-500">
          <div className="col-span-4">Name/Ticker</div>
          <div className="col-span-2 text-right flex items-center justify-end gap-1 cursor-pointer" onClick={() => handleSort('price')}>
            Price
            <ArrowUpDown size={12} />
          </div>
          <div className="col-span-2 text-right flex items-center justify-end gap-1 cursor-pointer" onClick={() => handleSort('change')}>
            Latest Change %
            <ArrowUpDown size={12} />
          </div>
          <div className="col-span-2 text-right flex items-center justify-end gap-1 cursor-pointer" onClick={() => handleSort('revenue')}>
            Revenue
            <ArrowUpDown size={12} />
          </div>
          <div className="col-span-2"></div>
        </div>
      </div>

      {/* Results List */}
      <div className="px-4 py-2">
        {getSortedResults().length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-sm text-zinc-500 mb-2">No stocks match your criteria</p>
            <p className="text-xs text-zinc-600">Try adjusting your filters</p>
          </div>
        ) : (
          <div className="space-y-1">
            {getSortedResults().map((result) => (
              <div
                key={result.symbol}
                onClick={() => handleStockClick(result)}
                className="grid grid-cols-12 gap-2 py-3 border-b border-zinc-900 cursor-pointer hover:bg-zinc-900/30 transition-colors active:bg-zinc-900/50"
              >
                <div className="col-span-4">
                  <p className="text-sm font-bold">{result.name}</p>
                  <p className="text-xs text-blue-400">US {result.symbol}</p>
                </div>
                <div className="col-span-2 text-right">
                  <p className="text-xs font-black tabular-nums">{result.price.toFixed(2)}</p>
                </div>
                <div className="col-span-2 text-right">
                  <p className={`text-xs font-black tabular-nums ${
                    result.changePercent >= 0 ? 'text-red-400' : 'text-emerald-400'
                  }`}>
                    {result.changePercent >= 0 ? '+' : ''}{result.changePercent.toFixed(2)}%
                  </p>
                </div>
                <div className="col-span-2 text-right">
                  <p className="text-xs font-black tabular-nums">
                    {result.revenue ? `$${(result.revenue / 1000000000).toFixed(1)}B` : '-'}
                  </p>
                </div>
                <div className="col-span-2 flex items-center justify-end gap-2">
                  <Heart size={14} className="text-zinc-500" />
                  <span className="text-xs text-zinc-500">{formatWatchlistCount(result.watchlistCount)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Save Toast */}
      {showSaveToast && (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
          <div className="bg-zinc-800 rounded-xl p-6 border border-zinc-700">
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-emerald-500 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-sm font-bold text-white">Save Successful</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
