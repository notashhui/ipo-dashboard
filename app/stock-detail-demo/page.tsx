'use client'

import { useState } from 'react'
import { StockDetail } from '@/components/trading/stock-detail'
import type { Stock, Order } from '@/lib/types'

const mockStock: Stock = {
  symbol: 'NVDA',
  name: 'NVIDIA Corp',
  price: 62.34,
  change: 2.91,
  changePercent: 4.9,
  volume: '72.45M',
  marketCap: '$1.54T'
}

export default function StockDetailDemoPage() {
  const [viewportType, setViewportType] = useState<'mobile' | 'tablet' | 'desktop'>('mobile')

  const handleBack = () => {
    console.log('Back button clicked')
  }

  const handleOrderSubmit = (order: Order) => {
    console.log('Order submitted:', order)
  }

  const handleNavigateToTrade = () => {
    console.log('Navigate to trade')
  }

  const getContainerClass = () => {
    switch (viewportType) {
      case 'mobile':
        return 'max-w-[430px]'
      case 'tablet':
        return 'max-w-2xl'
      case 'desktop':
        return 'w-full'
      default:
        return 'max-w-[430px]'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 py-8 px-4">
      {/* Control Panel */}
      <div className="mb-12 flex justify-center">
        <div className="flex gap-4 bg-slate-800/50 backdrop-blur-sm p-4 rounded-xl border border-slate-700/50">
          <button
            onClick={() => setViewportType('mobile')}
            className={`px-6 py-2.5 rounded-lg font-bold text-sm transition-all ${
              viewportType === 'mobile'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            📱 Mobile (430px)
          </button>
          <button
            onClick={() => setViewportType('tablet')}
            className={`px-6 py-2.5 rounded-lg font-bold text-sm transition-all ${
              viewportType === 'tablet'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            📱 Tablet (768px)
          </button>
          <button
            onClick={() => setViewportType('desktop')}
            className={`px-6 py-2.5 rounded-lg font-bold text-sm transition-all ${
              viewportType === 'desktop'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            💻 Desktop
          </button>
        </div>
      </div>

      {/* Viewport Display */}
      <div className="flex justify-center">
        <div className={`${getContainerClass()} transition-all duration-300`}>
          {/* Frame/Bezel for better visualization */}
          {viewportType === 'mobile' && (
            <div className="bg-black rounded-[40px] shadow-2xl overflow-hidden border-8 border-slate-800">
              <div className="bg-black rounded-[32px] overflow-hidden">
                <StockDetail
                  stock={mockStock}
                  badge="Hot"
                  badgeColor="from-orange-600 to-red-600"
                  onBack={handleBack}
                  onOrderSubmit={handleOrderSubmit}
                  onNavigateToTrade={handleNavigateToTrade}
                  availableBalance={1284560}
                />
              </div>
            </div>
          )}

          {viewportType === 'tablet' && (
            <div className="bg-slate-900 rounded-2xl shadow-2xl overflow-hidden border-2 border-slate-700">
              <StockDetail
                stock={mockStock}
                badge="Hot"
                badgeColor="from-orange-600 to-red-600"
                onBack={handleBack}
                onOrderSubmit={handleOrderSubmit}
                onNavigateToTrade={handleNavigateToTrade}
                availableBalance={1284560}
              />
            </div>
          )}

          {viewportType === 'desktop' && (
            <div className="bg-slate-900 rounded-2xl shadow-2xl overflow-hidden border-2 border-slate-700">
              <StockDetail
                stock={mockStock}
                badge="Hot"
                badgeColor="from-orange-600 to-red-600"
                onBack={handleBack}
                onOrderSubmit={handleOrderSubmit}
                onNavigateToTrade={handleNavigateToTrade}
                availableBalance={1284560}
              />
            </div>
          )}
        </div>
      </div>

      {/* Info Section */}
      <div className="mt-16 max-w-2xl mx-auto">
        <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-xl p-8">
          <h2 className="text-2xl font-bold text-white mb-6">组件信息</h2>
          
          <div className="space-y-4 text-slate-300">
            <div>
              <h3 className="font-bold text-white mb-2">当前视图模式：</h3>
              <p className="text-sm bg-slate-900/50 px-3 py-2 rounded border border-slate-700">
                {viewportType === 'mobile' && '📱 移动端 (430px) - 专为手机优化的竖屏布局'}
                {viewportType === 'tablet' && '📱 平板 (768px) - 中等屏幕视图'}
                {viewportType === 'desktop' && '💻 桌面 - 全屏宽度视图'}
              </p>
            </div>

            <div>
              <h3 className="font-bold text-white mb-2">移动端 (Mobile) 特性：</h3>
              <ul className="text-sm space-y-2 list-disc list-inside">
                <li>固定顶部导航栏 - 股票代码、名称和操作按钮</li>
                <li>大号价格显示 - 易于查看当前股价 (62.34)</li>
                <li>标签页导航 - Quote、Overview、Financials</li>
                <li>4列格栅指标卡 - 24个关键指标紧凑布局</li>
                <li>K线图表 - 显示5日、日线、周线等多个时间周期</li>
                <li>资金流向弧形图 - 270度圆弧展示资金进出</li>
                <li>固定底部交易栏 - "买入"和"卖出"按钮始终可见</li>
                <li>AI机器人浮动按钮 - 右下角悬浮功能按钮</li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-white mb-2">响应式设计要点：</h3>
              <ul className="text-sm space-y-2 list-disc list-inside">
                <li>深黑色背景 (bg-black) - 减少眼睛疲劳</li>
                <li>紧凑的内边距 (px-4, py-6) - 充分利用小屏幕空间</li>
                <li>小字体大小 (text-xs, text-[10px]) - 信息密度高</li>
                <li>滚动友好的布局 - pb-32 留出底部空间</li>
                <li>触摸友好的按钮 - 足够大的点击区域</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
