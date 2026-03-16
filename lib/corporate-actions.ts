import type {
  CorporateAction,
  CorporateActionHistoryEntry,
  CorporateActionSnapshot,
  CorporateActionType,
  Holding,
} from './types'

function roundTo(value: number, digits = 4) {
  return Number(value.toFixed(digits))
}

export function getCorporateActionRatioLabel(action: Pick<CorporateAction, 'ratioNumerator' | 'ratioDenominator'>) {
  return `${action.ratioNumerator}:${action.ratioDenominator}`
}

export function calculateCorporateActionImpact(
  holding: Holding,
  type: CorporateActionType,
  ratioNumerator: number,
  ratioDenominator: number
) {
  const beforeShares = holding.quantity
  const beforeAvgCost = holding.avgCost
  const beforeTotalCost = beforeShares * beforeAvgCost
  const lastPrice = holding.currentPrice
  const ratio = ratioNumerator / ratioDenominator

  const exactShares = beforeShares * ratio
  const roundedShares = type === 'reverse_split' ? Math.floor(exactShares) : exactShares
  const fractionalShares = type === 'reverse_split' ? exactShares - roundedShares : 0
  const afterShares = roundTo(roundedShares, 4)
  const afterAvgCost = roundTo(beforeAvgCost / ratio, 4)
  const estimatedPriceAfter = roundTo(lastPrice / ratio, 4)
  const cashInLieu = type === 'reverse_split' ? roundTo(fractionalShares * lastPrice, 2) : 0

  const before: CorporateActionSnapshot = {
    shares: roundTo(beforeShares, 4),
    avgCost: roundTo(beforeAvgCost, 4),
    totalCost: roundTo(beforeTotalCost, 2),
    estimatedPriceAfter: roundTo(lastPrice, 4),
    estimatedValue: roundTo(holding.marketValue, 2),
  }

  const after: CorporateActionSnapshot = {
    shares: afterShares,
    avgCost: afterAvgCost,
    totalCost: roundTo(afterShares * afterAvgCost, 2),
    estimatedPriceAfter,
    estimatedValue: roundTo(afterShares * estimatedPriceAfter + cashInLieu, 2),
  }

  return {
    before,
    after,
    fractionalShares: roundTo(fractionalShares, 6),
    cashInLieu: cashInLieu > 0 ? cashInLieu : undefined,
  }
}

export function applyCorporateActionToHolding(holding: Holding, action: CorporateAction) {
  const impact = calculateCorporateActionImpact(
    holding,
    action.type,
    action.ratioNumerator,
    action.ratioDenominator
  )

  const quantity = impact.after.shares
  const avgCost = impact.after.avgCost
  const currentPrice = impact.after.estimatedPriceAfter
  const marketValue = roundTo(quantity * currentPrice, 2)
  const unrealizedPL = roundTo(marketValue - quantity * avgCost, 2)
  const unrealizedPLPercent = quantity > 0 && avgCost > 0
    ? roundTo((unrealizedPL / (quantity * avgCost)) * 100, 2)
    : 0

  const updatedHolding: Holding = {
    ...holding,
    quantity,
    avgCost,
    currentPrice,
    marketValue,
    unrealizedPL,
    unrealizedPLPercent,
  }

  return {
    holding: updatedHolding,
    impact,
  }
}

export function createCorporateActionHistoryEntry(status: CorporateAction['status'], note: string): CorporateActionHistoryEntry {
  return {
    status,
    timestamp: new Date().toISOString(),
    note,
  }
}
