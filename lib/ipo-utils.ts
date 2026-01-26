import type { IPOStock } from './types'

const BASE_YEAR = 2026

/** Demo IPO 01768 uses relative times so the subscription window is always open. */
function isRelativeDemo(ipo: IPOStock): boolean {
  return ipo.symbol === '01768'
}

/**
 * Parse "MM.DD" to { month, day } (1-based month).
 */
function parseMMDD(s: string): { month: number; day: number } {
  const [a, b] = s.split('.').map(Number)
  return { month: a || 1, day: b || 1 }
}

/**
 * Parse "HH:mm" to { hour, minute }. "N/A" or empty -> 9, 0.
 */
function parseHHmm(s: string): { hour: number; minute: number } {
  if (!s || s === 'N/A') return { hour: 9, minute: 0 }
  const [h, m] = s.split(':').map(Number)
  return { hour: h ?? 9, minute: m ?? 0 }
}

/**
 * "16:15-18:30" -> use "16:15".
 */
function parseGrayTime(s: string): { hour: number; minute: number } {
  if (!s || s === 'N/A') return { hour: 9, minute: 0 }
  const part = s.split('-')[0]?.trim() || s
  return parseHHmm(part)
}

function formatMMDD(d: Date): string {
  const m = d.getMonth() + 1
  const day = d.getDate()
  return `${String(m).padStart(2, '0')}.${String(day).padStart(2, '0')}`
}

function formatHHmm(d: Date): string {
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

export function getSubscriptionStart(ipo: IPOStock): Date {
  if (isRelativeDemo(ipo)) return new Date(Date.now() - 60 * 60 * 1000)
  const { month, day } = parseMMDD(ipo.timeline.start)
  const { hour, minute } = parseHHmm(ipo.timeline.startTime)
  return new Date(BASE_YEAR, month - 1, day, hour, minute, 0)
}

export function getSubscriptionEnd(ipo: IPOStock): Date {
  if (isRelativeDemo(ipo)) return new Date(Date.now() + 24 * 60 * 60 * 1000)
  const { month, day } = parseMMDD(ipo.timeline.end)
  const { hour, minute } = parseHHmm(ipo.timeline.endTime)
  return new Date(BASE_YEAR, month - 1, day, hour, minute, 0)
}

export function getResultAt(ipo: IPOStock): Date {
  if (isRelativeDemo(ipo)) return new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)
  const { month, day } = parseMMDD(ipo.timeline.result)
  return new Date(BASE_YEAR, month - 1, day, 9, 0, 0)
}

export function getGrayAt(ipo: IPOStock): Date {
  if (isRelativeDemo(ipo)) return new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
  const { month, day } = parseMMDD(ipo.timeline.gray)
  const { hour, minute } = parseGrayTime(ipo.timeline.grayTime)
  return new Date(BASE_YEAR, month - 1, day, hour, minute, 0)
}

export function getListAt(ipo: IPOStock): Date {
  if (isRelativeDemo(ipo)) return new Date(Date.now() + 4 * 24 * 60 * 60 * 1000)
  const { month, day } = parseMMDD(ipo.timeline.list)
  return new Date(BASE_YEAR, month - 1, day, 9, 0, 0)
}

export type DisplayPhase = { label: string; date: string; time: string }

export function getDisplayPhases(ipo: IPOStock): DisplayPhase[] {
  if (isRelativeDemo(ipo)) {
    const subStart = new Date(Date.now() - 60 * 60 * 1000)
    const subEnd = new Date(Date.now() + 24 * 60 * 60 * 1000)
    const resultAt = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)
    const grayAt = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
    const listAt = new Date(Date.now() + 4 * 24 * 60 * 60 * 1000)
    return [
      { label: 'Subscription Start', date: formatMMDD(subStart), time: formatHHmm(subStart) },
      { label: 'Subscription End', date: formatMMDD(subEnd), time: formatHHmm(subEnd) },
      { label: 'Results', date: formatMMDD(resultAt), time: '' },
      { label: 'Gray Market', date: formatMMDD(grayAt), time: '16:15' },
      { label: 'Listing', date: formatMMDD(listAt), time: '' },
    ]
  }
  return [
    { label: 'Subscription Start', date: ipo.timeline.start, time: ipo.timeline.startTime },
    { label: 'Subscription End', date: ipo.timeline.end, time: ipo.timeline.endTime },
    { label: 'Results', date: ipo.timeline.result, time: '' },
    { label: 'Gray Market', date: ipo.timeline.gray, time: ipo.timeline.grayTime },
    { label: 'Listing', date: ipo.timeline.list, time: '' },
  ]
}

export function getMedianIssuePrice(ipo: IPOStock): number {
  const max = ipo.issuePriceMax ?? ipo.issuePrice
  return (ipo.issuePrice + max) / 2
}

export function formatOpensIn(d: Date): string {
  const now = Date.now()
  const t = d.getTime() - now
  if (t <= 0) return 'Opens now'
  const days = Math.floor(t / (24 * 60 * 60 * 1000))
  const hours = Math.floor((t % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000))
  if (days > 0) return `Opens in ${days}d ${hours}h`
  if (hours > 0) return `Opens in ${hours}h`
  const mins = Math.floor((t % (60 * 60 * 1000)) / (60 * 1000))
  return mins > 0 ? `Opens in ${mins}m` : 'Opens now'
}

export function toISO(d: Date): string {
  return d.toISOString()
}

export function getIpoOrderDisplayStatus(order: { status: string; unlockAt: string }): string {
  if (Date.now() >= new Date(order.unlockAt).getTime()) return 'Ready'
  return order.status
}

export function getIpoOrderDisplayStage(order: {
  resultAt: string
  grayAt: string
  listAt: string
}): 'Subscription' | 'Allotment' | 'Grey Market' | 'Listed' {
  const now = Date.now()
  const r = new Date(order.resultAt).getTime()
  const g = new Date(order.grayAt).getTime()
  const l = new Date(order.listAt).getTime()
  if (now < r) return 'Subscription'
  if (now < g) return 'Allotment'
  if (now < l) return 'Grey Market'
  return 'Listed'
}
