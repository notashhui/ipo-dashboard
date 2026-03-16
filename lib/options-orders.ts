import type { OptionsOrder, OrderStatus, OrderStatusEvent, OrderTimestamps } from './types'

export const OPTIONS_ORDERS_KEY = 'options-orders'

type PersistedOptionsOrder = Omit<OptionsOrder, 'timestamp'> & {
  timestamp: string
}

function createTimestamps(order: Pick<OptionsOrder, 'timestamp' | 'status'>): OrderTimestamps {
  const createdAt = order.timestamp.toISOString()

  return {
    createdAt,
    updatedAt: createdAt,
    submittedAt: order.status === 'submitted' || order.status === 'partially_filled' || order.status === 'filled' ? createdAt : undefined,
    filledAt: order.status === 'filled' ? createdAt : undefined,
    cancelledAt: order.status === 'cancelled' ? createdAt : undefined,
  }
}

function createStatusHistory(order: Pick<OptionsOrder, 'status' | 'timestamp'>): OrderStatusEvent[] {
  return [
    {
      status: order.status,
      timestamp: order.timestamp.toISOString(),
    },
  ]
}

export function normalizeOptionsOrder(order: OptionsOrder): OptionsOrder {
  const filledContracts = Math.max(0, Math.min(order.filledContracts, order.quantityContracts))
  const remainingContracts =
    order.status === 'cancelled'
      ? 0
      : Math.max(order.quantityContracts - filledContracts, 0)

  return {
    ...order,
    filledContracts,
    remainingContracts,
    avgFilledPrice: filledContracts > 0 ? order.avgFilledPrice ?? order.limitPrice : undefined,
    timestamps: order.timestamps ?? createTimestamps(order),
    statusHistory: order.statusHistory?.length ? order.statusHistory : createStatusHistory(order),
  }
}

export function deserializeOptionsOrder(order: PersistedOptionsOrder | OptionsOrder): OptionsOrder {
  const hydrated = {
    ...order,
    timestamp: order.timestamp instanceof Date ? order.timestamp : new Date(order.timestamp),
  } as OptionsOrder

  return normalizeOptionsOrder(hydrated)
}

export function serializeOptionsOrder(order: OptionsOrder): PersistedOptionsOrder {
  const normalized = normalizeOptionsOrder(order)

  return {
    ...normalized,
    timestamp: normalized.timestamp.toISOString(),
  }
}

interface OptionsTransitionOptions {
  status: OrderStatus
  note?: string
  filledContracts?: number
  avgFilledPrice?: number
}

export function transitionOptionsOrder(order: OptionsOrder, options: OptionsTransitionOptions): OptionsOrder {
  const current = normalizeOptionsOrder(order)
  const now = new Date().toISOString()
  const nextFilledContracts =
    options.filledContracts === undefined
      ? options.status === 'filled'
        ? current.quantityContracts
        : current.filledContracts
      : Math.max(0, Math.min(options.filledContracts, current.quantityContracts))

  const nextAvgFill = nextFilledContracts > 0
    ? options.avgFilledPrice ?? current.avgFilledPrice ?? current.limitPrice
    : undefined

  return {
    ...current,
    status: options.status,
    filledContracts: nextFilledContracts,
    remainingContracts:
      options.status === 'cancelled'
        ? 0
        : Math.max(current.quantityContracts - nextFilledContracts, 0),
    avgFilledPrice: nextAvgFill,
    timestamps: {
      ...current.timestamps,
      updatedAt: now,
      submittedAt: current.timestamps?.submittedAt ?? (options.status === 'submitted' || options.status === 'partially_filled' || options.status === 'filled' ? now : undefined),
      filledAt: options.status === 'filled' ? now : current.timestamps?.filledAt,
      cancelledAt: options.status === 'cancelled' ? now : current.timestamps?.cancelledAt,
    },
    statusHistory: [
      {
        status: options.status,
        timestamp: now,
        note: options.note,
      },
      ...(current.statusHistory ?? []),
    ],
  }
}

export function loadOptionsOrders(): OptionsOrder[] {
  if (typeof window === 'undefined') return []

  try {
    const raw = localStorage.getItem(OPTIONS_ORDERS_KEY)
    if (!raw) return []

    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []

    return parsed.map((entry) => deserializeOptionsOrder(entry as PersistedOptionsOrder))
  } catch {
    return []
  }
}

export function saveOptionsOrders(orders: OptionsOrder[]) {
  if (typeof window === 'undefined') return

  try {
    localStorage.setItem(
      OPTIONS_ORDERS_KEY,
      JSON.stringify(orders.map((order) => serializeOptionsOrder(order)))
    )
  } catch {}
}
