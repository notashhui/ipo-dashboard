'use client'

import { useCallback, useEffect, useState } from 'react'
import type { Order, OrderStatus } from '@/lib/types'
import { loadStockOrders, normalizeOrder, saveStockOrders, setOrderStatus, transitionOrder } from '@/lib/stock-orders'

export function useStockOrders(initialOrders: Order[] = []) {
  const [orders, setOrders] = useState<Order[]>(() => initialOrders.map((order) => normalizeOrder(order)))
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    setOrders(loadStockOrders())
    setIsHydrated(true)
  }, [])

  const persistOrders = useCallback((updater: (current: Order[]) => Order[]) => {
    setOrders((current) => {
      const next = updater(current)
      saveStockOrders(next)
      return next
    })
  }, [])

  const addOrder = useCallback((order: Order) => {
    const normalized = normalizeOrder(order)
    persistOrders((current) => [normalized, ...current])
    return normalized
  }, [persistOrders])

  const updateOrderStatus = useCallback((orderId: string, status: OrderStatus, note?: string) => {
    let updatedOrder: Order | undefined

    persistOrders((current) =>
      current.map((order) => {
        if (order.id !== orderId) return order

        updatedOrder = setOrderStatus(order, status, note)
        return updatedOrder
      })
    )

    return updatedOrder
  }, [persistOrders])

  const transitionOrderState = useCallback((
    orderId: string,
    options: {
      status: OrderStatus
      note?: string
      filledQuantity?: number
      avgFilledPrice?: number
    }
  ) => {
    let updatedOrder: Order | undefined

    persistOrders((current) =>
      current.map((order) => {
        if (order.id !== orderId) return order

        updatedOrder = transitionOrder(order, options)
        return updatedOrder
      })
    )

    return updatedOrder
  }, [persistOrders])

  const cancelOrder = useCallback((orderId: string, note?: string) => {
    return updateOrderStatus(orderId, 'cancelled', note)
  }, [updateOrderStatus])

  const getOrderById = useCallback((orderId: string) => {
    return orders.find((order) => order.id === orderId)
  }, [orders])

  return {
    orders,
    isHydrated,
    addOrder,
    cancelOrder,
    updateOrderStatus,
    transitionOrderState,
    getOrderById,
  }
}
