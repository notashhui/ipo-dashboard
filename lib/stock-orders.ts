import type { Order, OrderExecution, OrderStatus, OrderStatusEvent, OrderTimestamps } from './types'

export const STOCK_ORDERS_KEY = 'stock-orders'

type PersistedOrder = Omit<Order, 'timestamp'> & {
  timestamp: string
}

function createExecution(order: Pick<Order, 'quantity' | 'price' | 'status'>): OrderExecution {
  const filledQuantity = order.status === 'filled' ? order.quantity : 0

  return {
    filledQuantity,
    remainingQuantity: Math.max(order.quantity - filledQuantity, 0),
    progress: order.quantity > 0 ? filledQuantity / order.quantity : 0,
    avgFilledPrice: filledQuantity > 0 ? order.price : undefined,
  }
}

function createTimestamps(order: Pick<Order, 'timestamp' | 'status'>): OrderTimestamps {
  const createdAt = order.timestamp.toISOString()

  return {
    createdAt,
    updatedAt: createdAt,
    submittedAt: order.status === 'submitted' || order.status === 'partially_filled' || order.status === 'filled' ? createdAt : undefined,
    filledAt: order.status === 'filled' ? createdAt : undefined,
    cancelledAt: order.status === 'cancelled' ? createdAt : undefined,
  }
}

function createStatusHistory(order: Pick<Order, 'status' | 'timestamp'>): OrderStatusEvent[] {
  return [
    {
      status: order.status,
      timestamp: order.timestamp.toISOString(),
    },
  ]
}

function normalizeExecution(order: Order): OrderExecution {
  if (order.execution) {
    const filledQuantity = Math.min(order.execution.filledQuantity, order.quantity)
    const remainingQuantity = Math.max(order.quantity - filledQuantity, 0)

    return {
      ...order.execution,
      filledQuantity,
      remainingQuantity,
      progress: order.quantity > 0 ? filledQuantity / order.quantity : 0,
      avgFilledPrice: filledQuantity > 0 ? order.execution.avgFilledPrice ?? order.price : undefined,
    }
  }

  return createExecution(order)
}

function normalizeTimestamps(order: Order): OrderTimestamps {
  if (order.timestamps) {
    return {
      createdAt: order.timestamps.createdAt ?? order.timestamp.toISOString(),
      updatedAt: order.timestamps.updatedAt ?? order.timestamp.toISOString(),
      submittedAt: order.timestamps.submittedAt,
      filledAt: order.timestamps.filledAt,
      cancelledAt: order.timestamps.cancelledAt,
    }
  }

  return createTimestamps(order)
}

function normalizeStatusHistory(order: Order): OrderStatusEvent[] {
  if (order.statusHistory?.length) {
    return order.statusHistory
  }

  return createStatusHistory(order)
}

export function normalizeOrder(order: Order): Order {
  return {
    ...order,
    execution: normalizeExecution(order),
    timestamps: normalizeTimestamps(order),
    statusHistory: normalizeStatusHistory(order),
  }
}

export function deserializeOrder(order: PersistedOrder | Order): Order {
  const hydrated = {
    ...order,
    timestamp: order.timestamp instanceof Date ? order.timestamp : new Date(order.timestamp),
  } as Order

  return normalizeOrder(hydrated)
}

export function serializeOrder(order: Order): PersistedOrder {
  const normalized = normalizeOrder(order)

  return {
    ...normalized,
    timestamp: normalized.timestamp.toISOString(),
  }
}

interface OrderTransitionOptions {
  status: OrderStatus
  note?: string
  filledQuantity?: number
  avgFilledPrice?: number
}

export function transitionOrder(order: Order, options: OrderTransitionOptions): Order {
  const now = new Date().toISOString()
  const next = normalizeOrder(order)
  const { status, note, filledQuantity, avgFilledPrice } = options

  const nextFilledQuantity =
    filledQuantity === undefined
      ? status === 'filled'
        ? next.quantity
        : status === 'cancelled'
          ? next.execution.filledQuantity
          : next.execution.filledQuantity
      : Math.max(0, Math.min(filledQuantity, next.quantity))

  const nextAvgFilledPrice =
    nextFilledQuantity > 0 ? avgFilledPrice ?? next.execution.avgFilledPrice ?? next.price : undefined

  if (
    next.status === status &&
    next.execution.filledQuantity === nextFilledQuantity &&
    next.execution.avgFilledPrice === nextAvgFilledPrice
  ) {
    return next
  }

  const execution: OrderExecution = {
    ...next.execution,
    filledQuantity: nextFilledQuantity,
    remainingQuantity:
      status === 'cancelled'
        ? 0
        : Math.max(next.quantity - nextFilledQuantity, 0),
    progress: next.quantity > 0 ? nextFilledQuantity / next.quantity : 0,
    avgFilledPrice: nextAvgFilledPrice,
  }

  return {
    ...next,
    status,
    execution,
    timestamps: {
      ...next.timestamps,
      updatedAt: now,
      submittedAt: next.timestamps.submittedAt ?? (status === 'submitted' || status === 'partially_filled' || status === 'filled' ? now : undefined),
      filledAt: status === 'filled' ? now : next.timestamps.filledAt,
      cancelledAt: status === 'cancelled' ? now : next.timestamps.cancelledAt,
    },
    statusHistory: [
      {
        status,
        timestamp: now,
        note,
      },
      ...next.statusHistory,
    ],
  }
}

export function setOrderStatus(order: Order, status: OrderStatus, note?: string): Order {
  return transitionOrder(order, { status, note })
}

export function loadStockOrders(): Order[] {
  if (typeof window === 'undefined') return []

  try {
    const raw = localStorage.getItem(STOCK_ORDERS_KEY)
    if (!raw) return []

    const orders = JSON.parse(raw)
    if (!Array.isArray(orders)) return []

    return orders.map((order) => deserializeOrder(order as PersistedOrder))
  } catch {
    return []
  }
}

export function saveStockOrders(orders: Order[]) {
  if (typeof window === 'undefined') return

  try {
    localStorage.setItem(
      STOCK_ORDERS_KEY,
      JSON.stringify(orders.map((order) => serializeOrder(order)))
    )
  } catch {}
}
