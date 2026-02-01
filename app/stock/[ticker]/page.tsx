'use client'

import { useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { getStockByTicker } from '@/lib/get-stock-by-ticker'
import { StockDetail } from '@/components/trading/stock-detail'

const ROUTE_AVAILABLE_BALANCE = 1284560

export default function StockDetailPage() {
  const params = useParams()
  const router = useRouter()
  const ticker = typeof params.ticker === 'string' ? params.ticker : ''
  const stock = getStockByTicker(ticker)

  // 强制重置为移动端布局 - 每次进入页面都执行
  useEffect(() => {
    document.body.style.cssText = 'width: 100%; max-width: 100vw; overflow-x: hidden; margin: 0; padding: 0;'
    document.documentElement.style.cssText = 'width: 100%; max-width: 100vw; overflow-x: hidden;'

    const root = document.getElementById('root')
    if (root) root.style.cssText = 'width: 100%; max-width: 100vw; overflow-x: hidden;'

    const app = document.querySelector('.App')
    if (app) app.style.cssText = 'width: 100%; max-width: 100vw; overflow-x: hidden;'

    const nextRoot = document.getElementById('__next')
    if (nextRoot) nextRoot.style.cssText = 'width: 100%; max-width: 100vw; overflow-x: hidden;'

    const fixWideElements = () => {
      document.querySelectorAll('div').forEach((div) => {
        if (div.offsetWidth > window.innerWidth) {
          div.style.maxWidth = '100%'
          div.style.width = '100%'
        }
      })
    }
    fixWideElements()
    setTimeout(fixWideElements, 100)
    setTimeout(fixWideElements, 500)

    return () => {
      document.body.style.cssText = ''
      document.documentElement.style.cssText = ''
      if (root) root.style.cssText = ''
      if (app) app.style.cssText = ''
      if (nextRoot) nextRoot.style.cssText = ''
    }
  }, [])

  // 处理返回导航 - 优先使用 router.back()，如果失败则导航到首页
  const handleGoBack = () => {
    // 尝试返回到上一页
    router.back()
    // 设置一个超时时间，如果没有返回，则导航到首页
    setTimeout(() => {
      if (window.location.pathname === `/stock/${ticker}`) {
        router.push('/')
      }
    }, 100)
  }

  if (!stock) {
    return (
      <div className="w-full min-w-0 max-w-full overflow-x-hidden min-h-screen bg-black text-white flex flex-col items-center justify-center px-4 md:max-w-[430px] md:mx-auto">
        <p className="text-zinc-500 text-sm">Stock not found</p>
        <button
          onClick={() => router.push('/')}
          className="mt-4 text-amber-500 text-sm font-bold uppercase"
        >
          Back to Home
        </button>
      </div>
    )
  }

  return (
    <div
      className="stock-detail-page w-full min-w-0 max-w-full overflow-x-hidden md:max-w-[430px] md:mx-auto min-h-screen bg-black"
      style={{ width: '100%', maxWidth: '100%', overflowX: 'hidden' }}
    >
      <StockDetail
        stock={stock}
        onBack={handleGoBack}
        onOrderSubmit={undefined}
        onNavigateToTrade={() => router.push('/')}
        availableBalance={ROUTE_AVAILABLE_BALANCE}
      />
    </div>
  )
}
