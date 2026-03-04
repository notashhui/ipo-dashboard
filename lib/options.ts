import { mockStocks } from './mock-data'
import type { OptionChainQuote, OptionContract, OptionRight, Stock } from './types'

const SUPPORTED_TICKERS = ['NVDA', 'TSLA', '00700'] as const

const baseExpirations = [14, 35, 63]

function getUnderlying(ticker: string): Stock | undefined {
  return mockStocks.find((stock) => stock.symbol === ticker)
}

function getStrikeStep(price: number) {
  if (price >= 500) return 25
  if (price >= 200) return 10
  if (price >= 80) return 5
  return 2.5
}

function buildStrikes(price: number) {
  const step = getStrikeStep(price)
  const center = Math.round(price / step) * step
  return Array.from({ length: 11 }, (_, index) => Number((center + (index - 5) * step).toFixed(2)))
}

function buildSymbolId(underlying: string, expiration: string, right: OptionRight, strike: number) {
  return `${underlying}-${expiration}-${right}-${strike.toFixed(2)}`
}

function createQuote(underlying: Stock, expiration: string, strike: number, right: OptionRight): OptionChainQuote {
  const distance = Math.abs(strike - underlying.price)
  const intrinsic =
    right === 'call'
      ? Math.max(underlying.price - strike, 0)
      : Math.max(strike - underlying.price, 0)
  const timeValue = Math.max(0.8, underlying.price * 0.015 - distance * 0.035)
  const mid = Number((intrinsic + timeValue).toFixed(2))
  const spread = Number(Math.max(0.08, Math.min(mid * 0.08, 0.65)).toFixed(2))
  const bid = Number(Math.max(0.05, mid - spread / 2).toFixed(2))
  const ask = Number((mid + spread / 2).toFixed(2))
  const last = Number((mid + (right === 'call' ? 0.03 : -0.02)).toFixed(2))
  const iv = Number((0.28 + distance / Math.max(underlying.price, 1) * 0.45 + (right === 'put' ? 0.03 : 0)).toFixed(2))
  const activityBase = Math.max(25, Math.round(1600 - distance * 18))

  return {
    contract: {
      ticker: underlying.symbol,
      underlying: underlying.symbol,
      expiration,
      strike,
      right,
      multiplier: 100,
      symbolId: buildSymbolId(underlying.symbol, expiration, right, strike),
    },
    bid,
    ask,
    last,
    iv,
    volume: activityBase + (right === 'call' ? 120 : 80),
    openInterest: activityBase * 6 + (right === 'call' ? 500 : 350),
  }
}

export function getSupportedOptionsUnderlyings() {
  return SUPPORTED_TICKERS
    .map((ticker) => getUnderlying(ticker))
    .filter((stock): stock is Stock => Boolean(stock))
}

export function getOptionsExpirations(ticker: string) {
  const today = new Date()

  return baseExpirations.map((days) => {
    const expiration = new Date(today)
    expiration.setDate(today.getDate() + days)
    return expiration.toISOString().split('T')[0]
  })
}

export function getOptionsChain(ticker: string) {
  const underlying = getUnderlying(ticker)
  if (!underlying) return null

  const expirations = getOptionsExpirations(ticker)
  const strikes = buildStrikes(underlying.price)

  return {
    underlying,
    expirations,
    strikes,
    rowsByExpiration: Object.fromEntries(
      expirations.map((expiration) => [
        expiration,
        strikes.map((strike) => ({
          strike,
          call: createQuote(underlying, expiration, strike, 'call'),
          put: createQuote(underlying, expiration, strike, 'put'),
        })),
      ])
    ) as Record<string, { strike: number; call: OptionChainQuote; put: OptionChainQuote }[]>,
  }
}

export function findOptionContract(symbolId: string) {
  for (const underlying of getSupportedOptionsUnderlyings()) {
    const chain = getOptionsChain(underlying.symbol)
    if (!chain) continue

    for (const expiration of chain.expirations) {
      const match = chain.rowsByExpiration[expiration]
        .flatMap((row) => [row.call, row.put])
        .find((quote) => quote.contract.symbolId === symbolId)

      if (match) return match
    }
  }

  return null
}

export function formatOptionContractLabel(contract: OptionContract) {
  return `${contract.underlying} ${contract.expiration} ${contract.strike.toFixed(2)} ${contract.right.toUpperCase()}`
}

