'use client'

import { useCallback, useEffect, useState } from 'react'
import type { OptionsOrder, OrderStatus } from '@/lib/types'
import { loadOptionsOrders, normalizeOptionsOrder, saveOptionsOrders, transitionOptionsOrder } from '@/lib/options-orders'

export function useOptionsOrders(initialOrders: OptionsOrder[] = []) {
  const [orders, setOrders] = useState<OptionsOrder[]>(() => initialOrders.map((order) => normalizeOptionsOrder(order)))
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    setOrders(loadOptionsOrders())
    setIsHydrated(true)
  }, [])

  const persistOrders = useCallback((updater: (current: OptionsOrder[]) => OptionsOrder[]) => {
    setOrders((current) => {
      const next = updater(current)
      saveOptionsOrders(next)
      return next
    })
  }, [])

  const addOrder = useCallback((order: OptionsOrder) => {
    const normalized = normalizeOptionsOrder(order)
    persistOrders((current) => [normalized, ...current])
    return normalized
  }, [persistOrders])

  const transitionOrderState = useCallback((
    orderId: string,
    options: {
      status: OrderStatus
      note?: string
      filledContracts?: number
      avgFilledPrice?: number
    }
  ) => {
    let updatedOrder: OptionsOrder | undefined

    persistOrders((current) =>
      current.map((order) => {
        if (order.id !== orderId) return order
        updatedOrder = transitionOptionsOrder(order, options)
        return updatedOrder
      })
    )

    return updatedOrder
  }, [persistOrders])

  const getOrderById = useCallback((orderId: string) => {
    return orders.find((order) => order.id === orderId)
  }, [orders])

  return {
    orders,
    isHydrated,
    addOrder,
    transitionOrderState,
    getOrderById,
  }
}
