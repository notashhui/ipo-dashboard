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
  // HK sectors (Market Temperature)
  {
    id: 'hk-info-tech',
    slug: 'hk-info-tech',
    name: 'Info Tech',
    change: 2.5,
    weight: 'HK$1.5T',
    marketCap: 'HK$1.5T',
    topStocks: [
      { ticker: '0700', name: 'Tencent', price: 368.2, changePercent: 1.5 },
      { ticker: '9988', name: 'Alibaba', price: 88.5, changePercent: 4.5 },
      { ticker: '1810', name: 'Xiaomi', price: 28.5, changePercent: 5.8 },
      { ticker: '3690', name: 'Meituan', price: 98.5, changePercent: -2.8 },
      { ticker: '9618', name: 'JD.com', price: 125.2, changePercent: -1.5 },
      { ticker: '0941', name: 'China Mobile', price: 72.5, changePercent: -0.5 },
    ],
  },
  {
    id: 'hk-finance',
    slug: 'hk-finance',
    name: 'Financials',
    change: 0.8,
    weight: 'HK$2.8T',
    marketCap: 'HK$2.8T',
    topStocks: [
      { ticker: '2318', name: 'Ping An', price: 52.3, changePercent: 2.5 },
      { ticker: '1299', name: 'AIA Group', price: 68.2, changePercent: 0.8 },
      { ticker: '0939', name: 'CCB', price: 5.82, changePercent: -0.2 },
      { ticker: '1398', name: 'ICBC', price: 4.25, changePercent: 0.1 },
      { ticker: '2388', name: 'BOC Hong Kong', price: 28.5, changePercent: 0.5 },
    ],
  },
  {
    id: 'hk-property',
    slug: 'hk-property',
    name: 'Property',
    change: -1.2,
    weight: 'HK$600B',
    marketCap: 'HK$600B',
    topStocks: [
      { ticker: '0012', name: 'Henderson Land', price: 28.2, changePercent: -1.5 },
      { ticker: '0016', name: 'SHKP', price: 85.5, changePercent: -0.8 },
      { ticker: '1113', name: 'CK Asset', price: 42.8, changePercent: -1.2 },
    ],
  },
  {
    id: 'hk-industrial',
    slug: 'hk-industrial',
    name: 'Industrial',
    change: 1.5,
    weight: 'HK$400B',
    marketCap: 'HK$400B',
    topStocks: [
      { ticker: '0669', name: 'Techtronic', price: 98.5, changePercent: 2.1 },
      { ticker: '0291', name: 'China Resources', price: 32.5, changePercent: 1.2 },
    ],
  },
  {
    id: 'hk-utilities',
    slug: 'hk-utilities',
    name: 'Utilities',
    change: -0.3,
    weight: 'HK$200B',
    marketCap: 'HK$200B',
    topStocks: [
      { ticker: '0002', name: 'CLP', price: 68.2, changePercent: -0.2 },
      { ticker: '0003', name: 'HK Electric', price: 52.5, changePercent: -0.5 },
    ],
  },
  {
    id: 'hk-energy',
    slug: 'hk-energy',
    name: 'Energy',
    change: 0.6,
    weight: 'HK$180B',
    marketCap: 'HK$180B',
    topStocks: [
      { ticker: '0883', name: 'CNOOC', price: 22.5, changePercent: 0.8 },
      { ticker: '0386', name: 'Sinopec', price: 4.52, changePercent: 0.2 },
    ],
  },
  // CN sectors (Market Temperature)
  {
    id: 'cn-electronics',
    slug: 'cn-electronics',
    name: 'Electronics',
    change: 4.2,
    weight: '¥3.5T',
    marketCap: '¥3.5T',
    topStocks: [
      { ticker: '002475', name: 'Luxshare', price: 32.5, changePercent: 5.2 },
      { ticker: '603501', name: 'Will Semiconductor', price: 88.2, changePercent: 4.8 },
      { ticker: '002241', name: 'Goertek', price: 22.8, changePercent: 3.5 },
    ],
  },
  {
    id: 'cn-computer',
    slug: 'cn-computer',
    name: 'Computer',
    change: 3.8,
    weight: '¥2.2T',
    marketCap: '¥2.2T',
    topStocks: [
      { ticker: '002230', name: 'iFlytek', price: 58.5, changePercent: 4.2 },
      { ticker: '600588', name: 'UFIDA', price: 28.2, changePercent: 3.1 },
      { ticker: '300496', name: 'ZVTEsoft', price: 42.5, changePercent: 3.8 },
    ],
  },
  {
    id: 'cn-pharma',
    slug: 'cn-pharma',
    name: 'Pharma',
    change: 1.2,
    weight: '¥1.8T',
    marketCap: '¥1.8T',
    topStocks: [
      { ticker: '600519', name: 'Kweichow Moutai', price: 1650, changePercent: 2.1 },
      { ticker: '000538', name: 'Yunnan Baiyao', price: 68.5, changePercent: 1.5 },
      { ticker: '600436', name: 'Tasly', price: 22.8, changePercent: 0.8 },
    ],
  },
  {
    id: 'cn-food',
    slug: 'cn-food',
    name: 'Food & Beverage',
    change: 0.5,
    weight: '¥1.5T',
    marketCap: '¥1.5T',
    topStocks: [
      { ticker: '000858', name: 'Wuliangye', price: 168.5, changePercent: 3.5 },
      { ticker: '600887', name: 'Yili', price: 28.2, changePercent: 0.2 },
      { ticker: '000568', name: 'Luzhou Laojiao', price: 185.5, changePercent: 0.8 },
    ],
  },
  {
    id: 'cn-bank',
    slug: 'cn-bank',
    name: 'Banking',
    change: -0.4,
    weight: '¥2.8T',
    marketCap: '¥2.8T',
    topStocks: [
      { ticker: '601318', name: 'Ping An', price: 45.8, changePercent: 1.8 },
      { ticker: '600036', name: 'China Merchants Bank', price: 38.2, changePercent: 2.3 },
      { ticker: '601166', name: 'Industrial Bank', price: 18.5, changePercent: -0.5 },
    ],
  },
  {
    id: 'cn-property',
    slug: 'cn-property',
    name: 'Property',
    change: -1.5,
    weight: '¥1.2T',
    marketCap: '¥1.2T',
    topStocks: [
      { ticker: '000002', name: 'Vanke', price: 8.52, changePercent: -2.1 },
      { ticker: '001979', name: 'Gemdale', price: 6.25, changePercent: -1.8 },
    ],
  },
]

export function getSectorBySlug(slug: string): Sector | undefined {
  return sectors.find((s) => s.slug === slug)
}
