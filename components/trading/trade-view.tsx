'use client'

import { useState, useEffect, useMemo } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { Search, Bell, Filter, Clock, Trash2, TrendingUp, ShieldCheck, ChevronRight, ArrowLeft, ShieldAlert, MoreHorizontal } from 'lucide-react'
import type { IpoOrder, OptionChainQuote, OptionsOrder, OptionsOrderSide, OptionsPriceType, Order, Stock } from '@/lib/types'
import { IpoOrderCard } from './ipo-order-card'
import { getOptionsChain, getSupportedOptionsUnderlyings, formatOptionContractLabel } from '@/lib/options'
import { useOptionsOrders } from '@/hooks/use-options-orders'

interface TradeViewProps {
  orders?: Order[]
  ipoOrders?: IpoOrder[]
  onCancelOrder?: (orderId: string) => void
}

type AssetClassTab = 'stocks' | 'options' | 'structured'
type TicketStep = 'ticket' | 'review'

const sideOptions: OptionsOrderSide[] = [
  'buy_to_open',
  'sell_to_open',
  'buy_to_close',
  'sell_to_close',
]

const formatCurrency = (value: number) =>
  `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

const generateOptionsRefId = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let result = 'OP'
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

function calculateOptionOrderMetrics(
  pricePerContract: number,
  quantityContracts: number,
  side: OptionsOrderSide,
  multiplier: number
) {
  const premiumValue = pricePerContract * quantityContracts * multiplier
  const fees = quantityContracts > 0 ? Math.max(1.5, quantityContracts * 0.85) : 0
  const credit = Math.max(premiumValue - fees, 0)

  switch (side) {
    case 'buy_to_open':
    case 'buy_to_close':
      return {
        estimatedCost: premiumValue,
        fees,
        buyingPowerImpact: premiumValue + fees,
        maxLoss: premiumValue + fees,
        maxProfit: 'unlimited' as const,
      }
    case 'sell_to_open':
      return {
        estimatedCost: premiumValue,
        fees,
        buyingPowerImpact: Math.max(premiumValue * 0.45, multiplier * quantityContracts * pricePerContract * 0.2),
        maxLoss: 'unlimited' as const,
        maxProfit: credit,
      }
    case 'sell_to_close':
      return {
        estimatedCost: premiumValue,
        fees,
        buyingPowerImpact: 0,
        maxLoss: 0,
        maxProfit: credit,
      }
  }
}

export function TradeView({ orders = [], ipoOrders = [], onCancelOrder }: TradeViewProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [activeTab, setActiveTab] = useState<'active' | 'logs' | 'ipo'>('active')
  const [currentTime, setCurrentTime] = useState(new Date())
  const [mobileActionOrder, setMobileActionOrder] = useState<Order | null>(null)
  const { addOrder: addOptionsOrder } = useOptionsOrders()
  const supportedUnderlyings = useMemo(() => getSupportedOptionsUnderlyings(), [])
  const rawAssetClass = searchParams.get('assetClass')
  const assetClass: AssetClassTab =
    rawAssetClass === 'options' || rawAssetClass === 'structured' || rawAssetClass === 'stocks'
      ? rawAssetClass
      : 'stocks'
  const rawTicker = searchParams.get('ticker')
  const returnTo = searchParams.get('returnTo')
  const selectedUnderlyingSymbol =
    rawTicker && supportedUnderlyings.some((stock) => stock.symbol === rawTicker)
      ? rawTicker
      : supportedUnderlyings[0]?.symbol ?? 'NVDA'

  // Update time every second for the live clock
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const pendingOrders = orders.filter(o => ['pending', 'submitted', 'partially_filled'].includes(o.status))
  const completedOrders = orders.filter(o => o.status === 'filled' || o.status === 'cancelled')

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    })
  }

  // Stock avatar colors
  const getStockColor = (symbol: string) => {
    const colors: Record<string, string> = {
      'NVDA': 'bg-[#F04438]',
      'AAPL': 'bg-amber-800',
      'TSLA': 'bg-emerald-600',
      'MSFT': 'bg-[#F04438]',
      'GOOGL': 'bg-blue-600',
      'AMZN': 'bg-orange-600',
      'META': 'bg-blue-500',
    }
    return colors[symbol] || 'bg-zinc-700'
  }

  const updateTradeQuery = (updates: Partial<{ assetClass: AssetClassTab; ticker: string }>) => {
    const nextParams = new URLSearchParams(searchParams.toString())
    nextParams.set('tab', 'trade')

    if (updates.assetClass) {
      if (updates.assetClass === 'stocks') {
        nextParams.delete('assetClass')
      } else {
        nextParams.set('assetClass', updates.assetClass)
      }
    }

    if (updates.ticker) {
      nextParams.set('ticker', updates.ticker)
    } else if ((updates.assetClass ?? assetClass) !== 'options') {
      nextParams.delete('ticker')
    }

    const nextQuery = nextParams.toString()
    router.replace(nextQuery ? `${pathname}?${nextQuery}` : pathname)
  }

  return (
    <div className="min-h-screen bg-black text-white pb-24">
      {/* Header */}
      <div className="px-4 pt-4 pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-11 h-11 rounded-full overflow-hidden border-2 border-zinc-800">
                <img
                  src="/images/avatar.jpg"
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-black" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Good Morning</p>
              <p className="text-sm font-black italic">JELLY</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center">
              <Search size={18} className="text-zinc-500" />
            </button>
            <button className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center relative">
              <Bell size={18} className="text-zinc-500" />
              <div className="absolute top-2 right-2 w-2 h-2 bg-[#F04438] rounded-full" />
            </button>
          </div>
        </div>
      </div>

      {/* Title */}
      <div className="px-4 py-4 flex items-center justify-between">
        <h1 className="text-3xl font-black italic tracking-tight">ORDER CENTER</h1>
        <div className="flex items-center gap-2">
          <button className="w-10 h-10 rounded-xl bg-zinc-900 flex items-center justify-center">
            <Filter size={18} className="text-zinc-500" />
          </button>
          <button className="w-10 h-10 rounded-xl bg-zinc-900 flex items-center justify-center">
            <Search size={18} className="text-zinc-500" />
          </button>
        </div>
      </div>

      <div className="px-4 mb-4">
        <div className="rounded-2xl border border-zinc-900 bg-zinc-950/80 p-2">
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => updateTradeQuery({ assetClass: 'stocks' })}
              className={`rounded-xl px-3 py-3 text-[10px] font-black uppercase tracking-[0.2em] ${
                assetClass === 'stocks' ? 'bg-white text-black' : 'bg-zinc-900/60 text-white'
              }`}
            >
              Stocks
            </button>
            <button
              type="button"
              onClick={() => updateTradeQuery({ assetClass: 'options', ticker: selectedUnderlyingSymbol })}
              className={`rounded-xl px-3 py-3 text-[10px] font-black uppercase tracking-[0.2em] ${
                assetClass === 'options' ? 'bg-white text-black' : 'bg-zinc-900/60 text-white'
              }`}
            >
              Options
            </button>
            <button
              type="button"
              onClick={() => updateTradeQuery({ assetClass: 'structured' })}
              className={`rounded-xl px-3 py-3 text-[10px] font-black uppercase tracking-[0.2em] ${
                assetClass === 'structured' ? 'bg-white text-black' : 'bg-zinc-900/30 text-zinc-600'
              }`}
            >
              Structured
            </button>
          </div>
        </div>
      </div>

      {assetClass === 'stocks' ? (
        <>
          <div className="px-4 mb-4">
            <div className="flex gap-6 border-b border-zinc-900">
              <button
                onClick={() => setActiveTab('active')}
                className={`pb-3 relative flex items-center gap-2 transition-all ${
                  activeTab === 'active' ? 'text-amber-500' : 'text-zinc-600'
                }`}
              >
                <span className="text-[11px] font-black uppercase tracking-widest">Active Desk</span>
                {pendingOrders.length > 0 && (
                  <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-500 text-[10px] font-black flex items-center justify-center">
                    {pendingOrders.length}
                  </span>
                )}
                {activeTab === 'active' && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500" />
                )}
              </button>
              <button
                onClick={() => setActiveTab('logs')}
                className={`pb-3 relative transition-all ${
                  activeTab === 'logs' ? 'text-white' : 'text-zinc-600'
                }`}
              >
                <span className="text-[11px] font-black uppercase tracking-widest">Execution Logs</span>
                {activeTab === 'logs' && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white" />
                )}
              </button>
              <button
                onClick={() => setActiveTab('ipo')}
                className={`pb-3 relative flex items-center gap-2 transition-all ${
                  activeTab === 'ipo' ? 'text-white' : 'text-zinc-600'
                }`}
              >
                <span className="text-[11px] font-black uppercase tracking-widest">IPO Orders</span>
                {ipoOrders.length > 0 && (
                  <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-500 text-[10px] font-black flex items-center justify-center">
                    {ipoOrders.length}
                  </span>
                )}
                {activeTab === 'ipo' && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white" />
                )}
              </button>
            </div>
          </div>

          <div className="px-4 space-y-4">
            {activeTab === 'active' ? (
              pendingOrders.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="w-16 h-16 rounded-full bg-zinc-900 flex items-center justify-center mb-4">
                    <Clock size={28} className="text-zinc-700" />
                  </div>
                  <p className="text-sm font-bold text-zinc-600">No Active Orders</p>
                  <p className="text-[10px] text-zinc-700 mt-1 uppercase tracking-widest">Place a limit order to see it here</p>
                </div>
              ) : (
                pendingOrders.map((order) => (
                  <OrderCard
                    key={order.id}
                    order={order}
                    currentTime={currentTime}
                    getStockColor={getStockColor}
                    formatTime={formatTime}
                    onCancel={onCancelOrder}
                    onOpenActions={() => setMobileActionOrder(order)}
                  />
                ))
              )
            ) : activeTab === 'logs' ? (
              completedOrders.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="w-16 h-16 rounded-full bg-zinc-900 flex items-center justify-center mb-4">
                    <TrendingUp size={28} className="text-zinc-700" />
                  </div>
                  <p className="text-sm font-bold text-zinc-600">No Execution History</p>
                  <p className="text-[10px] text-zinc-700 mt-1 uppercase tracking-widest">Completed orders will appear here</p>
                </div>
              ) : (
                completedOrders.map((order) => (
                  <ExecutionLogCard
                    key={order.id}
                    order={order}
                    getStockColor={getStockColor}
                    formatTime={formatTime}
                  />
                ))
              )
            ) : (
              ipoOrders.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="w-16 h-16 rounded-full bg-zinc-900 flex items-center justify-center mb-4">
                    <Clock size={28} className="text-zinc-700" />
                  </div>
                  <p className="text-sm font-bold text-zinc-600">No IPO Orders</p>
                  <p className="text-[10px] text-zinc-700 mt-1 uppercase tracking-widest">Place an IPO order from IPO Center</p>
                </div>
              ) : (
                ipoOrders.map((order) => (
                  <IpoOrderCard key={order.id} order={order} />
                ))
              )
            )}
          </div>

          <div className="px-4 mt-6">
            <div className="bg-zinc-900/40 rounded-2xl p-4 border border-zinc-900">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                  <TrendingUp size={22} className="text-blue-500" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs font-black uppercase tracking-wider">Market Integrity</h3>
                    <ShieldCheck size={14} className="text-emerald-500" />
                  </div>
                  <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-wide mt-1">
                    Aggregated liquidity pools are currently deep.
                  </p>
                </div>
                <ChevronRight size={18} className="text-zinc-700" />
              </div>
            </div>
          </div>
        </>
      ) : assetClass === 'options' ? (
        <OptionsTradePanel
          underlyings={supportedUnderlyings}
          selectedTicker={selectedUnderlyingSymbol}
          returnTo={returnTo}
          onTickerChange={(ticker) => updateTradeQuery({ assetClass: 'options', ticker })}
          onBackToTicker={() => {
            if (returnTo) {
              router.push(returnTo)
            }
          }}
          onSubmitOrder={(order) => {
            const created = addOptionsOrder(order)
            router.push(`/orders/confirmation/${created.id}`)
          }}
        />
      ) : (
        <div className="px-4">
          <div className="rounded-2xl border border-zinc-900 bg-zinc-900/40 px-5 py-16 text-center">
            <p className="text-sm font-bold text-zinc-500">Structured products are not enabled yet</p>
            <p className="mt-2 text-[10px] font-bold uppercase tracking-widest text-zinc-700">
              This tab is reserved for future trade workflows
            </p>
          </div>
        </div>
      )}

      {mobileActionOrder && (
        <MobileTradeOrderActionSheet
          order={mobileActionOrder}
          onClose={() => setMobileActionOrder(null)}
          onModify={() => {
            setMobileActionOrder(null)
            router.push(`/orders/${mobileActionOrder.id}?modify=1`)
          }}
          onExecuteNow={() => {
            setMobileActionOrder(null)
            router.push(`/orders/${mobileActionOrder.id}`)
          }}
          onCancel={() => {
            onCancelOrder?.(mobileActionOrder.id)
            setMobileActionOrder(null)
          }}
        />
      )}
    </div>
  )
}

function OptionsTradePanel({
  underlyings,
  selectedTicker,
  returnTo,
  onTickerChange,
  onBackToTicker,
  onSubmitOrder,
}: {
  underlyings: Stock[]
  selectedTicker: string
  returnTo: string | null
  onTickerChange: (ticker: string) => void
  onBackToTicker: () => void
  onSubmitOrder: (order: OptionsOrder) => void
}) {
  const [query, setQuery] = useState('')
  const [selectedExpiration, setSelectedExpiration] = useState('')
  const [selectedQuote, setSelectedQuote] = useState<OptionChainQuote | null>(null)
  const [step, setStep] = useState<TicketStep>('ticket')
  const [side, setSide] = useState<OptionsOrderSide>('buy_to_open')
  const [priceType, setPriceType] = useState<OptionsPriceType>('limit')
  const chain = useMemo(() => getOptionsChain(selectedTicker), [selectedTicker])

  useEffect(() => {
    if (chain?.expirations.length) {
      setSelectedExpiration((current) =>
        chain.expirations.includes(current) ? current : chain.expirations[0]
      )
    }
  }, [chain])

  useEffect(() => {
    setSelectedQuote(null)
  }, [selectedTicker])

  useEffect(() => {
    if (selectedQuote) {
      setStep('ticket')
      setSide('buy_to_open')
      setPriceType('limit')
    }
  }, [selectedQuote?.contract.symbolId])

  const visibleUnderlyings = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    if (!normalized) return underlyings

    return underlyings.filter((stock) =>
      stock.symbol.toLowerCase().includes(normalized) ||
      stock.name.toLowerCase().includes(normalized)
    )
  }, [query, underlyings])

  const rows = chain ? chain.rowsByExpiration[selectedExpiration] ?? [] : []

  return (
    <div className="px-4 space-y-4">
      {returnTo && (
        <button
          type="button"
          onClick={onBackToTicker}
          className="inline-flex items-center rounded-full border border-zinc-900 bg-zinc-950/80 px-3 py-2 text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-white"
        >
          Back to {selectedTicker}
        </button>
      )}

      <div className="rounded-2xl border border-zinc-900 bg-zinc-900/40 p-4">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Underlying selector</p>
        <div className="mt-3 flex items-center gap-3 rounded-2xl border border-zinc-900 bg-zinc-900/50 px-4 py-3">
          <Search size={16} className="text-zinc-600" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search ticker or company"
            className="flex-1 bg-transparent text-sm font-medium text-white outline-none placeholder:text-zinc-600"
          />
        </div>
        <div className="mt-3 grid grid-cols-1 gap-3">
          {visibleUnderlyings.map((stock) => (
            <button
              key={stock.symbol}
              type="button"
              onClick={() => onTickerChange(stock.symbol)}
              className={`rounded-2xl border px-4 py-4 text-left transition-colors ${
                selectedTicker === stock.symbol
                  ? 'border-white bg-zinc-900/70'
                  : 'border-zinc-900 bg-zinc-900/30 hover:bg-zinc-900/50'
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-base font-black text-white">{stock.symbol}</p>
                    <span className="rounded-full bg-zinc-800 px-2.5 py-1 text-[10px] font-black uppercase tracking-widest text-zinc-300">
                      Options
                    </span>
                  </div>
                  <p className="mt-1 truncate text-xs text-zinc-500">{stock.name}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-black tabular-nums text-white">{formatCurrency(stock.price)}</p>
                  <p className={`mt-1 text-[10px] font-black uppercase tracking-widest ${stock.change >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {stock.change >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {!chain ? (
        <div className="rounded-2xl border border-zinc-900 bg-zinc-900/40 px-5 py-16 text-center">
          <p className="text-sm font-bold text-zinc-500">Options chain not found</p>
        </div>
      ) : (
        <>
          <div className="rounded-2xl border border-zinc-900 bg-zinc-900/40 p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-2xl font-black italic tracking-tight">{chain.underlying.symbol}</p>
                <p className="mt-1 text-xs text-zinc-500">{chain.underlying.name}</p>
              </div>
              <div className="text-right">
                <p className="text-xl font-black tabular-nums text-white">{formatCurrency(chain.underlying.price)}</p>
                <p className={`mt-1 text-[10px] font-black uppercase tracking-widest ${chain.underlying.change >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {chain.underlying.change >= 0 ? '+' : ''}{chain.underlying.changePercent.toFixed(2)}%
                </p>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              {chain.expirations.map((expiration) => (
                <button
                  key={expiration}
                  type="button"
                  onClick={() => setSelectedExpiration(expiration)}
                  className={`rounded-full px-3 py-2 text-[10px] font-black uppercase tracking-widest ${
                    selectedExpiration === expiration ? 'bg-white text-black' : 'bg-zinc-900/60 text-zinc-500'
                  }`}
                >
                  {expiration}
                </button>
              ))}
            </div>

            <div className="mt-5 overflow-hidden rounded-2xl border border-zinc-900">
              <div className="grid grid-cols-[1fr_82px_1fr] bg-zinc-900/70 px-3 py-3 text-[9px] font-black uppercase tracking-widest text-zinc-500">
                <div className="grid grid-cols-4 gap-2">
                  <span>Bid</span>
                  <span>Ask</span>
                  <span>Last</span>
                  <span>IV</span>
                </div>
                <div className="text-center">Strike</div>
                <div className="grid grid-cols-4 gap-2 text-right">
                  <span>Bid</span>
                  <span>Ask</span>
                  <span>Last</span>
                  <span>IV</span>
                </div>
              </div>

              <div className="divide-y divide-zinc-900 bg-zinc-950/60">
                {rows.map((row) => (
                  <div key={row.strike} className="grid grid-cols-[1fr_82px_1fr] items-stretch">
                    <button
                      type="button"
                      onClick={() => setSelectedQuote(row.call)}
                      className={`grid grid-cols-4 gap-2 px-3 py-3 text-left transition-colors hover:bg-zinc-900/40 ${
                        selectedQuote?.contract.symbolId === row.call.contract.symbolId ? 'bg-zinc-900/50' : ''
                      }`}
                    >
                      <ChainMetric value={row.call.bid.toFixed(2)} tone="text-emerald-300" />
                      <ChainMetric value={row.call.ask.toFixed(2)} />
                      <ChainMetric value={row.call.last.toFixed(2)} />
                      <ChainMetric value={`${Math.round(row.call.iv * 100)}%`} />
                      <div className="col-span-4 mt-1 flex items-center justify-between text-[9px] font-bold uppercase tracking-widest text-zinc-600">
                        <span>Vol {row.call.volume}</span>
                        <span>OI {row.call.openInterest}</span>
                      </div>
                    </button>

                    <div className="flex flex-col items-center justify-center border-x border-zinc-900 bg-zinc-900/30 px-2 text-center">
                      <p className="text-sm font-black tabular-nums text-white">{row.strike.toFixed(2)}</p>
                      <p className="mt-1 text-[9px] font-black uppercase tracking-widest text-zinc-600">Strike</p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setSelectedQuote(row.put)}
                      className={`grid grid-cols-4 gap-2 px-3 py-3 text-right transition-colors hover:bg-zinc-900/40 ${
                        selectedQuote?.contract.symbolId === row.put.contract.symbolId ? 'bg-zinc-900/50' : ''
                      }`}
                    >
                      <ChainMetric value={row.put.bid.toFixed(2)} tone="text-red-300" align="text-right" />
                      <ChainMetric value={row.put.ask.toFixed(2)} align="text-right" />
                      <ChainMetric value={row.put.last.toFixed(2)} align="text-right" />
                      <ChainMetric value={`${Math.round(row.put.iv * 100)}%`} align="text-right" />
                      <div className="col-span-4 mt-1 flex items-center justify-between text-[9px] font-bold uppercase tracking-widest text-zinc-600">
                        <span>Vol {row.put.volume}</span>
                        <span>OI {row.put.openInterest}</span>
                      </div>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 rounded-2xl border border-zinc-900 bg-zinc-900/20 p-4">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Chain usage</p>
              <p className="mt-2 text-xs leading-relaxed text-zinc-400">
                Select any call or put quote block to open an options ticket inside Trade. Review, submit, and confirmation continue through the existing order workflow.
              </p>
            </div>
          </div>

          {selectedQuote && (
            <OptionsTicketCard
              quote={selectedQuote}
              step={step}
              onStepChange={setStep}
              side={side}
              onSideChange={setSide}
              priceType={priceType}
              onPriceTypeChange={setPriceType}
              onSubmitOrder={onSubmitOrder}
            />
          )}
        </>
      )}
    </div>
  )
}

function OptionsTicketCard({
  quote,
  step,
  onStepChange,
  side,
  onSideChange,
  priceType,
  onPriceTypeChange,
  onSubmitOrder,
}: {
  quote: OptionChainQuote
  step: TicketStep
  onStepChange: (step: TicketStep) => void
  side: OptionsOrderSide
  onSideChange: (side: OptionsOrderSide) => void
  priceType: OptionsPriceType
  onPriceTypeChange: (priceType: OptionsPriceType) => void
  onSubmitOrder: (order: OptionsOrder) => void
}) {
  const [quantityContracts, setQuantityContracts] = useState(1)
  const [limitPrice, setLimitPrice] = useState(quote.ask)

  useEffect(() => {
    setQuantityContracts(1)
    setLimitPrice(quote.ask)
  }, [quote.contract.symbolId, quote.ask])

  const executionPrice = priceType === 'market' ? quote.ask : limitPrice
  const metrics = calculateOptionOrderMetrics(executionPrice, quantityContracts, side, quote.contract.multiplier)

  const handleSubmit = () => {
    const now = new Date()
    onSubmitOrder({
      id: `OPT-${Date.now()}`,
      refId: generateOptionsRefId(),
      type: 'options',
      contract: quote.contract,
      side,
      quantityContracts,
      priceType,
      limitPrice: priceType === 'limit' ? executionPrice : undefined,
      status: 'submitted',
      timestamp: now,
      timestamps: {
        createdAt: now.toISOString(),
        updatedAt: now.toISOString(),
        submittedAt: now.toISOString(),
      },
      statusHistory: [
        {
          status: 'submitted',
          timestamp: now.toISOString(),
          note: 'Options order received and routed to the mock broker desk.',
        },
      ],
      filledContracts: 0,
      remainingContracts: quantityContracts,
      avgFilledPrice: undefined,
      fees: metrics.fees,
      estimatedCost: metrics.estimatedCost,
      buyingPowerImpact: metrics.buyingPowerImpact,
      maxLoss: metrics.maxLoss,
      maxProfit: metrics.maxProfit,
    })
  }

  return (
    <div className="rounded-2xl border border-zinc-900 bg-zinc-900/40 p-5">
      {step === 'ticket' ? (
        <>
          <div className="rounded-2xl border border-zinc-900 bg-zinc-900/40 p-4">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Selected Contract</p>
            <p className="mt-2 text-lg font-black text-white">{formatOptionContractLabel(quote.contract)}</p>
            <p className="mt-2 text-[11px] font-bold uppercase tracking-widest text-zinc-500">
              Bid {formatCurrency(quote.bid)} · Ask {formatCurrency(quote.ask)} · Last {formatCurrency(quote.last)}
            </p>
          </div>

          <div className="mt-4 rounded-full bg-zinc-900/60 p-1">
            <div className="grid grid-cols-2 gap-1">
              {sideOptions.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => onSideChange(option)}
                  className={`rounded-full px-2 py-3 text-[10px] font-black uppercase tracking-[0.18em] ${
                    side === option ? 'bg-zinc-800 text-white' : 'text-zinc-600'
                  }`}
                >
                  {option.replaceAll('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-4 flex rounded-full bg-zinc-900/60 p-1">
            <button
              type="button"
              onClick={() => onPriceTypeChange('limit')}
              className={`flex-1 rounded-full py-3 text-[11px] font-black uppercase tracking-[0.2em] ${
                priceType === 'limit' ? 'bg-zinc-800 text-white' : 'text-zinc-600'
              }`}
            >
              Limit
            </button>
            <button
              type="button"
              onClick={() => onPriceTypeChange('market')}
              className={`flex-1 rounded-full py-3 text-[11px] font-black uppercase tracking-[0.2em] ${
                priceType === 'market' ? 'bg-zinc-800 text-white' : 'text-zinc-600'
              }`}
            >
              Market
            </button>
          </div>

          <div className="mt-4 grid gap-4">
            <TicketField
              label="Quantity (Contracts)"
              value={quantityContracts}
              onChange={(value) => setQuantityContracts(Math.max(1, Number.parseInt(value, 10) || 1))}
            />
            {priceType === 'limit' && (
              <TicketField
                label="Limit Price"
                value={limitPrice}
                step="0.05"
                onChange={(value) => setLimitPrice(Math.max(0.05, Number.parseFloat(value) || quote.ask))}
              />
            )}
          </div>

          <div className="mt-4 rounded-2xl border border-zinc-900 bg-zinc-900/30 p-4">
            <div className="grid grid-cols-2 gap-4">
              <InfoItem label="Estimated Cost" value={formatCurrency(metrics.estimatedCost)} />
              <InfoItem label="Fees" value={formatCurrency(metrics.fees)} />
              <InfoItem label="Buying Power Impact" value={formatCurrency(metrics.buyingPowerImpact)} />
              <InfoItem label="Max Loss" value={typeof metrics.maxLoss === 'number' ? formatCurrency(metrics.maxLoss) : 'Unlimited'} />
              <InfoItem label="Max Profit" value={typeof metrics.maxProfit === 'number' ? formatCurrency(metrics.maxProfit) : 'Unlimited'} />
              <InfoItem label="Multiplier" value={`${quote.contract.multiplier}x`} />
            </div>
          </div>

          <button
            type="button"
            onClick={() => onStepChange('review')}
            className="mt-5 w-full rounded-2xl bg-white px-4 py-4 text-sm font-black uppercase tracking-[0.25em] text-black"
          >
            Review Order
          </button>
        </>
      ) : (
        <>
          <button
            type="button"
            onClick={() => onStepChange('ticket')}
            className="mb-4 inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-zinc-500 hover:text-white"
          >
            <ArrowLeft size={14} />
            Edit Ticket
          </button>

          <div className="rounded-2xl border border-zinc-900 bg-zinc-900/40 p-4">
            <div className="grid grid-cols-2 gap-4">
              <InfoItem label="Underlying" value={quote.contract.underlying} />
              <InfoItem label="Expiration" value={quote.contract.expiration} />
              <InfoItem label="Strike" value={quote.contract.strike.toFixed(2)} />
              <InfoItem label="Right" value={quote.contract.right.toUpperCase()} />
              <InfoItem label="Side" value={side.replaceAll('_', ' ')} />
              <InfoItem label="Quantity" value={`${quantityContracts} contracts`} />
              <InfoItem label="Order Type" value={priceType.toUpperCase()} />
              <InfoItem label="Limit Price" value={priceType === 'limit' ? formatCurrency(executionPrice) : 'Market'} />
              <InfoItem label="Estimated Cost" value={formatCurrency(metrics.estimatedCost)} />
              <InfoItem label="Estimated Fees" value={formatCurrency(metrics.fees)} />
              <InfoItem label="Buying Power Impact" value={formatCurrency(metrics.buyingPowerImpact)} />
              <InfoItem label="Max Loss" value={typeof metrics.maxLoss === 'number' ? formatCurrency(metrics.maxLoss) : 'Unlimited'} />
              <InfoItem label="Max Profit" value={typeof metrics.maxProfit === 'number' ? formatCurrency(metrics.maxProfit) : 'Unlimited'} />
            </div>
          </div>

          <div className="mt-4 rounded-2xl border border-amber-500/20 bg-amber-500/10 p-4">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/15">
                <ShieldAlert size={18} className="text-amber-400" />
              </div>
              <div>
                <p className="text-[11px] font-black uppercase tracking-widest text-amber-300">Options Risk Disclosure</p>
                <p className="mt-2 text-xs leading-relaxed text-zinc-300">
                  Options are leveraged instruments. Time decay, implied volatility changes, assignment risk, and wide spreads can materially affect outcomes before execution or expiry.
                </p>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            className="mt-5 w-full rounded-2xl bg-white px-4 py-4 text-sm font-black uppercase tracking-[0.25em] text-black"
          >
            Place Order
          </button>
        </>
      )}
    </div>
  )
}

function TicketField({
  label,
  value,
  onChange,
  step = '1',
}: {
  label: string
  value: number
  onChange: (value: string) => void
  step?: string
}) {
  return (
    <div className="rounded-2xl border border-zinc-900 bg-zinc-900/30 p-4">
      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">{label}</p>
      <input
        type="number"
        min="0"
        step={step}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-3 w-full bg-transparent text-3xl font-black tabular-nums text-white outline-none"
      />
    </div>
  )
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[9px] font-bold uppercase tracking-widest text-zinc-600">{label}</p>
      <p className="mt-1 text-sm font-black text-white">{value}</p>
    </div>
  )
}

function ChainMetric({
  value,
  tone = 'text-zinc-300',
  align = 'text-left',
}: {
  value: string
  tone?: string
  align?: string
}) {
  return <p className={`text-[11px] font-black tabular-nums ${tone} ${align}`}>{value}</p>
}

// Active Order Card Component
function OrderCard({ 
  order, 
  currentTime, 
  getStockColor, 
  formatTime,
  onCancel,
  onOpenActions,
}: { 
  order: Order
  currentTime: Date
  getStockColor: (symbol: string) => string
  formatTime: (date: Date) => string
  onCancel?: (orderId: string) => void
  onOpenActions?: () => void
}) {
  const statusLabel = order.status.replace('_', ' ')
  const statusColor =
    order.status === 'partially_filled' ? 'text-amber-500' : order.status === 'submitted' ? 'text-blue-400' : 'text-amber-500'

  return (
    <div className="relative bg-zinc-900/40 rounded-2xl p-4 border border-zinc-900">
      {/* Header Row */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-xl ${getStockColor(order.symbol)} flex items-center justify-center`}>
            <span className="text-white font-black text-[10px]">{order.symbol}</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-base">{order.symbol}</span>
              <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${
                order.type === 'buy' 
                  ? 'bg-[#F04438]/20 text-[#F04438]' 
                  : 'bg-[#2E6BE6]/20 text-[#2E6BE6]'
              }`}>
                {order.type}
              </span>
            </div>
            <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-wide">{order.name}</p>
          </div>
        </div>
        <div className="text-right">
          <div className={`flex items-center gap-1.5 ${statusColor}`}>
            <Clock size={12} />
            <span className="text-[10px] font-black uppercase">{statusLabel}</span>
          </div>
          <p className="text-[11px] font-bold text-zinc-600 tabular-nums mt-0.5">
            {formatTime(order.timestamp)}
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={onOpenActions}
        className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-zinc-900/80 text-zinc-400 md:hidden"
        aria-label="Open order actions"
      >
        <MoreHorizontal size={16} />
      </button>

      {/* Details Row */}
      <div className="flex items-end justify-between border-t border-zinc-800 pt-4">
        <div className="flex gap-8">
          <div>
            <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest mb-1">Qty / Volume</p>
            <p className="text-sm font-black">
              <span className="text-white">{order.quantity}</span>
              <span className="text-zinc-600 text-[10px] ml-1">SHARES</span>
            </p>
          </div>
          <div>
            <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest mb-1">Target Price</p>
            <p className="text-sm font-black text-white">${order.price.toFixed(2)}</p>
          </div>
        </div>
        <button 
          onClick={() => onCancel?.(order.id)}
          className="hidden items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 transition-colors md:flex"
        >
          <Trash2 size={14} className="text-zinc-500" />
          <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Cancel</span>
        </button>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between mt-4 pt-3 border-t border-zinc-800/50">
        <div className="flex items-center gap-2 text-[9px] font-bold text-zinc-700 uppercase tracking-widest">
          <span>REF: {order.refId}</span>
          <span className="text-zinc-800">•</span>
          <span>{order.orderType.toUpperCase()} ROUTING</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${order.status === 'submitted' ? 'bg-blue-400' : order.status === 'partially_filled' ? 'bg-amber-500' : 'bg-emerald-500'}`} />
          <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">
            {order.status === 'submitted' ? 'Broker Received' : order.status === 'partially_filled' ? 'Working Order' : 'Live Queue'}
          </span>
        </div>
      </div>
    </div>
  )
}

function MobileTradeOrderActionSheet({
  order,
  onClose,
  onModify,
  onExecuteNow,
  onCancel,
}: {
  order: Order
  onClose: () => void
  onModify: () => void
  onExecuteNow: () => void
  onCancel: () => void
}) {
  return (
    <div className="fixed inset-0 z-50 md:hidden">
      <button
        type="button"
        onClick={onClose}
        className="absolute inset-0 bg-black/70"
        aria-label="Close order actions"
      />
      <div className="absolute inset-x-0 bottom-0 rounded-t-[28px] border border-zinc-900 bg-zinc-950 p-4">
        <div className="mx-auto h-1.5 w-14 rounded-full bg-zinc-800" />
        <div className="mt-4">
          <p className="text-sm font-black uppercase tracking-widest text-white">{order.symbol}</p>
          <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-600">{order.name}</p>
        </div>
        <div className="mt-5 grid gap-3">
          <button
            type="button"
            onClick={onModify}
            className="rounded-2xl bg-white px-4 py-4 text-xs font-black uppercase tracking-[0.2em] text-black"
          >
            Modify
          </button>
          <button
            type="button"
            onClick={onExecuteNow}
            className="rounded-2xl border border-zinc-800 bg-zinc-900/50 px-4 py-4 text-xs font-black uppercase tracking-[0.2em] text-white"
          >
            Execute Now
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="rounded-2xl border border-zinc-800 bg-zinc-900/50 px-4 py-4 text-xs font-black uppercase tracking-[0.2em] text-white"
          >
            {order.status === 'partially_filled' ? 'Cancel Remaining' : 'Cancel'}
          </button>
        </div>
      </div>
    </div>
  )
}

// Execution Log Card Component
function ExecutionLogCard({ 
  order, 
  getStockColor, 
  formatTime 
}: { 
  order: Order
  getStockColor: (symbol: string) => string
  formatTime: (date: Date) => string
}) {
  const isCancelled = order.status === 'cancelled'
  
  return (
    <div className="bg-zinc-900/40 rounded-2xl p-4 border border-zinc-900">
      {/* Header Row */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-xl ${getStockColor(order.symbol)} flex items-center justify-center`}>
            <span className="text-white font-black text-[10px]">{order.symbol}</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-base">{order.symbol}</span>
              <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${
                order.type === 'buy' 
                  ? 'bg-[#F04438]/20 text-[#F04438]' 
                  : 'bg-[#2E6BE6]/20 text-[#2E6BE6]'
              }`}>
                {order.type}
              </span>
            </div>
            <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-wide">{order.name}</p>
          </div>
        </div>
        <div className="text-right">
          <div className={`flex items-center gap-1.5 ${isCancelled ? 'text-zinc-500' : 'text-emerald-500'}`}>
            <span className="text-[10px] font-black uppercase">
              {isCancelled ? 'Cancelled' : 'Filled'}
            </span>
          </div>
          <p className="text-[11px] font-bold text-zinc-600 tabular-nums mt-0.5">
            {formatTime(order.timestamp)}
          </p>
        </div>
      </div>

      {/* Details Row */}
      <div className="flex gap-8 border-t border-zinc-800 pt-4">
        <div>
          <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest mb-1">Qty / Volume</p>
          <p className="text-sm font-black">
            <span className="text-white">{order.quantity}</span>
            <span className="text-zinc-600 text-[10px] ml-1">SHARES</span>
          </p>
        </div>
        <div>
          <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest mb-1">Exec Price</p>
          <p className="text-sm font-black text-white">${order.price.toFixed(2)}</p>
        </div>
        <div>
          <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest mb-1">Total</p>
          <p className="text-sm font-black text-white">${order.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center gap-2 mt-4 pt-3 border-t border-zinc-800/50 text-[9px] font-bold text-zinc-700 uppercase tracking-widest">
        <span>REF: {order.refId}</span>
        <span className="text-zinc-800">•</span>
        <span>{order.orderType.toUpperCase()} ROUTING</span>
      </div>
    </div>
  )
}
