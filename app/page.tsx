'use client'

import { useState, useCallback } from 'react'
import type { ViewType, Stock, Order, Holding } from '@/lib/types'
import { mockStocks } from '@/lib/mock-data'
import { useIpoOrders } from '@/hooks/use-ipo-orders'
import { useStockOrders } from '@/hooks/use-stock-orders'

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

// Stock color mapping for avatars
const stockColors: Record<string, string> = {
  'NVDA': '#dc2626',
  'AAPL': '#78350f',
  'TSLA': '#059669',
  'MSFT': '#dc2626',
  'GOOGL': '#2563eb',
  'AMZN': '#f59e0b',
  'META': '#3b82f6',
  '00700': '#065f46',
}

// Initial holdings (pre-existing portfolio)
const initialHoldings: Holding[] = [
  {
    symbol: 'NVDA',
    name: 'NVIDIA Corp',
    quantity: 500,
    avgCost: 128.00,
    currentPrice: 135.58,
    marketValue: 67790,
    unrealizedPL: 3390,
    unrealizedPLPercent: 2.45,
    color: stockColors['NVDA'] || '#3f3f46'
  },
  {
    symbol: '00700',
    name: 'Tencent Holdings',
    quantity: 2000,
    avgCost: 390.00,
    currentPrice: 410.20,
    marketValue: 820400,
    unrealizedPL: 41020,
    unrealizedPLPercent: 5.26,
    color: stockColors['00700'] || '#3f3f46'
  }
]

export default function TradingApp() {
  const [currentView, setCurrentView] = useState<ViewType>('square')
  const [currentTab, setCurrentTab] = useState<TabType>('square')
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null)
  const [stockBadge, setStockBadge] = useState<string | undefined>(undefined)
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null)
  const [viewHistory, setViewHistory] = useState<ViewType[]>(['square'])
  const { orders, addOrder, cancelOrder } = useStockOrders()
  const [holdings, setHoldings] = useState<Holding[]>(initialHoldings)
  const { ipoOrders, addIpoOrder } = useIpoOrders()

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
        />
      )
    }

    // News Detail
    if (currentView === 'news-detail') {
      // Create article from selected news or use sample
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
        return <TradeView orders={orders} ipoOrders={ipoOrders} onCancelOrder={handleCancelOrder} />
      case 'assets':
        return <AssetsView holdings={holdings} cashBalance={cashBalance} onStockSelect={handleStockSelectBySymbol} />
      
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
        return <SquareView onNavigate={navigateTo} />
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
