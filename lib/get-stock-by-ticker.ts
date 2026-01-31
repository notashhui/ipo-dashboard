import type { Stock } from '@/lib/types'
import { mockStocks } from '@/lib/mock-data'
import { sectors } from '@/lib/mock/sectors'
import { mockHotStocks } from '@/lib/mock/hot-stocks'
import { mockIndexData } from '@/lib/mock/index-constituents'

/** Normalize symbol for lookup: uppercase, pad HK 3-digit to 4 (700 → 0700). */
function normalizeSymbol(s: string): string {
  const u = s.trim().toUpperCase()
  if (/^\d{3}$/.test(u)) return '0' + u
  return u
}

/**
 * Resolve symbol to Stock from mockStocks, sectors, hot-stocks, and index constituents.
 * Tries exact match first, then normalized (e.g. 700 → 0700).
 */
export function getStockByTicker(ticker: string): Stock | null {
  if (!ticker || typeof ticker !== 'string') return null
  const raw = ticker.trim().toUpperCase()
  const norm = normalizeSymbol(ticker)
  const trySymbols = raw === norm ? [raw] : [raw, norm]

  const fromMock = mockStocks.find((s) => trySymbols.includes(s.symbol))
  if (fromMock) return fromMock

  for (const sec of sectors) {
    for (const s of sec.topStocks) {
      if (trySymbols.includes(s.ticker))
        return {
          symbol: s.ticker,
          name: s.name,
          price: s.price,
          change: (s.price * s.changePercent) / 100,
          changePercent: s.changePercent,
        }
    }
  }

  const hotFlatten: { symbol: string; name: string; price: number; change: number; changeAmount: number }[] = []
  for (const dim of ['gainers', 'losers', 'volume', 'trending'] as const) {
    for (const mkt of ['us', 'hk', 'cn', 'all'] as const) {
      hotFlatten.push(...(mockHotStocks[dim][mkt] as { symbol: string; name: string; price: number; change: number; changeAmount: number }[]))
    }
  }
  const bySymbol = new Map<string, { symbol: string; name: string; price: number; change: number; changeAmount: number }>()
  for (const h of hotFlatten) bySymbol.set(h.symbol, h)
  for (const sym of trySymbols) {
    const h = bySymbol.get(sym)
    if (h)
      return {
        symbol: h.symbol,
        name: h.name,
        price: h.price,
        change: h.changeAmount,
        changePercent: h.change,
      }
  }

  for (const idx of Object.values(mockIndexData)) {
    for (const c of idx.constituents) {
      if (trySymbols.includes(c.symbol))
        return {
          symbol: c.symbol,
          name: c.name,
          price: c.price,
          change: c.changeAmount,
          changePercent: c.change,
        }
    }
  }

  return null
}
