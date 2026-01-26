'use client'

import { useState, useCallback, useEffect } from 'react'
import type { IpoOrder } from '@/lib/types'

const IPO_ORDERS_KEY = 'ipo-orders'

function loadFromStorage(): IpoOrder[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(IPO_ORDERS_KEY)
    if (!raw) return []
    const arr = JSON.parse(raw)
    return Array.isArray(arr) ? arr : []
  } catch {
    return []
  }
}

export function useIpoOrders() {
  const [ipoOrders, setIpoOrders] = useState<IpoOrder[]>(loadFromStorage)

  useEffect(() => {
    setIpoOrders(loadFromStorage())
  }, [])

  const addIpoOrder = useCallback((order: IpoOrder) => {
    setIpoOrders((prev) => {
      const next = [order, ...prev]
      try {
        localStorage.setItem(IPO_ORDERS_KEY, JSON.stringify(next))
      } catch (_) {}
      return next
    })
  }, [])

  return { ipoOrders, addIpoOrder }
}
