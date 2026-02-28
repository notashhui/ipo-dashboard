'use client'

import { useCallback, useEffect, useState } from 'react'
import type { Holding } from '@/lib/types'

export const HOLDINGS_KEY = 'portfolio-holdings'

const stockColors: Record<string, string> = {
  NVDA: '#dc2626',
  AAPL: '#78350f',
  TSLA: '#059669',
  MSFT: '#dc2626',
  GOOGL: '#2563eb',
  AMZN: '#f59e0b',
  META: '#3b82f6',
  '00700': '#065f46',
}

export const defaultHoldings: Holding[] = [
  {
    symbol: 'NVDA',
    name: 'NVIDIA Corp',
    quantity: 500,
    avgCost: 128,
    currentPrice: 135.58,
    marketValue: 67790,
    unrealizedPL: 3790,
    unrealizedPLPercent: 5.92,
    color: stockColors.NVDA || '#3f3f46',
  },
  {
    symbol: '00700',
    name: 'Tencent Holdings',
    quantity: 2000,
    avgCost: 390,
    currentPrice: 410.2,
    marketValue: 820400,
    unrealizedPL: 40400,
    unrealizedPLPercent: 5.18,
    color: stockColors['00700'] || '#3f3f46',
  },
]

function loadHoldings() {
  if (typeof window === 'undefined') return defaultHoldings

  try {
    const raw = localStorage.getItem(HOLDINGS_KEY)
    if (!raw) return defaultHoldings
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) && parsed.length > 0 ? parsed as Holding[] : defaultHoldings
  } catch {
    return defaultHoldings
  }
}

function saveHoldings(holdings: Holding[]) {
  if (typeof window === 'undefined') return

  try {
    localStorage.setItem(HOLDINGS_KEY, JSON.stringify(holdings))
  } catch {}
}

export function useHoldings(initialHoldings: Holding[] = defaultHoldings) {
  const [holdings, setHoldingsState] = useState<Holding[]>(initialHoldings)
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    setHoldingsState(loadHoldings())
    setIsHydrated(true)
  }, [])

  const setHoldings = useCallback((updater: Holding[] | ((current: Holding[]) => Holding[])) => {
    setHoldingsState((current) => {
      const next = typeof updater === 'function' ? updater(current) : updater
      saveHoldings(next)
      return next
    })
  }, [])

  const getHoldingBySymbol = useCallback((symbol: string) => {
    return holdings.find((holding) => holding.symbol === symbol)
  }, [holdings])

  return {
    holdings,
    setHoldings,
    getHoldingBySymbol,
    isHydrated,
  }
}
