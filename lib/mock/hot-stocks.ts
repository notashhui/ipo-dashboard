import type { HotStockItem, HotDimension, HotMarket } from '@/lib/types'

const gainersUs: HotStockItem[] = [
  { symbol: 'TSLA', name: 'Tesla Inc.', price: 245.3, change: 5.2, changeAmount: 12.15, currency: 'USD', trendData: [233, 235, 238, 240, 242, 244, 245.3], heat: 'high' },
  { symbol: 'NVDA', name: 'Nvidia Corp.', price: 875.2, change: 4.1, changeAmount: 34.5, currency: 'USD', trendData: [840, 845, 850, 860, 865, 870, 875.2], heat: 'high' },
  { symbol: 'AAPL', name: 'Apple Inc.', price: 178.2, change: 3.1, changeAmount: 5.4, currency: 'USD', trendData: [172, 173, 175, 176, 177, 177.5, 178.2], heat: 'medium' },
  { symbol: 'MSFT', name: 'Microsoft Corp.', price: 412.5, change: 2.8, changeAmount: 11.2, currency: 'USD', trendData: [400, 402, 405, 408, 410, 411, 412.5], heat: 'medium' },
]

const gainersHk: HotStockItem[] = [
  { symbol: '9988', name: 'Alibaba', price: 88.5, change: 4.5, changeAmount: 3.8, currency: 'HKD', trendData: [84, 85, 86, 87, 87.5, 88, 88.5], heat: 'high' },
  { symbol: '0700', name: 'Tencent Holdings', price: 368.2, change: 3.2, changeAmount: 11.4, currency: 'HKD', trendData: [356, 358, 360, 363, 365, 367, 368.2], heat: 'high' },
  { symbol: '1810', name: 'Xiaomi Corp.', price: 28.5, change: 5.8, changeAmount: 1.55, currency: 'HKD', trendData: [26.5, 27, 27.5, 28, 28.2, 28.4, 28.5], heat: 'medium' },
  { symbol: '2318', name: 'Ping An', price: 52.3, change: 2.5, changeAmount: 1.28, currency: 'HKD', trendData: [50.5, 51, 51.5, 52, 52.1, 52.2, 52.3], heat: 'low' },
]

const gainersCn: HotStockItem[] = [
  { symbol: '600519', name: 'Kweichow Moutai', price: 1650, change: 2.1, changeAmount: 34, currency: 'CNY', trendData: [1615, 1620, 1625, 1635, 1640, 1645, 1650], heat: 'medium' },
  { symbol: '000858', name: 'Wuliangye', price: 168.5, change: 3.5, changeAmount: 5.7, currency: 'CNY', trendData: [162, 163, 165, 166, 167, 168, 168.5], heat: 'medium' },
  { symbol: '601318', name: 'Ping An', price: 45.8, change: 1.8, changeAmount: 0.81, currency: 'CNY', trendData: [44.5, 44.8, 45, 45.3, 45.5, 45.7, 45.8], heat: 'low' },
  { symbol: '600036', name: 'China Merchants Bank', price: 38.2, change: 2.3, changeAmount: 0.86, currency: 'CNY', trendData: [37, 37.2, 37.5, 37.8, 38, 38.1, 38.2], heat: 'low' },
]

const losersUs: HotStockItem[] = [
  { symbol: 'META', name: 'Meta Platforms', price: 445.2, change: -3.5, changeAmount: -16.1, currency: 'USD', trendData: [460, 458, 455, 450, 448, 446, 445.2], heat: 'medium' },
  { symbol: 'AMZN', name: 'Amazon.com', price: 175.8, change: -2.1, changeAmount: -3.78, currency: 'USD', trendData: [178, 177, 176.5, 176, 175.5, 176, 175.8], heat: 'medium' },
  { symbol: 'GOOGL', name: 'Alphabet', price: 139.5, change: -1.5, changeAmount: -2.12, currency: 'USD', trendData: [141, 140.5, 140, 139.8, 139.5, 139.6, 139.5], heat: 'low' },
  { symbol: 'NFLX', name: 'Netflix', price: 485.2, change: -1.2, changeAmount: -5.89, currency: 'USD', trendData: [490, 488, 487, 486, 485.5, 485, 485.2], heat: 'low' },
]

const losersHk: HotStockItem[] = [
  { symbol: '3690', name: 'Meituan', price: 98.5, change: -2.8, changeAmount: -2.84, currency: 'HKD', trendData: [100, 99.5, 99, 98.8, 98.5, 98.6, 98.5], heat: 'medium' },
  { symbol: '9618', name: 'JD.com', price: 125.2, change: -1.5, changeAmount: -1.91, currency: 'HKD', trendData: [126, 125.8, 125.5, 125.3, 125.2, 125.2, 125.2], heat: 'low' },
  { symbol: '9988', name: 'Alibaba', price: 84.2, change: -1.2, changeAmount: -1.02, currency: 'HKD', trendData: [85, 84.8, 84.5, 84.3, 84.2, 84.2, 84.2], heat: 'low' },
  { symbol: '0941', name: 'China Mobile', price: 72.5, change: -0.8, changeAmount: -0.58, currency: 'HKD', trendData: [73, 72.8, 72.6, 72.5, 72.5, 72.5, 72.5], heat: 'low' },
]

const losersCn: HotStockItem[] = [
  { symbol: '601857', name: 'PetroChina', price: 8.52, change: -1.2, changeAmount: -0.1, currency: 'CNY', trendData: [8.6, 8.58, 8.55, 8.53, 8.52, 8.52, 8.52], heat: 'low' },
  { symbol: '601988', name: 'Bank of China', price: 4.25, change: -0.9, changeAmount: -0.04, currency: 'CNY', trendData: [4.28, 4.27, 4.26, 4.25, 4.25, 4.25, 4.25], heat: 'low' },
  { symbol: '600030', name: 'CITIC Securities', price: 22.8, change: -1.3, changeAmount: -0.3, currency: 'CNY', trendData: [23, 22.9, 22.85, 22.82, 22.8, 22.8, 22.8], heat: 'low' },
  { symbol: '000333', name: 'Midea Group', price: 68.5, change: -0.7, changeAmount: -0.48, currency: 'CNY', trendData: [68.9, 68.8, 68.7, 68.6, 68.5, 68.5, 68.5], heat: 'low' },
]

const volumeUs: HotStockItem[] = [
  { symbol: 'NVDA', name: 'Nvidia Corp.', price: 875.2, change: 4.1, changeAmount: 34.5, currency: 'USD', trendData: [840, 845, 850, 860, 865, 870, 875.2], heat: 'high' },
  { symbol: 'TSLA', name: 'Tesla Inc.', price: 245.3, change: 5.2, changeAmount: 12.15, currency: 'USD', trendData: [233, 235, 238, 240, 242, 244, 245.3], heat: 'high' },
  { symbol: 'AAPL', name: 'Apple Inc.', price: 178.2, change: 3.1, changeAmount: 5.4, currency: 'USD', trendData: [172, 173, 175, 176, 177, 177.5, 178.2], heat: 'medium' },
  { symbol: 'AMD', name: 'AMD Inc.', price: 156.8, change: 3.0, changeAmount: 4.57, currency: 'USD', trendData: [152, 154, 155, 156, 156.5, 156.7, 156.8], heat: 'medium' },
]

const volumeHk: HotStockItem[] = gainersHk
const volumeCn: HotStockItem[] = gainersCn

const trendingUs: HotStockItem[] = [
  { symbol: 'NVDA', name: 'Nvidia Corp.', price: 875.2, change: 4.1, changeAmount: 34.5, currency: 'USD', trendData: [840, 845, 850, 860, 865, 870, 875.2], heat: 'high' },
  { symbol: 'TSLA', name: 'Tesla Inc.', price: 245.3, change: 5.2, changeAmount: 12.15, currency: 'USD', trendData: [233, 235, 238, 240, 242, 244, 245.3], heat: 'high' },
  { symbol: 'GME', name: 'GameStop', price: 28.5, change: 12.3, changeAmount: 3.13, currency: 'USD', trendData: [24, 25, 26, 27, 27.5, 28, 28.5], heat: 'high' },
  { symbol: 'AMC', name: 'AMC Entertainment', price: 4.52, change: 8.9, changeAmount: 0.37, currency: 'USD', trendData: [4.1, 4.2, 4.3, 4.4, 4.45, 4.5, 4.52], heat: 'high' },
]

const trendingHk: HotStockItem[] = gainersHk
const trendingCn: HotStockItem[] = gainersCn

const allGainers: HotStockItem[] = [...gainersUs, ...gainersHk, ...gainersCn]
  .sort((a, b) => b.change - a.change)
  .slice(0, 4)
const allLosers: HotStockItem[] = [...losersUs, ...losersHk, ...losersCn]
  .sort((a, b) => a.change - b.change)
  .slice(0, 4)
const allVolume: HotStockItem[] = [...volumeUs, ...volumeHk, ...volumeCn].slice(0, 4)
const allTrending: HotStockItem[] = [...trendingUs, ...trendingHk, ...trendingCn].slice(0, 4)

export type HotStocksData = Record<HotDimension, Record<HotMarket, HotStockItem[]>>

export const mockHotStocks: HotStocksData = {
  gainers: {
    us: gainersUs,
    hk: gainersHk,
    cn: gainersCn,
    all: allGainers,
  },
  losers: {
    us: losersUs,
    hk: losersHk,
    cn: losersCn,
    all: allLosers,
  },
  volume: {
    us: volumeUs,
    hk: volumeHk,
    cn: volumeCn,
    all: allVolume,
  },
  trending: {
    us: trendingUs,
    hk: trendingHk,
    cn: trendingCn,
    all: allTrending,
  },
}

export function getHotStocks(dimension: HotDimension, market: HotMarket): HotStockItem[] {
  return mockHotStocks[dimension][market] || mockHotStocks.gainers.all
}
