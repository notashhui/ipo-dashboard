import { mockStocks } from './mock-data'
import { findOptionContract } from './options'
import type { BrokerOrder, OptionsOrder, Order } from './types'

export function isOptionsOrder(order: BrokerOrder): order is OptionsOrder {
  return 'contract' in order && order.type === 'options'
}

export function isStockOrder(order: BrokerOrder): order is Order {
  return !isOptionsOrder(order)
}

export function getBrokerOrderCreatedAt(order: BrokerOrder) {
  return order.timestamps?.createdAt ?? order.timestamp
}

export function getBrokerOrderUpdatedAt(order: BrokerOrder) {
  return order.timestamps?.updatedAt ?? order.timestamp
}

export function getBrokerOrderUnderlying(order: BrokerOrder) {
  return isOptionsOrder(order) ? order.contract.underlying : order.symbol
}

export function getBrokerOrderTitle(order: BrokerOrder) {
  if (isOptionsOrder(order)) {
    return `${order.contract.underlying} ${order.contract.strike.toFixed(2)} ${order.contract.right.toUpperCase()}`
  }

  return order.symbol
}

export function getBrokerOrderSubtitle(order: BrokerOrder) {
  if (isOptionsOrder(order)) {
    return `${order.side.replaceAll('_', ' ')} · ${order.contract.expiration}`
  }

  return order.name
}

export function getBrokerOrderProgress(order: BrokerOrder) {
  if (isOptionsOrder(order)) {
    return order.quantityContracts > 0 ? order.filledContracts / order.quantityContracts : 0
  }

  return order.execution?.progress ?? 0
}

export function getBrokerOrderFilled(order: BrokerOrder) {
  return isOptionsOrder(order) ? order.filledContracts : (order.execution?.filledQuantity ?? 0)
}

export function getBrokerOrderTotalUnits(order: BrokerOrder) {
  return isOptionsOrder(order) ? order.quantityContracts : order.quantity
}

export function getBrokerOrderRemaining(order: BrokerOrder) {
  return isOptionsOrder(order) ? order.remainingContracts : (order.execution?.remainingQuantity ?? order.quantity)
}

export function getBrokerOrderPrice(order: BrokerOrder) {
  return isOptionsOrder(order) ? order.limitPrice : order.price
}

export function getBrokerLastPrice(order: BrokerOrder) {
  if (isOptionsOrder(order)) {
    return findOptionContract(order.contract.symbolId)?.last
  }

  return mockStocks.find((stock) => stock.symbol === order.symbol)?.price
}

export function getBrokerLimitDistance(order: BrokerOrder) {
  const last = getBrokerLastPrice(order)
  if (last === undefined) return null

  if (isOptionsOrder(order)) {
    if (order.priceType !== 'limit' || order.limitPrice === undefined || order.limitPrice <= 0) return null
    return ((last - order.limitPrice) / order.limitPrice) * 100
  }

  if (order.orderType !== 'limit' || order.price <= 0) return null
  return ((last - order.price) / order.price) * 100
}
