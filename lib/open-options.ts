import type { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime'

export type OptionsEntrySource = 'home' | 'markets'

export function buildOptionsTradeHref(ticker: string, source: OptionsEntrySource, returnTo: string) {
  return `/?tab=trade&assetClass=options&ticker=${ticker}&source=${source}&returnTo=${encodeURIComponent(returnTo)}`
}

export function openOptions(
  router: AppRouterInstance,
  ticker: string,
  source: OptionsEntrySource,
  returnTo: string
) {
  router.push(buildOptionsTradeHref(ticker, source, returnTo))
}
