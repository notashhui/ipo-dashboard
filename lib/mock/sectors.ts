export interface SectorStock {
  ticker: string
  name: string
  price: number
  changePercent: number
}

export interface Sector {
  id: string
  slug: string
  name: string
  change: number
  weight: string
  marketCap?: string
  topStocks: SectorStock[]
}

export const sectors: Sector[] = [
  {
    id: 'tech',
    slug: 'technology',
    name: 'Technology',
    change: 3.2,
    weight: '$2.4T',
    marketCap: '$2.4T',
    topStocks: [
      { ticker: 'NVDA', name: 'NVIDIA Corp', price: 135.58, changePercent: 2.45 },
      { ticker: 'AAPL', name: 'Apple Inc', price: 178.23, changePercent: 3.45 },
      { ticker: 'MSFT', name: 'Microsoft Corp', price: 378.92, changePercent: 2.28 },
      { ticker: 'GOOGL', name: 'Alphabet Inc', price: 141.80, changePercent: -0.86 },
      { ticker: 'META', name: 'Meta Platforms', price: 505.12, changePercent: -0.83 },
      { ticker: 'AMZN', name: 'Amazon.com Inc', price: 178.25, changePercent: 1.97 },
      { ticker: 'TSM', name: 'Taiwan Semi', price: 142.56, changePercent: 1.51 },
      { ticker: 'AMD', name: 'AMD Inc', price: 156.78, changePercent: 3.0 },
    ],
  },
  {
    id: 'fin',
    slug: 'finance',
    name: 'Finance',
    change: 1.8,
    weight: '$1.2T',
    marketCap: '$1.2T',
    topStocks: [
      { ticker: 'JPM', name: 'JPMorgan Chase', price: 198.45, changePercent: 1.82 },
      { ticker: 'BAC', name: 'Bank of America', price: 35.62, changePercent: 2.11 },
      { ticker: 'WFC', name: 'Wells Fargo', price: 52.30, changePercent: 1.45 },
      { ticker: 'GS', name: 'Goldman Sachs', price: 425.80, changePercent: 1.92 },
      { ticker: 'MS', name: 'Morgan Stanley', price: 98.20, changePercent: 1.65 },
      { ticker: 'C', name: 'Citigroup', price: 62.15, changePercent: 2.08 },
      { ticker: 'AXP', name: 'American Express', price: 245.30, changePercent: 1.55 },
      { ticker: 'BLK', name: 'BlackRock', price: 892.40, changePercent: 1.22 },
    ],
  },
  {
    id: 'energy',
    slug: 'energy',
    name: 'Energy',
    change: -0.5,
    weight: '$800B',
    marketCap: '$800B',
    topStocks: [
      { ticker: 'XOM', name: 'Exxon Mobil', price: 108.52, changePercent: -0.42 },
      { ticker: 'CVX', name: 'Chevron', price: 152.30, changePercent: -0.58 },
      { ticker: 'COP', name: 'ConocoPhillips', price: 118.90, changePercent: -0.35 },
      { ticker: 'EOG', name: 'EOG Resources', price: 132.45, changePercent: -0.72 },
      { ticker: 'SLB', name: 'Schlumberger', price: 52.80, changePercent: -0.28 },
      { ticker: 'MPC', name: 'Marathon Petroleum', price: 185.60, changePercent: -0.61 },
      { ticker: 'VLO', name: 'Valero Energy', price: 142.20, changePercent: -0.39 },
      { ticker: 'PSX', name: 'Phillips 66', price: 155.40, changePercent: -0.45 },
    ],
  },
  {
    id: 'healthcare',
    slug: 'healthcare',
    name: 'Healthcare',
    change: 0.9,
    weight: '$600B',
    marketCap: '$600B',
    topStocks: [
      { ticker: 'UNH', name: 'UnitedHealth', price: 525.80, changePercent: 1.12 },
      { ticker: 'JNJ', name: 'Johnson & Johnson', price: 158.40, changePercent: 0.85 },
      { ticker: 'PFE', name: 'Pfizer', price: 28.92, changePercent: 0.72 },
      { ticker: 'ABBV', name: 'AbbVie', price: 178.50, changePercent: 0.95 },
      { ticker: 'MRK', name: 'Merck', price: 128.60, changePercent: 0.88 },
      { ticker: 'TMO', name: 'Thermo Fisher', price: 585.20, changePercent: 1.05 },
      { ticker: 'ABT', name: 'Abbott', price: 112.40, changePercent: 0.62 },
      { ticker: 'DHR', name: 'Danaher', price: 258.90, changePercent: 0.78 },
    ],
  },
  {
    id: 'consumer',
    slug: 'consumer',
    name: 'Consumer',
    change: -1.2,
    weight: '$500B',
    marketCap: '$500B',
    topStocks: [
      { ticker: 'AMZN', name: 'Amazon.com Inc', price: 178.25, changePercent: -1.15 },
      { ticker: 'TSLA', name: 'Tesla Inc', price: 248.50, changePercent: -1.42 },
      { ticker: 'HD', name: 'Home Depot', price: 385.20, changePercent: -1.08 },
      { ticker: 'MCD', name: "McDonald's", price: 298.60, changePercent: -0.95 },
      { ticker: 'NKE', name: 'Nike', price: 98.45, changePercent: -1.25 },
      { ticker: 'SBUX', name: 'Starbucks', price: 92.30, changePercent: -1.18 },
      { ticker: 'TGT', name: 'Target', price: 168.90, changePercent: -1.32 },
      { ticker: 'LOW', name: "Lowe's", price: 242.50, changePercent: -1.05 },
    ],
  },
  {
    id: 'industrial',
    slug: 'industrial',
    name: 'Industrial',
    change: 2.1,
    weight: '$400B',
    marketCap: '$400B',
    topStocks: [
      { ticker: 'CAT', name: 'Caterpillar', price: 385.60, changePercent: 2.35 },
      { ticker: 'DE', name: 'Deere & Co', price: 425.80, changePercent: 2.18 },
      { ticker: 'UNP', name: 'Union Pacific', price: 245.90, changePercent: 1.95 },
      { ticker: 'UPS', name: 'UPS', price: 158.40, changePercent: 2.08 },
      { ticker: 'HON', name: 'Honeywell', price: 218.50, changePercent: 1.88 },
      { ticker: 'RTX', name: 'RTX Corp', price: 112.60, changePercent: 2.22 },
      { ticker: 'LMT', name: 'Lockheed Martin', price: 485.20, changePercent: 1.92 },
      { ticker: 'BA', name: 'Boeing', price: 235.80, changePercent: 2.45 },
    ],
  },
]

export function getSectorBySlug(slug: string): Sector | undefined {
  return sectors.find((s) => s.slug === slug)
}
