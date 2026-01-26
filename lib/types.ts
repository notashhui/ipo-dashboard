export interface Stock {
  symbol: string
  name: string
  price: number
  change: number
  changePercent: number
  volume?: string
  marketCap?: string
}

export interface IPOStock extends Stock {
  status: 'subscribing' | 'pending' | 'listed'
  issuePrice: number
  issuePriceMax?: number
  entryFee: number
  shares: number
  lotSize: number
  currency: string
  industry: string
  timeline: {
    start: string
    startTime: string
    end: string
    endTime: string
    result: string
    gray: string
    grayTime: string
    list: string
  }
  currentPhase: number
  companyIntro: string
  useOfProceeds: string
  sponsor: string
  sponsorRole: string
}

export interface DividendStock extends Stock {
  yield: number
  yieldTTM: number
  payout: number
  payoutLFY: number
  frequency: string
  frequencyCount: number
  exDivDate: string
  recordDate: string
  paymentDate: string
  announcementDate: string
  nextDPS: number
  latestDPS: number
  currency: string
  history: number[]
  yieldHistory: number[]
  historyYears: string[]
}

export interface EarningsReport extends Stock {
  reportTime: 'pre-market' | 'after-hours'
  reportDate: string
  reportPeriod: string
  dateRange: string
  currency: string
  estEPS: number
  estRevenue: string
  surprise?: number
  financials: {
    revenue: { actual: string; actualChange: number; forecast: string; forecastChange: number; status: 'beat' | 'miss' }
    ebit: { actual: string; actualChange: number; forecast: string; forecastChange: number; status: 'beat' | 'miss' }
    eps: { actual: string; actualChange: number; forecast: string; forecastChange: number; status: 'beat' | 'miss' }
  }
  summary: string
  historicalData: { quarter: string; actual: number; forecast: number }[]
}

export interface FundHolding {
  fund: string
  manager: string
  ticker: string
  aum: string
  holdings: number
  concentration: number
  latest: string
  movements: {
    type: 'NEW' | 'ADD' | 'REDUCE' | 'EXIT'
    symbol: string
    name: string
    shares: string
    weight: number
  }[]
}

// Institutional Holdings Analysis Types
export interface InstitutionalStats {
  holdingPercentage: number
  holdingPercentageChange: number
  sharesHeld: number // in shares
  sharesHeldChange: number // in shares
  institutionsCount: number
  institutionsCountChange: number
}

export interface ChartDataPoint {
  quarter: string // e.g., "04Q1", "25Q4"
  holdingPercentage: number
  assetPrice: number
}

export interface TopHolder {
  name: string
  holdingPercentage: number
  sharesChange: number // positive for increase, negative for decrease
}

export interface InstitutionalActivity {
  institutionName: string
  sharesChange: number
  ratioChange: number
  amountChange: number // in currency
  activityType: 'ALL' | 'INCREASE' | 'DECREASE' | 'NEW' | 'CLEAR'
}

export interface Signal extends Stock {
  timestamp: string
  signalType: string
  priceMove: number
  volumeSpike: number
}

// Smart Scan / Stock Screener Types
export interface PopularStrategy {
  id: string
  name: string
  icon: string // emoji or icon identifier
}

export interface Indicator {
  id: string
  name: string
  category: 'common' | 'market' | 'valuation' | 'profitability'
}

export interface ScanFilter {
  type: 'market' | 'indicator'
  label: string
  value: string
}

export interface ScanResult {
  symbol: string
  name: string
  price: number
  changePercent: number
  revenue?: number
  watchlistCount: number
}

export interface RankingStock extends Stock {
  rank: number
  turnover?: string
}

export interface IndustrySubSector {
  id: string
  name: string
  stocks: Stock[]
}

export interface IndustrySegment {
  level: 'upstream' | 'midstream' | 'downstream'
  subSectors: IndustrySubSector[]
}

export interface IndustryChain {
  id: string
  name: string
  description: string
  marketCap: string
  stockCount: number
  gradient: string
  stocks: string[]
  segments: IndustrySegment[]
}

export type ViewType = 
  | 'square'
  | 'markets' 
  | 'trade' 
  | 'assets'
  | 'ipo'
  | 'dividend'
  | 'market-temp'
  | 'earnings'
  | 'fund-holdings'
  | 'signals'
  | 'rankings'
  | 'industry-chain'
  | 'stock-detail'
  | 'news-detail'

export interface StockMetrics {
  high: number
  low: number
  open: number
  prevClose: number
  volume: string
  turnover: string
  peTTM: number
  peStatic: number
  marketCap: string
  totalShares: string
  turnoverRate: string
  pbRatio: number
  high52w: number
  low52w: number
  bidRatio: string
  volRatio: number
  amplitude: string
  allTimeHigh: number
  allTimeLow: number
  avgPrice: number
  divTTM: number
  divLFY: number
  lotSize: number
  beta: number
}

export interface CapitalFlow {
  netInflow: number
  totalInflow: number
  totalOutflow: number
  largeInflow: number
  largeOutflow: number
  midInflow: number
  midOutflow: number
}

export interface Order {
  id: string
  refId: string
  symbol: string
  name: string
  type: 'buy' | 'sell'
  orderType: 'limit' | 'market'
  price: number
  quantity: number
  total: number
  status: 'pending' | 'filled' | 'cancelled'
  timestamp: Date
}

export interface IpoOrder {
  id: string
  type: 'IPO'
  symbol: string
  name: string
  side: 'BUY'
  price: number
  shares: number
  lotSize: number
  createdAt: string
  status: 'Pending' | 'Queued'
  stage: 'Subscription' | 'Allotment' | 'Grey Market' | 'Listed'
  unlockAt: string
  resultAt: string
  grayAt: string
  listAt: string
  currency: string
}

export interface Holding {
  symbol: string
  name: string
  quantity: number
  avgCost: number
  currentPrice: number
  marketValue: number
  unrealizedPL: number
  unrealizedPLPercent: number
  color: string
}
