import { isOptionsOrder } from './broker-orders'
import type { BrokerOrder, OptionsOrder, Order, OrderStatus } from './types'

type StockTransition = (
  orderId: string,
  options: {
    status: OrderStatus
    note?: string
    filledQuantity?: number
    avgFilledPrice?: number
  }
) => unknown

type OptionsTransition = (
  orderId: string,
  options: {
    status: OrderStatus
    note?: string
    filledContracts?: number
    avgFilledPrice?: number
  }
) => unknown

type StockAdd = (order: Order) => Order
type OptionsAdd = (order: OptionsOrder) => OptionsOrder

export function getReferencePrice(order: BrokerOrder) {
  if (isOptionsOrder(order)) {
    return order.limitPrice ?? order.avgFilledPrice ?? 0
  }

  return order.price
}

export function getAverageFillDisplay(order: BrokerOrder) {
  if (isOptionsOrder(order)) {
    return order.avgFilledPrice ?? order.limitPrice ?? 0
  }

  return order.execution?.avgFilledPrice ?? order.price
}

export function isLimitOrder(order: BrokerOrder) {
  return isOptionsOrder(order) ? order.priceType === 'limit' : order.orderType === 'limit'
}

export function getOmsActionState(order: BrokerOrder) {
  const statusValue = String(order.status)
  const isWorkingOrder = !['filled', 'cancelled', 'rejected', 'expired'].includes(statusValue)
  const canCancel = isWorkingOrder
  const canModify = isWorkingOrder && isLimitOrder(order)
  const canExecuteNow = isWorkingOrder && isLimitOrder(order)

  return { isWorkingOrder, canCancel, canModify, canExecuteNow }
}

export function getBrokerFilledUnits(order: BrokerOrder) {
  return isOptionsOrder(order) ? order.filledContracts : (order.execution?.filledQuantity ?? 0)
}

export function getBrokerRemainingUnits(order: BrokerOrder) {
  return isOptionsOrder(order) ? order.remainingContracts : (order.execution?.remainingQuantity ?? order.quantity)
}

function transitionBrokerOrder(
  order: BrokerOrder,
  params: {
    status: OrderStatus
    note?: string
    filledUnits?: number
    avgFillPrice?: number
  },
  dependencies: {
    transitionStockOrderState: StockTransition
    transitionOptionsOrderState: OptionsTransition
  }
) {
  if (isOptionsOrder(order)) {
    dependencies.transitionOptionsOrderState(order.id, {
      status: params.status,
      note: params.note,
      filledContracts: params.filledUnits,
      avgFilledPrice: params.avgFillPrice,
    })
    return
  }

  dependencies.transitionStockOrderState(order.id, {
    status: params.status,
    note: params.note,
    filledQuantity: params.filledUnits,
    avgFilledPrice: params.avgFillPrice,
  })
}

function generateRefId(prefix: string) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let result = prefix
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

export function createReplacementOrder(
  order: BrokerOrder,
  params: {
    quantity: number
    priceType: 'limit' | 'market'
    limitPrice?: number
    note: string
  }
): BrokerOrder {
  const now = new Date()
  const lineageRootId = order.lineageRootId ?? order.id
  const refId = generateRefId(isOptionsOrder(order) ? 'OP' : 'TX')
  const mergedHistory = [
    {
      status: 'submitted' as const,
      timestamp: now.toISOString(),
      note: params.note,
    },
    ...(order.statusHistory ?? []),
  ]

  if (isOptionsOrder(order)) {
    const executionPrice = params.priceType === 'limit'
      ? params.limitPrice ?? order.limitPrice ?? getReferencePrice(order)
      : getReferencePrice(order)
    return {
      ...order,
      id: `${order.type === 'options' ? 'OPT' : 'ORD'}-${Date.now()}`,
      refId,
      lineageRootId,
      replacesOrderId: order.id,
      quantityContracts: params.quantity,
      priceType: params.priceType,
      limitPrice: executionPrice,
      status: 'submitted',
      timestamp: now,
      timestamps: {
        createdAt: now.toISOString(),
        updatedAt: now.toISOString(),
        submittedAt: now.toISOString(),
      },
      statusHistory: mergedHistory,
      filledContracts: 0,
      remainingContracts: params.quantity,
      avgFilledPrice: undefined,
      estimatedCost: (executionPrice ?? order.limitPrice ?? 0) * params.quantity * order.contract.multiplier,
      buyingPowerImpact: params.priceType === 'market'
        ? order.buyingPowerImpact
        : (executionPrice ?? order.limitPrice ?? 0) * params.quantity * order.contract.multiplier + order.fees,
    }
  }

  const executionPrice = params.priceType === 'limit' ? params.limitPrice ?? order.price : getReferencePrice(order)
  return {
    ...order,
    id: `ORD-${Date.now()}`,
    refId,
    lineageRootId,
    replacesOrderId: order.id,
    orderType: params.priceType,
    price: executionPrice,
    quantity: params.quantity,
    total: executionPrice * params.quantity,
    status: 'submitted',
    timestamp: now,
    timestamps: {
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
      submittedAt: now.toISOString(),
    },
    statusHistory: mergedHistory,
    execution: {
      filledQuantity: 0,
      remainingQuantity: params.quantity,
      progress: 0,
      avgFilledPrice: undefined,
    },
  }
}

export function cancelWorkingOrder(
  order: BrokerOrder,
  dependencies: {
    transitionStockOrderState: StockTransition
    transitionOptionsOrderState: OptionsTransition
  }
) {
  const filled = getBrokerFilledUnits(order)
  const remaining = getBrokerRemainingUnits(order)

  transitionBrokerOrder(
    order,
    {
      status: 'cancelled',
      filledUnits: filled,
      note: isOptionsOrder(order)
        ? `Cancelled remaining ${remaining} contracts.`
        : `Cancelled remaining ${remaining} shares.`,
    },
    dependencies
  )
}

export function executeWorkingOrderNow(
  order: BrokerOrder,
  dependencies: {
    transitionStockOrderState: StockTransition
    transitionOptionsOrderState: OptionsTransition
    addStockOrder: StockAdd
    addOptionsOrder: OptionsAdd
  }
) {
  const filled = getBrokerFilledUnits(order)
  const remaining = Math.max(getBrokerRemainingUnits(order), 1)
  const replacement = createReplacementOrder(order, {
    quantity: remaining,
    priceType: 'market',
    note: `Market replacement submitted from ${order.refId}.`,
  })

  if (isOptionsOrder(order)) {
    dependencies.addOptionsOrder(replacement as OptionsOrder)
  } else {
    dependencies.addStockOrder(replacement as Order)
  }

  transitionBrokerOrder(
    order,
    {
      status: 'cancelled',
      filledUnits: filled,
      avgFillPrice: getAverageFillDisplay(order),
      note: `Converted to market via ${replacement.refId}.`,
    },
    dependencies
  )

  return replacement
}
