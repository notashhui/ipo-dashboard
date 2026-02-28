'use client'

import { useCallback, useEffect, useState } from 'react'
import type { CorporateAction, CorporateActionStatus, CorporateActionType, Holding } from '@/lib/types'
import {
  applyCorporateActionToHolding,
  calculateCorporateActionImpact,
  createCorporateActionHistoryEntry,
} from '@/lib/corporate-actions'

const CORPORATE_ACTIONS_KEY = 'corporate-actions'

function loadCorporateActions(): CorporateAction[] {
  if (typeof window === 'undefined') return []

  try {
    const raw = localStorage.getItem(CORPORATE_ACTIONS_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed as CorporateAction[] : []
  } catch {
    return []
  }
}

function saveCorporateActions(actions: CorporateAction[]) {
  if (typeof window === 'undefined') return

  try {
    localStorage.setItem(CORPORATE_ACTIONS_KEY, JSON.stringify(actions))
  } catch {}
}

function createMockCorporateAction(
  holding: Holding,
  type: CorporateActionType,
  ratioNumerator: number,
  ratioDenominator: number
): CorporateAction {
  const createdAt = new Date().toISOString()
  const effectiveAt = new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString()
  const impact = calculateCorporateActionImpact(holding, type, ratioNumerator, ratioDenominator)

  return {
    id: `CA-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
    ticker: holding.symbol,
    type,
    ratioNumerator,
    ratioDenominator,
    effectiveAt,
    createdAt,
    status: 'upcoming',
    snapshots: {
      before: impact.before,
      after: impact.after,
    },
    cashInLieu: impact.cashInLieu,
    notes: [
      type === 'split'
        ? 'Share count increases and average cost decreases proportionally.'
        : 'Reverse split may generate cash in lieu for fractional shares.',
      'Estimated market value should remain approximately unchanged aside from market price movement.',
    ],
    disclosures: [
      'Corporate actions are informational and use local mock data only.',
      'Fractional treatment for reverse split defaults to round down with cash in lieu for the fraction.',
    ],
    history: [
      createCorporateActionHistoryEntry('upcoming', `Created mock ${type === 'split' ? 'split' : 'reverse split'} event.`),
    ],
  }
}

export function useCorporateActions() {
  const [actions, setActions] = useState<CorporateAction[]>([])
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    setActions(loadCorporateActions())
    setIsHydrated(true)
  }, [])

  const persistActions = useCallback((updater: CorporateAction[] | ((current: CorporateAction[]) => CorporateAction[])) => {
    setActions((current) => {
      const next = typeof updater === 'function' ? updater(current) : updater
      saveCorporateActions(next)
      return next
    })
  }, [])

  const createMockAction = useCallback((holding: Holding, type: CorporateActionType) => {
    const ratio = type === 'split'
      ? { numerator: 2, denominator: 1 }
      : { numerator: 1, denominator: 10 }
    const action = createMockCorporateAction(holding, type, ratio.numerator, ratio.denominator)
    persistActions((current) => [action, ...current])
    return action
  }, [persistActions])

  const applyAction = useCallback((
    actionId: string,
    holdings: Holding[],
    setHoldings: (updater: Holding[] | ((current: Holding[]) => Holding[])) => void
  ) => {
    const action = actions.find((entry) => entry.id === actionId)
    if (!action || action.status === 'applied') return undefined

    const holding = holdings.find((entry) => entry.symbol === action.ticker)
    if (!holding) return undefined

    const result = applyCorporateActionToHolding(holding, action)
    const appliedAt = new Date().toISOString()

    setHoldings((current) =>
      current.map((entry) => (entry.symbol === action.ticker ? result.holding : entry))
    )

    let updatedAction: CorporateAction | undefined
    persistActions((current) =>
      current.map((entry) => {
        if (entry.id !== actionId) return entry

        updatedAction = {
          ...entry,
          status: 'applied',
          appliedAt,
          snapshots: {
            before: result.impact.before,
            after: result.impact.after,
          },
          cashInLieu: result.impact.cashInLieu,
          history: [
            createCorporateActionHistoryEntry('applied', `Applied to ${entry.ticker} holdings.`),
            ...entry.history,
          ],
        }
        return updatedAction
      })
    )

    return updatedAction
  }, [actions, persistActions])

  const getActionById = useCallback((id: string) => {
    return actions.find((action) => action.id === id)
  }, [actions])

  const getActionsByStatus = useCallback((status: CorporateActionStatus) => {
    return actions.filter((action) => action.status === status)
  }, [actions])

  const getUpcomingActionForTicker = useCallback((ticker: string) => {
    return actions.find((action) => action.ticker === ticker && action.status === 'upcoming')
  }, [actions])

  const getAppliedActionForTickerToday = useCallback((ticker: string) => {
    const today = new Date().toDateString()
    return actions.find((action) =>
      action.ticker === ticker &&
      action.status === 'applied' &&
      action.appliedAt &&
      new Date(action.appliedAt).toDateString() === today
    )
  }, [actions])

  return {
    actions,
    isHydrated,
    createMockAction,
    applyAction,
    getActionById,
    getActionsByStatus,
    getUpcomingActionForTicker,
    getAppliedActionForTickerToday,
  }
}
