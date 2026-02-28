'use client'
import { Eye, EyeOff, ChevronRight, Clock3 } from 'lucide-react'
import { useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import type { Holding } from '@/lib/types'

interface AssetsViewProps {
  holdings: Holding[]
  cashBalance: number
  onStockSelect?: (symbol: string) => void
  upcomingCorporateActionsCount?: number
  appliedActionIdsByTicker?: Record<string, string>
}

type PositionFilter = 'all' | 'us' | 'hk' | 'etfs'
type DisplayPosition = Holding & {
  market: 'US' | 'HK'
  assetCategory: 'Equity' | 'ETF'
  lastUpdatedAt: string
}

const BG_OLED = '#020617'
const GLASS_BG = 'rgba(15, 23, 42, 0.65)'
const GLASS_BORDER = 'rgba(248, 250, 252, 0.08)'
const glassSurface = 'rounded-xl border backdrop-blur-xl'

const supplementalPositions: DisplayPosition[] = [
  createMockPosition('AAPL', 'Apple Inc', 140, 173.2, 178.23, '#78350f', 'US', 'Equity', 18),
  createMockPosition('MSFT', 'Microsoft Corp', 72, 364.4, 378.92, '#dc2626', 'US', 'Equity', 42),
  createMockPosition('AMZN', 'Amazon.com Inc', 118, 169.8, 178.25, '#f59e0b', 'US', 'Equity', 26),
  createMockPosition('TSLA', 'Tesla Inc', 84, 255.7, 248.5, '#059669', 'US', 'Equity', 31),
  createMockPosition('META', 'Meta Platforms', 28, 489.1, 505.12, '#3b82f6', 'US', 'Equity', 9),
  createMockPosition('TSM', 'Semiconductor Leaders ETF', 96, 138.4, 142.56, '#2563eb', 'US', 'ETF', 12),
  createMockPosition('ASML', 'Global Lithography ETF', 12, 865.7, 892.34, '#a855f7', 'US', 'ETF', 7),
  createMockPosition('0700', 'Tencent Holdings', 860, 395.4, 410.2, '#065f46', 'HK', 'Equity', 15),
  createMockPosition('9988', 'Alibaba Group', 1200, 80.5, 84.32, '#f97316', 'HK', 'Equity', 21),
]

function createMockPosition(
  symbol: string,
  name: string,
  quantity: number,
  avgCost: number,
  currentPrice: number,
  color: string,
  market: 'US' | 'HK',
  assetCategory: 'Equity' | 'ETF',
  minutesAgo: number
): DisplayPosition {
  const marketValue = Number((quantity * currentPrice).toFixed(2))
  const unrealizedPL = Number((marketValue - quantity * avgCost).toFixed(2))
  const unrealizedPLPercent = quantity > 0 && avgCost > 0 ? Number(((unrealizedPL / (quantity * avgCost)) * 100).toFixed(2)) : 0

  return {
    symbol,
    name,
    quantity,
    avgCost,
    currentPrice,
    marketValue,
    unrealizedPL,
    unrealizedPLPercent,
    color,
    market,
    assetCategory,
    lastUpdatedAt: new Date(Date.now() - minutesAgo * 60 * 1000).toISOString(),
  }
}

const formatCurrency = (value: number, digits = 2) =>
  `$${value.toLocaleString('en-US', { minimumFractionDigits: digits, maximumFractionDigits: digits })}`

const formatSignedCurrency = (value: number, digits = 2) =>
  `${value >= 0 ? '+' : '-'}${formatCurrency(Math.abs(value), digits)}`

function getRegion(symbol: string) {
  return /^\d+$/.test(symbol) ? 'HK' : 'US'
}

function getDayPnl(holding: Holding) {
  const directionalSeed = holding.symbol.charCodeAt(0) % 7
  const baseMove = holding.marketValue * (0.0025 + directionalSeed * 0.0007)
  const signedMove = holding.unrealizedPL >= 0 ? baseMove : -baseMove * 0.8
  const percent = holding.marketValue > 0 ? (signedMove / holding.marketValue) * 100 : 0

  return {
    value: Number(signedMove.toFixed(2)),
    percent: Number(percent.toFixed(2)),
  }
}

function normalizeRealHolding(holding: Holding): DisplayPosition {
  return {
    ...holding,
    market: getRegion(holding.symbol) === 'HK' ? 'HK' : 'US',
    assetCategory: ['SPY', 'QQQ', 'VTI'].includes(holding.symbol) ? 'ETF' : 'Equity',
    lastUpdatedAt: new Date(Date.now() - (holding.symbol.charCodeAt(0) % 40 + 3) * 60 * 1000).toISOString(),
  }
}

export function AssetsView({
  holdings,
  cashBalance,
  upcomingCorporateActionsCount = 0,
  appliedActionIdsByTicker = {},
}: AssetsViewProps) {
  const [showBalance, setShowBalance] = useState(true)
  const [activeFilter, setActiveFilter] = useState<PositionFilter>('all')
  const router = useRouter()

  const displayPositions = useMemo(() => {
    const liveSymbols = new Set(holdings.map((holding) => holding.symbol))
    const real = holdings.map(normalizeRealHolding)
    const synthetic = supplementalPositions.filter((position) => !liveSymbols.has(position.symbol))

    return [...real, ...synthetic].sort((a, b) => b.marketValue - a.marketValue)
  }, [holdings])

  const filteredPositions = useMemo(() => {
    switch (activeFilter) {
      case 'us':
        return displayPositions.filter((position) => position.market === 'US' && position.assetCategory === 'Equity')
      case 'hk':
        return displayPositions.filter((position) => position.market === 'HK')
      case 'etfs':
        return displayPositions.filter((position) => position.assetCategory === 'ETF')
      default:
        return displayPositions
    }
  }, [activeFilter, displayPositions])

  const totalEquity = displayPositions.reduce((sum, holding) => sum + holding.marketValue, 0)
  const earnValue = 187330.23
  const netLiquidationValue = totalEquity + cashBalance + earnValue
  const totalUnrealizedPnl = displayPositions.reduce((sum, holding) => sum + holding.unrealizedPL, 0)
  const dayPnl = displayPositions.reduce((sum, holding) => sum + getDayPnl(holding).value, 0)
  const dayPnlPercent = netLiquidationValue > 0 ? (dayPnl / netLiquidationValue) * 100 : 0

  const settledCash = cashBalance * 0.82
  const unsettledFunds = Math.max(cashBalance - settledCash, 0)
  const estimatedMarginUsed = totalEquity * 0.11
  const buyingPower = cashBalance + Math.max(totalEquity * 0.35 - estimatedMarginUsed, 0)

  const allocation = {
    usEquities: displayPositions
      .filter((position) => position.market === 'US' && position.assetCategory === 'Equity')
      .reduce((sum, position) => sum + position.marketValue, 0),
    hkEquities: displayPositions
      .filter((position) => position.market === 'HK')
      .reduce((sum, position) => sum + position.marketValue, 0),
    etfs: displayPositions
      .filter((position) => position.assetCategory === 'ETF')
      .reduce((sum, position) => sum + position.marketValue, 0),
    cash: cashBalance,
  }

  const allocationTotal = allocation.usEquities + allocation.hkEquities + allocation.etfs + allocation.cash

  const handlePositionClick = (symbol: string) => {
    router.push(`/stock/${symbol}`)
  }

  return (
    <div className="min-h-screen text-white pb-24" style={{ backgroundColor: BG_OLED }}>
      <header
        className="sticky top-0 z-40 px-4 pt-4 pb-3 border-b border-white/[0.08] backdrop-blur-xl"
        style={{ backgroundColor: `${BG_OLED}e6` }}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-zinc-500">Brokerage Account</p>
            <h1 className="mt-2 text-4xl font-black italic tracking-tight">ASSETS</h1>
            <p className="mt-1 text-[11px] font-medium text-zinc-500 uppercase tracking-[0.18em]">Portfolio overview and positions</p>
          </div>
          <button
            type="button"
            onClick={() => setShowBalance(!showBalance)}
            className="w-11 h-11 rounded-full bg-zinc-900/60 flex items-center justify-center"
          >
            {showBalance ? <Eye size={18} className="text-zinc-400" /> : <EyeOff size={18} className="text-zinc-400" />}
          </button>
        </div>
      </header>

      <div className="px-4 pt-4 space-y-4">
        <section
          className={`${glassSurface} p-4`}
          style={{ backgroundColor: GLASS_BG, borderColor: GLASS_BORDER }}
        >
          <div className="flex items-end justify-between gap-4 border-b border-white/[0.08] pb-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-zinc-500">Net Liquidation Value</p>
              <p className="mt-2 text-[36px] leading-none font-black tabular-nums tracking-tight text-white">
                {showBalance ? formatCurrency(netLiquidationValue) : '****'}
              </p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-zinc-500">Day P&amp;L</p>
              <p className={`mt-2 text-lg font-black tabular-nums ${dayPnl >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                {showBalance ? formatSignedCurrency(dayPnl) : '****'}
              </p>
              <p className={`text-[11px] font-bold ${dayPnl >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                {showBalance ? `${dayPnlPercent >= 0 ? '+' : ''}${dayPnlPercent.toFixed(2)}%` : '****'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-5 gap-y-4 pt-4">
            <SummaryMetric label="Total Equity" value={showBalance ? formatCurrency(totalEquity) : '****'} />
            <SummaryMetric label="Cash Balance" value={showBalance ? formatCurrency(cashBalance) : '****'} />
            <SummaryMetric label="Buying Power" value={showBalance ? formatCurrency(buyingPower) : '****'} />
            <SummaryMetric
              label="Total Unrealized P&L"
              value={showBalance ? formatSignedCurrency(totalUnrealizedPnl) : '****'}
              accent={totalUnrealizedPnl >= 0 ? 'text-emerald-400' : 'text-red-400'}
            />
            <SummaryMetric label="Settled Cash" value={showBalance ? formatCurrency(settledCash) : '****'} />
            <SummaryMetric
              label="P&L on Equity"
              value={showBalance && totalEquity > 0 ? `${totalUnrealizedPnl >= 0 ? '+' : ''}${((totalUnrealizedPnl / totalEquity) * 100).toFixed(2)}%` : '****'}
              accent={totalUnrealizedPnl >= 0 ? 'text-emerald-400' : 'text-red-400'}
            />
          </div>
        </section>

        <section
          className={`${glassSurface} p-4`}
          style={{ backgroundColor: GLASS_BG, borderColor: GLASS_BORDER }}
        >
          <div className="grid grid-cols-2 gap-x-4 gap-y-4">
            <PanelMetric label="Available Cash" value={showBalance ? formatCurrency(cashBalance) : '****'} />
            <PanelMetric label="Settled Cash" value={showBalance ? formatCurrency(settledCash) : '****'} />
            <PanelMetric label="Unsettled Funds" value={showBalance ? formatCurrency(unsettledFunds) : '****'} />
            <PanelMetric label="Est. Margin Used" value={showBalance ? formatCurrency(estimatedMarginUsed) : '****'} />
          </div>
        </section>

        <button
          type="button"
          onClick={() => router.push('/corporate-actions')}
          className={`${glassSurface} w-full p-4 flex items-center justify-between text-left`}
          style={{ backgroundColor: GLASS_BG, borderColor: GLASS_BORDER }}
        >
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-zinc-500">Corporate Actions</p>
            <p className="mt-1 text-sm font-black text-white">Splits, reverse splits, and audit trail</p>
          </div>
          <div className="flex items-center gap-3">
            {upcomingCorporateActionsCount > 0 && (
              <span className="px-2.5 py-1 rounded-full bg-amber-500/15 text-[9px] font-black uppercase tracking-widest text-amber-300">
                {upcomingCorporateActionsCount} upcoming
              </span>
            )}
            <ChevronRight size={16} className="text-zinc-600" />
          </div>
        </button>

        <section
          className={`${glassSurface} p-4`}
          style={{ backgroundColor: GLASS_BG, borderColor: GLASS_BORDER }}
        >
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-2xl font-black italic tracking-tight">POSITIONS</h2>
              <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">
                {filteredPositions.length} positions · sorted by market value
              </p>
            </div>
            <div className="flex flex-wrap justify-end gap-2">
              <FilterChip label="All" active={activeFilter === 'all'} onClick={() => setActiveFilter('all')} />
              <FilterChip label="US" active={activeFilter === 'us'} onClick={() => setActiveFilter('us')} />
              <FilterChip label="HK" active={activeFilter === 'hk'} onClick={() => setActiveFilter('hk')} />
              <FilterChip label="ETFs" active={activeFilter === 'etfs'} onClick={() => setActiveFilter('etfs')} />
            </div>
          </div>

          <div className="mt-4 space-y-2">
            {filteredPositions.map((position) => {
              const allocationWeight = totalEquity > 0 ? (position.marketValue / totalEquity) * 100 : 0
              const mockedDay = getDayPnl(position)
              const actionId = appliedActionIdsByTicker[position.symbol]

              return (
                <button
                  key={position.symbol}
                  type="button"
                  onClick={() => handlePositionClick(position.symbol)}
                  className="w-full rounded-xl border border-white/[0.06] bg-white/[0.02] px-3 py-3 text-left hover:bg-white/[0.04] transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-base font-black text-white">{position.symbol}</span>
                        <span className="px-2 py-0.5 rounded-full bg-white/5 text-[9px] font-black uppercase tracking-widest text-zinc-400">
                          {position.assetCategory === 'ETF' ? 'ETF' : position.market}
                        </span>
                        {actionId && (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-[9px] font-black uppercase tracking-widest text-emerald-300">
                            Split adjusted
                          </span>
                        )}
                      </div>
                      <p className="mt-1 text-[11px] font-medium text-zinc-500 uppercase tracking-wide">
                        {position.name}
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <p className="text-base font-black tabular-nums text-white">
                        {showBalance ? formatCurrency(position.marketValue, 0) : '****'}
                      </p>
                      <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                        {allocationWeight.toFixed(1)}% allocation
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 grid grid-cols-2 gap-x-3 gap-y-3 sm:grid-cols-4">
                    <MetricStack label="Quantity" value={position.quantity.toLocaleString('en-US')} />
                    <MetricStack label="Average Cost" value={showBalance ? formatCurrency(position.avgCost) : '****'} />
                    <MetricStack label="Last Price" value={showBalance ? formatCurrency(position.currentPrice) : '****'} />
                    <MetricStack label="Last Update" value={new Date(position.lastUpdatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} icon={<Clock3 size={11} className="text-zinc-600" />} />
                  </div>

                  <div className="mt-3 flex items-end justify-between gap-4">
                    <div>
                      <p className="text-[9px] font-bold uppercase tracking-widest text-zinc-600">Unrealized P&amp;L</p>
                      <p className={`mt-1 text-sm font-black tabular-nums ${position.unrealizedPL >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                        {showBalance ? formatSignedCurrency(position.unrealizedPL, 0) : '****'}
                      </p>
                      <p className={`text-[10px] font-bold ${position.unrealizedPL >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                        {showBalance ? `${position.unrealizedPL >= 0 ? '+' : ''}${position.unrealizedPLPercent.toFixed(2)}%` : '****'}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-[9px] font-bold uppercase tracking-widest text-zinc-600">Day P&amp;L</p>
                      <p className={`mt-1 text-sm font-black tabular-nums ${mockedDay.value >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                        {showBalance ? formatSignedCurrency(mockedDay.value, 0) : '****'}
                      </p>
                      <p className={`text-[10px] font-bold ${mockedDay.value >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                        {showBalance ? `${mockedDay.percent >= 0 ? '+' : ''}${mockedDay.percent.toFixed(2)}%` : '****'}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3">
                    <div className="flex items-center justify-between">
                      <p className="text-[9px] font-bold uppercase tracking-widest text-zinc-600">Allocation Weight</p>
                      <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">{allocationWeight.toFixed(1)}%</p>
                    </div>
                    <div className="mt-2 h-1.5 rounded-full bg-white/[0.05] overflow-hidden">
                      <div
                        className="h-full rounded-full bg-blue-400"
                        style={{ width: `${Math.max(6, allocationWeight)}%` }}
                      />
                    </div>
                  </div>

                  {actionId && (
                    <div className="mt-3 flex justify-end">
                      <span className="text-[10px] font-black uppercase tracking-widest text-zinc-300">
                        View corporate action on Assets overview
                      </span>
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        </section>

        <section
          className={`${glassSurface} p-4`}
          style={{ backgroundColor: GLASS_BG, borderColor: GLASS_BORDER }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-black italic tracking-tight">ALLOCATION</h2>
              <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">Account breakdown</p>
            </div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-600">US / HK / ETF / Cash</p>
          </div>

          <div className="mt-4 space-y-4">
            <AllocationRow label="US Equities" value={allocation.usEquities} total={allocationTotal} color="bg-blue-400" showBalance={showBalance} />
            <AllocationRow label="HK Equities" value={allocation.hkEquities} total={allocationTotal} color="bg-amber-400" showBalance={showBalance} />
            <AllocationRow label="ETFs" value={allocation.etfs} total={allocationTotal} color="bg-violet-400" showBalance={showBalance} />
            <AllocationRow label="Cash" value={allocation.cash} total={allocationTotal} color="bg-emerald-400" showBalance={showBalance} />
          </div>
        </section>
      </div>
    </div>
  )
}

function SummaryMetric({
  label,
  value,
  accent = 'text-white',
}: {
  label: string
  value: string
  accent?: string
}) {
  return (
    <div>
      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">{label}</p>
      <p className={`mt-1 text-sm font-black tabular-nums ${accent}`}>{value}</p>
    </div>
  )
}

function PanelMetric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">{label}</p>
      <p className="mt-1 text-sm font-black tabular-nums text-white">{value}</p>
    </div>
  )
}

function MetricStack({
  label,
  value,
  icon,
}: {
  label: string
  value: string
  icon?: ReactNode
}) {
  return (
    <div>
      <p className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-widest text-zinc-600">
        {icon}
        <span>{label}</span>
      </p>
      <p className="mt-1 text-sm font-black tabular-nums text-white">{value}</p>
    </div>
  )
}

function FilterChip({
  label,
  active,
  onClick,
}: {
  label: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-3 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
        active ? 'bg-white text-black' : 'bg-white/[0.04] text-zinc-400 border border-white/[0.06]'
      }`}
    >
      {label}
    </button>
  )
}

function AllocationRow({
  label,
  value,
  total,
  color,
  showBalance,
}: {
  label: string
  value: number
  total: number
  color: string
  showBalance: boolean
}) {
  const weight = total > 0 ? (value / total) * 100 : 0

  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-black text-white">{label}</p>
        <div className="text-right">
          <p className="text-sm font-black tabular-nums text-white">
            {showBalance ? formatCurrency(value, 0) : '****'}
          </p>
          <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">{weight.toFixed(1)}%</p>
        </div>
      </div>
      <div className="mt-2 h-2 rounded-full bg-white/[0.05] overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${Math.max(weight, 6)}%` }} />
      </div>
    </div>
  )
}
