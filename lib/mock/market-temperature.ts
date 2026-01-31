export type MarketTempMarket = 'US' | 'HK' | 'CN'

export interface MarketTemperatureIndex {
  value: number
  label: string
  valuation: string
  sentiment: string
  trendData: number[]
}

export interface MarketTemperatureConfig {
  hasIndex: boolean
  index?: MarketTemperatureIndex
}

export interface SectorHeatmapItem {
  name: string
  slug: string
  change: number
  marketCap: number
  currency: 'USD' | 'HKD' | 'CNY'
}

export const marketTemperatureData: Record<MarketTempMarket, MarketTemperatureConfig> = {
  US: {
    hasIndex: true,
    index: {
      value: 65,
      label: 'MODERATE HEAT',
      valuation: 'HIGH',
      sentiment: 'CALM',
      trendData: [58, 60, 62, 64, 65, 66, 65],
    },
  },
  HK: {
    hasIndex: false,
  },
  CN: {
    hasIndex: true,
    index: {
      value: 72,
      label: 'MODERATELY OPTIMISTIC',
      valuation: 'ELEVATED',
      sentiment: 'ACTIVE',
      trendData: [65, 68, 70, 72, 71, 72, 72],
    },
  },
}

const usSectors: SectorHeatmapItem[] = [
  { name: 'Technology', slug: 'technology', change: 3.2, marketCap: 2.4e12, currency: 'USD' },
  { name: 'Financial', slug: 'finance', change: 1.8, marketCap: 1.8e12, currency: 'USD' },
  { name: 'Healthcare', slug: 'healthcare', change: -0.5, marketCap: 1.2e12, currency: 'USD' },
  { name: 'Consumer', slug: 'consumer', change: 2.1, marketCap: 1.5e12, currency: 'USD' },
  { name: 'Energy', slug: 'energy', change: -1.2, marketCap: 800e9, currency: 'USD' },
  { name: 'Industrials', slug: 'industrial', change: 0.8, marketCap: 900e9, currency: 'USD' },
  { name: 'Materials', slug: 'materials', change: 1.5, marketCap: 600e9, currency: 'USD' },
  { name: 'Real Estate', slug: 'real-estate', change: -0.3, marketCap: 500e9, currency: 'USD' },
  { name: 'Utilities', slug: 'utilities', change: 0.5, marketCap: 450e9, currency: 'USD' },
  { name: 'Communication', slug: 'communication', change: 2.8, marketCap: 1.1e12, currency: 'USD' },
]

const hkSectors: SectorHeatmapItem[] = [
  { name: 'Info Tech', slug: 'hk-info-tech', change: 2.5, marketCap: 1.5e12, currency: 'HKD' },
  { name: 'Financials', slug: 'hk-finance', change: 0.8, marketCap: 2.8e12, currency: 'HKD' },
  { name: 'Property', slug: 'hk-property', change: -1.2, marketCap: 600e9, currency: 'HKD' },
  { name: 'Industrial', slug: 'hk-industrial', change: 1.5, marketCap: 400e9, currency: 'HKD' },
  { name: 'Utilities', slug: 'hk-utilities', change: -0.3, marketCap: 200e9, currency: 'HKD' },
  { name: 'Energy', slug: 'hk-energy', change: 0.6, marketCap: 180e9, currency: 'HKD' },
]

const cnSectors: SectorHeatmapItem[] = [
  { name: 'Electronics', slug: 'cn-electronics', change: 4.2, marketCap: 3.5e12, currency: 'CNY' },
  { name: 'Computer', slug: 'cn-computer', change: 3.8, marketCap: 2.2e12, currency: 'CNY' },
  { name: 'Pharma', slug: 'cn-pharma', change: 1.2, marketCap: 1.8e12, currency: 'CNY' },
  { name: 'Food & Beverage', slug: 'cn-food', change: 0.5, marketCap: 1.5e12, currency: 'CNY' },
  { name: 'Banking', slug: 'cn-bank', change: -0.4, marketCap: 2.8e12, currency: 'CNY' },
  { name: 'Property', slug: 'cn-property', change: -1.5, marketCap: 1.2e12, currency: 'CNY' },
]

export const sectorHeatmapData: Record<MarketTempMarket, SectorHeatmapItem[]> = {
  US: usSectors,
  HK: hkSectors,
  CN: cnSectors,
}

export function getChangeColor(change: number): string {
  if (change < -2) return '#D32F2F'
  if (change < -0.5) return '#EF5350'
  if (change <= 0.5) return '#616161'
  if (change <= 2) return '#66BB6A'
  return '#2E7D32'
}

/** Treemap heatmap colors (大涨→大跌): deep orange-red → orange → light orange → green → teal */
export function getHeatmapColor(changePercent: number): string {
  if (changePercent >= 3) return '#FF5722'
  if (changePercent >= 1) return '#FF9800'
  if (changePercent >= 0.2) return '#FFA726'
  if (changePercent >= -0.2) return '#66BB6A'
  if (changePercent >= -1) return '#4CAF50'
  if (changePercent >= -2) return '#26A69A'
  return '#00897B'
}

export function formatMarketCap(value: number, currency: 'USD' | 'HKD' | 'CNY'): string {
  const prefix = currency === 'USD' ? '$' : currency === 'HKD' ? 'HK$' : '¥'
  if (value >= 1e12) return `${prefix}${(value / 1e12).toFixed(1)}T`
  if (value >= 1e9) return `${prefix}${(value / 1e9).toFixed(0)}B`
  return `${prefix}${(value / 1e6).toFixed(0)}M`
}
