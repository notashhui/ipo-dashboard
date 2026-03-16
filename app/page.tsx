'use client'

import { useState, useCallback, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import type { ViewType, Stock, Order } from '@/lib/types'
import { mockStocks } from '@/lib/mock-data'
import { useIpoOrders } from '@/hooks/use-ipo-orders'
import { useStockOrders } from '@/hooks/use-stock-orders'
import { useHoldings } from '@/hooks/use-holdings'
import { useCorporateActions } from '@/hooks/use-corporate-actions'

// Navigation
import { BottomNav, type TabType } from '@/components/trading/bottom-nav'

// Main Views
import { SquareView } from '@/components/trading/square-view'
import { MarketsDashboard } from '@/components/trading/markets-dashboard'
import { TradeView } from '@/components/trading/trade-view'
import { AssetsView } from '@/components/trading/assets-view'
import { StockDetail } from '@/components/trading/stock-detail'

// Modules
import { IPOModule } from '@/components/trading/ipo-module'
import { DividendModule } from '@/components/trading/dividend-module'
import { MarketTempModule } from '@/components/trading/market-temp-module'
import { EarningsModule } from '@/components/trading/earnings-module'
import { MarketPulseModule } from '@/components/trading/market-pulse-module'
import { SignalsModule } from '@/components/trading/signals-module'
import { RankingsModule } from '@/components/trading/rankings-module'
import { IndustryChainModule } from '@/components/trading/industry-chain-module'
import { NewsDetail, sampleNewsArticle } from '@/components/trading/news-detail'
import type { NewsItem } from '@/components/trading/global-news-center'

function TradingApp() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [currentView, setCurrentView] = useState<ViewType>('square')
  const [currentTab, setCurrentTab] = useState<TabType>('square')
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null)
  const [stockBadge, setStockBadge] = useState<string | undefined>(undefined)
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null)
  const [viewHistory, setViewHistory] = useState<ViewType[]>(['square'])
  const [optionsTicker, setOptionsTicker] = useState<string | undefined>(undefined)
  const { orders, addOrder, cancelOrder } = useStockOrders()
  const { holdings } = useHoldings()
  const { ipoOrders, addIpoOrder } = useIpoOrders()
  const { actions, getUpcomingActionForTicker, getAppliedActionForTickerToday } = useCorporateActions()

  // Read URL search params and navigate accordingly
  useEffect(() => {
    const tab = searchParams.get('tab')
    const assetClass = searchParams.get('assetClass')
    const ticker = searchParams.get('ticker')
    if (tab === 'trade') {
      setCurrentTab('trade')
      setCurrentView('trade')
      setViewHistory(['trade'])
      setSelectedStock(null)
      setStockBadge(undefined)
      setOptionsTicker(assetClass === 'options' ? (ticker ?? undefined) : undefined)
      router.replace('/')
    }
  }, [searchParams, router])

  // Calculate cash based on initial total minus securities and earn
  const initialTotal = 1284560
  const earnValue = 187330.23
  const securitiesValue = holdings.reduce((sum, h) => sum + h.marketValue, 0)
  const [cashBalance, setCashBalance] = useState(initialTotal - securitiesValue - earnValue)

  const isOpenBuyOrder = useCallback((order: Order) => {
    return order.type === 'buy' && ['pending', 'submitted', 'partially_filled'].includes(order.status)
  }, [])

  const handleOrderSubmit = useCallback((order: Order) => {
    addOrder(order)

    if (isOpenBuyOrder(order)) {
      setCashBalance(prev => prev - order.total)
    }
  }, [addOrder, isOpenBuyOrder])

  const handleCancelOrder = useCallback((orderId: string) => {
    const order = orders.find(o => o.id === orderId)
    cancelOrder(orderId)

    if (order && isOpenBuyOrder(order)) {
      const remainingAmount = order.execution
        ? order.execution.remainingQuantity * order.price
        : order.total

      setCashBalance(prev => prev + remainingAmount)
    }
  }, [cancelOrder, isOpenBuyOrder, orders])

  const handleNavigateToTrade = useCallback(() => {
    setCurrentTab('trade')
    setCurrentView('trade')
    setViewHistory(['trade'])
    setSelectedStock(null)
    setStockBadge(undefined)
  }, [])

  const navigateTo = useCallback((view: ViewType) => {
    setViewHistory(prev => [...prev, view])
    setCurrentView(view)
  }, [])

  const goBack = useCallback(() => {
    if (viewHistory.length > 1) {
      const newHistory = viewHistory.slice(0, -1)
      setViewHistory(newHistory)
      setCurrentView(newHistory[newHistory.length - 1])
      setSelectedStock(null)
      setStockBadge(undefined)
    }
  }, [viewHistory])

  const handleStockSelect = useCallback((stock: Stock, badge?: string) => {
    setSelectedStock(stock)
    setStockBadge(badge)
    navigateTo('stock-detail')
  }, [navigateTo])

  const handleStockSelectBySymbol = useCallback((symbol: string) => {
    const stock = mockStocks.find(s => s.symbol === symbol)
    if (stock) {
      handleStockSelect(stock)
    }
  }, [handleStockSelect])

  const handleNewsSelect = useCallback((news: NewsItem) => {
    setSelectedNews(news)
    navigateTo('news-detail')
  }, [navigateTo])

  const handleTabChange = useCallback((tab: TabType) => {
    setCurrentTab(tab)
    setCurrentView(tab)
    setViewHistory([tab])
    setSelectedStock(null)
    setStockBadge(undefined)
  }, [])

  const availableBalance = cashBalance

  const renderView = () => {
    // Stock Detail - Universal Page
    if (currentView === 'stock-detail' && selectedStock) {
      return (
        <StockDetail 
          stock={selectedStock} 
          badge={stockBadge}
          onBack={goBack}
          onOrderSubmit={handleOrderSubmit}
          onNavigateToTrade={handleNavigateToTrade}
          availableBalance={availableBalance}
          upcomingCorporateAction={getUpcomingActionForTicker(selectedStock.symbol)}
        />
      )
    }

    if (currentView === 'news-detail') {
      const article = selectedNews ? {
        id: selectedNews.id,
        source: selectedNews.source,
        timestamp: new Date().toISOString().split('T')[0] + ' ' + selectedNews.time,
        headline: selectedNews.headline,
        body: selectedNews.body || sampleNewsArticle.body,
        relatedSecurities: sampleNewsArticle.relatedSecurities,
        disclaimer: sampleNewsArticle.disclaimer
      } : sampleNewsArticle

      return (
        <NewsDetail 
          article={article}
          onBack={goBack}
          onStockSelect={handleStockSelect}
        />
      )
    }

    // Main Tabs
    switch (currentView) {
      case 'square':
        return <SquareView onNavigate={navigateTo} onNewsSelect={handleNewsSelect} />
      case 'markets':
        return <MarketsDashboard onNavigate={navigateTo} onStockSelect={handleStockSelect} />
      case 'trade':
        return <TradeView orders={orders} ipoOrders={ipoOrders} onCancelOrder={handleCancelOrder} optionsTicker={optionsTicker} onOrderSubmit={handleOrderSubmit} />
      case 'assets':
        return (
          <AssetsView
            holdings={holdings}
            cashBalance={cashBalance}
            onStockSelect={handleStockSelectBySymbol}
            upcomingCorporateActionsCount={actions.filter((action) => action.status === 'upcoming').length}
            appliedActionIdsByTicker={Object.fromEntries(
              holdings
                .map((holding) => [holding.symbol, getAppliedActionForTickerToday(holding.symbol)?.id])
                .filter((entry): entry is [string, string] => Boolean(entry[1]))
            )}
          />
        )
      
      // Module Views
      case 'ipo':
        return (
          <IPOModule 
            onBack={goBack} 
            onStockSelect={handleStockSelect}
            ipoOrders={ipoOrders}
            onIpoOrderSubmit={addIpoOrder}
            onNavigateToTrade={handleNavigateToTrade}
            availableBalance={availableBalance}
          />
        )
      case 'dividend':
        return (
          <DividendModule 
            onBack={goBack} 
            onStockSelect={handleStockSelect}
            onOrderSubmit={handleOrderSubmit}
            onNavigateToTrade={handleNavigateToTrade}
            availableBalance={availableBalance}
          />
        )
      case 'market-temp':
        return <MarketTempModule onBack={goBack} onStockSelect={handleStockSelect} />
      case 'earnings':
        return (
          <EarningsModule 
            onBack={goBack} 
            onStockSelect={handleStockSelect}
            onOrderSubmit={handleOrderSubmit}
            onNavigateToTrade={handleNavigateToTrade}
            availableBalance={availableBalance}
          />
        )
      case 'fund-holdings':
        return <MarketPulseModule onBack={goBack} onStockSelect={handleStockSelect} />
      case 'signals':
        return (
          <SignalsModule 
            onBack={goBack} 
            onStockSelect={handleStockSelect}
            onOrderSubmit={handleOrderSubmit}
            onNavigateToTrade={handleNavigateToTrade}
            availableBalance={availableBalance}
          />
        )
      case 'rankings':
        return <RankingsModule onBack={goBack} onStockSelect={handleStockSelect} />
      case 'industry-chain':
        return <IndustryChainModule onBack={goBack} onStockSelect={handleStockSelect} />
      
      default:
        return <SquareView onNavigate={navigateTo} onNewsSelect={handleNewsSelect} />
    }
  }

  // Don't show bottom nav on detail pages
  const showBottomNav = currentView !== 'stock-detail' && currentView !== 'news-detail'

  return (
    <div className="w-full max-w-[430px] mx-auto min-h-screen text-white" style={{ backgroundColor: '#020617' }}>
      {renderView()}
      {showBottomNav && (
        <BottomNav currentTab={currentTab} onTabChange={handleTabChange} />
      )}
    </div>
  )
}

export default function Page() {
  return (
    <Suspense fallback={null}>
      <TradingApp />
    </Suspense>
  )
}
