import type { PopularStrategy, Indicator, ScanResult } from '@/lib/types'

// Popular Strategies
export const popularStrategies: PopularStrategy[] = [
  { id: 'high-dividend', name: 'High Dividend Blue Chip Stocks', icon: '🔥' },
  { id: 'high-growth', name: 'High Growth Companies', icon: '🔥' },
  { id: 'semiconductor', name: 'Semiconductor Industry Companies', icon: '🔥' },
]

// Indicators by Category
export const indicators: Record<string, Indicator[]> = {
  common: [
    { id: 'market-cap', name: 'Market Cap', category: 'common' },
    { id: 'price', name: 'Price', category: 'common' },
    { id: 'pe-ttm', name: 'P/E Ratio (TTM)', category: 'common' },
    { id: 'pb-mrq', name: 'P/B Ratio (MRQ)', category: 'common' },
    { id: 'roe-ttm', name: 'ROE (TTM)', category: 'common' },
    { id: 'revenue-growth-ttm', name: 'Revenue Growth (TTM)', category: 'common' },
    { id: 'profit-growth-ttm', name: 'Net Profit Growth (TTM)', category: 'common' },
    { id: 'price-change', name: 'Price Change', category: 'common' },
    { id: 'net-profit-ttm', name: 'Net Profit (TTM)', category: 'common' },
    { id: 'dividend-yield-ttm', name: 'Dividend Yield (TTM)', category: 'common' },
  ],
  market: [
    { id: 'market-cap', name: 'Market Cap', category: 'market' },
    { id: 'price', name: 'Price', category: 'market' },
    { id: 'price-change', name: 'Price Change', category: 'market' },
    { id: 'volume', name: 'Volume', category: 'market' },
    { id: 'turnover', name: 'Turnover', category: 'market' },
    { id: 'volume-ratio', name: 'Volume Ratio', category: 'market' },
    { id: 'turnover-rate', name: 'Turnover Rate', category: 'market' },
    { id: 'amplitude', name: 'Amplitude', category: 'market' },
  ],
  valuation: [
    { id: 'pe-ttm', name: 'P/E Ratio (TTM)', category: 'valuation' },
    { id: 'pb-mrq', name: 'P/B Ratio (MRQ)', category: 'valuation' },
    { id: 'ps-ttm', name: 'P/S Ratio (TTM)', category: 'valuation' },
  ],
  profitability: [
    { id: 'roe', name: 'ROE', category: 'profitability' },
    { id: 'roa', name: 'Return on Assets', category: 'profitability' },
    { id: 'gross-margin', name: 'Gross Margin', category: 'profitability' },
    { id: 'net-margin', name: 'Net Margin', category: 'profitability' },
    { id: 'revenue-growth', name: 'Revenue Growth', category: 'profitability' },
    { id: 'profit-growth', name: 'Profit Growth', category: 'profitability' },
  ],
}

// Mock Scan Results
export const mockScanResults: ScanResult[] = [
  { symbol: 'BKNG', name: 'Booking', price: 5098.50, changePercent: -1.02, revenue: 21500000000, watchlistCount: 2000 },
  { symbol: 'SEB', name: 'Seaboard', price: 4876.67, changePercent: -0.27, revenue: 8900000000, watchlistCount: 91 },
  { symbol: 'FRFHF', name: 'Fairfax Financial Holdings Limited', price: 1673.10, changePercent: -0.79, revenue: 12500000000, watchlistCount: 136 },
  { symbol: 'BLK', name: 'BlackRock', price: 945.23, changePercent: 0.90, revenue: 17800000000, watchlistCount: 1000 },
  { symbol: 'GS', name: 'Goldman Sachs', price: 456.78, changePercent: 0.39, revenue: 46200000000, watchlistCount: 485 },
  { symbol: 'MS', name: 'Morgan Stanley', price: 98.45, changePercent: 1.43, revenue: 54000000000, watchlistCount: 892 },
  { symbol: 'JPM', name: 'JPMorgan Chase', price: 198.32, changePercent: -0.56, revenue: 158000000000, watchlistCount: 2100 },
  { symbol: 'BAC', name: 'Bank of America', price: 45.67, changePercent: 0.82, revenue: 91000000000, watchlistCount: 756 },
]
