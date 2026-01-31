import type { IndexDetail, IndexCode } from '@/lib/types'

export const mockIndexData: Record<IndexCode, IndexDetail> = {
  NASDAQ: {
    code: 'NASDAQ',
    name: 'NASDAQ 100 Index',
    value: 18987.47,
    change: 120.3,
    changePercent: 0.64,
    todayRange: { low: 18850, high: 19020 },
    fiftyTwoWeekRange: { low: 16200, high: 19500 },
    chartData: {
      daily: [
        { date: '2025-01-20', open: 18850, close: 18900, high: 18920, low: 18840 },
        { date: '2025-01-21', open: 18900, close: 18950, high: 18980, low: 18890 },
        { date: '2025-01-22', open: 18950, close: 18920, high: 18960, low: 18900 },
        { date: '2025-01-23', open: 18920, close: 18980, high: 19000, low: 18910 },
        { date: '2025-01-24', open: 18980, close: 18987, high: 19020, low: 18970 },
      ],
    },
    constituents: [
      { rank: 1, symbol: 'AAPL', name: 'Apple Inc.', price: 178.2, change: 3.1, changeAmount: 5.4, marketCap: 2.8e12, weight: 12.5, sector: 'Technology', trendData: [172, 173, 175, 176, 177, 177.5, 178.2], volume: 45000000 },
      { rank: 2, symbol: 'MSFT', name: 'Microsoft Corporation', price: 412.5, change: 2.8, changeAmount: 11.2, marketCap: 3.1e12, weight: 11.8, sector: 'Technology', trendData: [400, 402, 405, 408, 410, 411, 412.5], volume: 38000000 },
      { rank: 3, symbol: 'NVDA', name: 'Nvidia Corporation', price: 875.2, change: 4.1, changeAmount: 34.5, marketCap: 2.2e12, weight: 8.3, sector: 'Technology', trendData: [840, 845, 850, 860, 865, 870, 875.2], volume: 52000000 },
      { rank: 4, symbol: 'AMZN', name: 'Amazon.com Inc.', price: 178.5, change: 1.8, changeAmount: 3.15, marketCap: 1.9e12, weight: 7.2, sector: 'Consumer', trendData: [174, 175, 176, 177, 177.5, 178, 178.5], volume: 42000000 },
      { rank: 5, symbol: 'META', name: 'Meta Platforms Inc.', price: 445.2, change: -1.2, changeAmount: -5.4, marketCap: 1.2e12, weight: 6.5, sector: 'Communication', trendData: [450, 448, 447, 446, 445.5, 445, 445.2], volume: 28000000 },
      { rank: 6, symbol: 'GOOGL', name: 'Alphabet Inc.', price: 142.8, change: 2.1, changeAmount: 2.95, marketCap: 1.8e12, weight: 5.9, sector: 'Communication', trendData: [139, 140, 141, 141.5, 142, 142.5, 142.8], volume: 35000000 },
      { rank: 7, symbol: 'TSLA', name: 'Tesla Inc.', price: 245.3, change: 5.2, changeAmount: 12.15, marketCap: 7.8e11, weight: 4.2, sector: 'Consumer', trendData: [233, 235, 238, 240, 242, 244, 245.3], volume: 98000000 },
      { rank: 8, symbol: 'AVGO', name: 'Broadcom Inc.', price: 1285.5, change: 2.5, changeAmount: 31.35, marketCap: 5.9e11, weight: 3.1, sector: 'Technology', trendData: [1250, 1260, 1270, 1280, 1282, 1284, 1285.5], volume: 2100000 },
    ],
  },
  HSI: {
    code: 'HSI',
    name: 'Hang Seng Index',
    value: 19420.15,
    change: -156.4,
    changePercent: -0.8,
    todayRange: { low: 19380, high: 19580 },
    fiftyTwoWeekRange: { low: 15500, high: 22000 },
    chartData: {
      daily: [
        { date: '2025-01-20', open: 19550, close: 19520, high: 19580, low: 19480 },
        { date: '2025-01-21', open: 19520, close: 19480, high: 19540, low: 19450 },
        { date: '2025-01-22', open: 19480, close: 19450, high: 19500, low: 19420 },
        { date: '2025-01-23', open: 19450, close: 19420, high: 19480, low: 19380 },
        { date: '2025-01-24', open: 19420, close: 19420, high: 19480, low: 19380 },
      ],
    },
    constituents: [
      { rank: 1, symbol: '0700', name: 'Tencent Holdings', price: 368.2, change: 1.5, changeAmount: 5.45, marketCap: 3.5e12, weight: 9.8, sector: 'Technology', trendData: [360, 362, 364, 365, 367, 368, 368.2], volume: 25000000 },
      { rank: 2, symbol: '9988', name: 'Alibaba', price: 88.5, change: 4.5, changeAmount: 3.8, marketCap: 1.9e12, weight: 8.2, sector: 'Technology', trendData: [84, 85, 86, 87, 87.5, 88, 88.5], volume: 45000000 },
      { rank: 3, symbol: '0941', name: 'China Mobile', price: 72.5, change: -0.5, changeAmount: -0.36, marketCap: 1.5e12, weight: 6.5, sector: 'Communication', trendData: [72.8, 72.7, 72.6, 72.5, 72.5, 72.5, 72.5], volume: 18000000 },
      { rank: 4, symbol: '3690', name: 'Meituan', price: 98.5, change: -2.8, changeAmount: -2.84, marketCap: 6.2e11, weight: 4.1, sector: 'Technology', trendData: [100, 99.5, 99, 98.8, 98.5, 98.6, 98.5], volume: 22000000 },
      { rank: 5, symbol: '2318', name: 'Ping An', price: 52.3, change: 2.5, changeAmount: 1.28, marketCap: 9.5e11, weight: 3.8, sector: 'Financial', trendData: [50.5, 51, 51.5, 52, 52.1, 52.2, 52.3], volume: 32000000 },
      { rank: 6, symbol: '1299', name: 'AIA Group', price: 68.2, change: 0.8, changeAmount: 0.54, marketCap: 8.1e11, weight: 3.2, sector: 'Financial', trendData: [67.5, 67.7, 67.9, 68, 68.1, 68.2, 68.2], volume: 12000000 },
      { rank: 7, symbol: '1810', name: 'Xiaomi Corp.', price: 28.5, change: 5.8, changeAmount: 1.55, marketCap: 7.2e11, weight: 2.9, sector: 'Technology', trendData: [26.5, 27, 27.5, 28, 28.2, 28.4, 28.5], volume: 85000000 },
      { rank: 8, symbol: '2382', name: 'Sunny Optical', price: 52.8, change: -1.2, changeAmount: -0.64, marketCap: 5.8e10, weight: 1.5, sector: 'Technology', trendData: [53.2, 53, 52.9, 52.8, 52.8, 52.8, 52.8], volume: 5200000 },
    ],
  },
  DJI: {
    code: 'DJI',
    name: 'Dow Jones Industrial Average',
    value: 43870.2,
    change: 54.1,
    changePercent: 0.12,
    todayRange: { low: 43800, high: 43950 },
    fiftyTwoWeekRange: { low: 38000, high: 44500 },
    chartData: {
      daily: [
        { date: '2025-01-20', open: 43800, close: 43850, high: 43880, low: 43780 },
        { date: '2025-01-21', open: 43850, close: 43880, high: 43920, low: 43840 },
        { date: '2025-01-22', open: 43880, close: 43860, high: 43900, low: 43850 },
        { date: '2025-01-23', open: 43860, close: 43900, high: 43930, low: 43850 },
        { date: '2025-01-24', open: 43900, close: 43870, high: 43950, low: 43860 },
      ],
    },
    constituents: [
      { rank: 1, symbol: 'UNH', name: 'UnitedHealth Group', price: 512.3, change: 1.2, changeAmount: 6.08, marketCap: 4.8e11, weight: 8.5, sector: 'Healthcare', trendData: [505, 507, 508, 510, 511, 512, 512.3], volume: 3200000 },
      { rank: 2, symbol: 'GS', name: 'Goldman Sachs', price: 456.8, change: 0.9, changeAmount: 4.08, marketCap: 1.5e11, weight: 6.2, sector: 'Financial', trendData: [452, 454, 455, 456, 456.5, 456.7, 456.8], volume: 2100000 },
      { rank: 3, symbol: 'MSFT', name: 'Microsoft Corporation', price: 412.5, change: 2.8, changeAmount: 11.2, marketCap: 3.1e12, weight: 5.8, sector: 'Technology', trendData: [400, 402, 405, 408, 410, 411, 412.5], volume: 38000000 },
      { rank: 4, symbol: 'HD', name: 'Home Depot', price: 385.2, change: -0.5, changeAmount: -1.93, marketCap: 3.8e11, weight: 5.2, sector: 'Consumer', trendData: [386, 385.8, 385.5, 385.3, 385.2, 385.2, 385.2], volume: 4200000 },
      { rank: 5, symbol: 'CAT', name: 'Caterpillar', price: 368.5, change: 1.8, changeAmount: 6.52, marketCap: 1.9e11, weight: 4.8, sector: 'Industrial', trendData: [360, 362, 365, 367, 368, 368.3, 368.5], volume: 3800000 },
      { rank: 6, symbol: 'AMGN', name: 'Amgen', price: 312.8, change: 0.6, changeAmount: 1.87, marketCap: 1.7e11, weight: 4.2, sector: 'Healthcare', trendData: [310, 311, 311.5, 312, 312.5, 312.7, 312.8], volume: 2800000 },
      { rank: 7, symbol: 'MCD', name: "McDonald's", price: 298.5, change: -0.3, changeAmount: -0.9, marketCap: 2.2e11, weight: 3.9, sector: 'Consumer', trendData: [299, 298.8, 298.6, 298.5, 298.5, 298.5, 298.5], volume: 2500000 },
      { rank: 8, symbol: 'V', name: 'Visa Inc.', price: 285.2, change: 1.1, changeAmount: 3.11, marketCap: 5.8e11, weight: 3.5, sector: 'Financial', trendData: [281, 282, 283, 284, 285, 285.1, 285.2], volume: 6200000 },
    ],
  },
}

export function getIndexByCode(code: string): IndexDetail | null {
  const c = code.toUpperCase() as IndexCode
  return mockIndexData[c] ?? null
}
