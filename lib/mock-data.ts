import type { 
  Stock, 
  IPOStock, 
  DividendStock, 
  EarningsReport, 
  FundHolding, 
  Signal, 
  RankingStock,
  IndustryChain,
  StockMetrics,
  CapitalFlow
} from './types'

export const mockStocks: Stock[] = [
  { symbol: 'NVDA', name: 'NVIDIA Corp', price: 62.34, change: 2.91, changePercent: 4.9, volume: '72.45M', marketCap: '$1.54T' },
  { symbol: 'TSLA', name: 'Tesla Inc', price: 248.50, change: 12.34, changePercent: 5.21, volume: '89.2M', marketCap: '$792B' },
  { symbol: 'AAPL', name: 'Apple Inc', price: 178.23, change: 5.92, changePercent: 3.45, volume: '45.6M', marketCap: '$2.8T' },
  { symbol: 'MSFT', name: 'Microsoft Corp', price: 378.92, change: 8.45, changePercent: 2.28, volume: '23.1M', marketCap: '$2.82T' },
  { symbol: 'GOOGL', name: 'Alphabet Inc', price: 141.80, change: -1.23, changePercent: -0.86, volume: '18.9M', marketCap: '$1.78T' },
  { symbol: 'AMZN', name: 'Amazon.com Inc', price: 178.25, change: 3.45, changePercent: 1.97, volume: '34.2M', marketCap: '$1.85T' },
  { symbol: 'META', name: 'Meta Platforms', price: 505.12, change: -4.23, changePercent: -0.83, volume: '15.6M', marketCap: '$1.29T' },
  { symbol: 'TSM', name: 'Taiwan Semi', price: 142.56, change: 2.12, changePercent: 1.51, volume: '12.3M', marketCap: '$738B' },
  { symbol: 'ASML', name: 'ASML Holding', price: 892.34, change: 18.92, changePercent: 2.17, volume: '1.2M', marketCap: '$358B' },
  { symbol: 'AMD', name: 'AMD Inc', price: 156.78, change: 4.56, changePercent: 3.0, volume: '45.8M', marketCap: '$253B' },
]

export const mockIPOs: IPOStock[] = [
  {
    symbol: '01768',
    name: 'Mingming Busy',
    price: 233.10,
    change: 0,
    changePercent: 0,
    status: 'subscribing',
    issuePrice: 229.60,
    issuePriceMax: 236.60,
    entryFee: 23897,
    shares: 100,
    lotSize: 100,
    currency: 'HKD',
    industry: 'Food & Beverage Retail',
    timeline: {
      start: '01.20',
      startTime: '08:00',
      end: '01.23',
      endTime: '09:00',
      result: '01.27',
      gray: '01.27',
      grayTime: '16:15-18:30',
      list: '01.28'
    },
    currentPhase: 1,
    companyIntro: 'We are a mature and steadily growing food and beverage retailer in China, operating an extensive network of convenience stores and snack shops.',
    useOfProceeds: 'Approximately 20.0% of the net proceeds (approximately HKD 625 million) will be used for brand building and promotional activities. We will increase...',
    sponsor: 'Goldman Sachs (Asia) LLC',
    sponsorRole: 'Joint Sponsor'
  },
  {
    symbol: 'RDDT',
    name: 'Reddit Inc',
    price: 45.00,
    change: 0,
    changePercent: 0,
    status: 'pending',
    issuePrice: 34.00,
    issuePriceMax: 45.00,
    entryFee: 4500,
    shares: 100,
    lotSize: 100,
    currency: 'USD',
    industry: 'Internet Services',
    timeline: {
      start: '02.01',
      startTime: '09:00',
      end: '02.05',
      endTime: '17:00',
      result: '02.07',
      gray: '02.08',
      grayTime: '09:00-16:00',
      list: '02.10'
    },
    currentPhase: 0,
    companyIntro: 'Reddit is a community of communities. It is built on shared interests, passion, and trust and is home to the most open and authentic conversations on the internet.',
    useOfProceeds: 'The net proceeds from the offering will be used for working capital and general corporate purposes, including sales and marketing, product development, and capital expenditures.',
    sponsor: 'Morgan Stanley',
    sponsorRole: 'Lead Underwriter'
  },
  {
    symbol: 'NVDA',
    name: 'NVIDIA Corp',
    price: 135.58,
    change: 3.25,
    changePercent: 2.45,
    status: 'listed',
    issuePrice: 12.00,
    issuePriceMax: 12.00,
    entryFee: 1200,
    shares: 100,
    lotSize: 100,
    currency: 'USD',
    industry: 'Semiconductors',
    timeline: {
      start: '01.22',
      startTime: '09:00',
      end: '01.22',
      endTime: '17:00',
      result: '01.22',
      gray: '01.22',
      grayTime: 'N/A',
      list: '01.22'
    },
    currentPhase: 4,
    companyIntro: 'NVIDIA pioneered accelerated computing to tackle challenges no one else can solve. Their work in AI and digital twins is transforming the world\'s largest industries.',
    useOfProceeds: 'The proceeds were used to fund research and development of graphics processing units and accelerated computing platforms.',
    sponsor: 'Credit Suisse',
    sponsorRole: 'Lead Underwriter'
  }
]

export const mockDividends: DividendStock[] = [
  {
    symbol: 'AAPL',
    name: 'Apple Inc',
    price: 248.04,
    change: -0.31,
    changePercent: -0.12,
    yield: 0.41,
    yieldTTM: 0.41,
    payout: 13.67,
    payoutLFY: 13.67,
    frequency: 'Quarterly',
    frequencyCount: 4,
    exDivDate: '2025/11/10',
    recordDate: '2025/11/10',
    paymentDate: '2025/11/13',
    announcementDate: '2025/10/31',
    nextDPS: 0.26,
    latestDPS: 0.26,
    currency: 'USD',
    history: [0.85, 0.90, 0.94, 0.98, 1.02],
    yieldHistory: [0.59, 0.61, 0.55, 0.43, 0.40],
    historyYears: ['2021', '2022', '2023', '2024', '2025']
  },
  {
    symbol: 'T',
    name: 'AT&T Inc',
    price: 17.85,
    change: 0.12,
    changePercent: 0.68,
    yield: 4.95,
    yieldTTM: 4.95,
    payout: 56.3,
    payoutLFY: 56.3,
    frequency: 'Quarterly',
    frequencyCount: 4,
    exDivDate: '2025/02/10',
    recordDate: '2025/02/10',
    paymentDate: '2025/02/28',
    announcementDate: '2025/01/15',
    nextDPS: 0.28,
    latestDPS: 0.28,
    currency: 'USD',
    history: [0.52, 0.28, 0.28, 0.28, 0.28],
    yieldHistory: [7.20, 5.80, 5.10, 4.95, 4.95],
    historyYears: ['2021', '2022', '2023', '2024', '2025']
  },
  {
    symbol: 'VZ',
    name: 'Verizon',
    price: 42.50,
    change: -0.23,
    changePercent: -0.54,
    yield: 6.12,
    yieldTTM: 6.12,
    payout: 52.8,
    payoutLFY: 52.8,
    frequency: 'Quarterly',
    frequencyCount: 4,
    exDivDate: '2025/03/05',
    recordDate: '2025/03/05',
    paymentDate: '2025/03/20',
    announcementDate: '2025/02/15',
    nextDPS: 0.65,
    latestDPS: 0.65,
    currency: 'USD',
    history: [2.51, 2.56, 2.61, 2.61, 2.64],
    yieldHistory: [4.80, 5.20, 5.80, 6.10, 6.12],
    historyYears: ['2021', '2022', '2023', '2024', '2025']
  }
]

export const mockEarnings: EarningsReport[] = [
  {
    symbol: 'AAOI',
    name: 'Applied Optoelectronics',
    price: 35.79,
    change: 0.07,
    changePercent: 0.20,
    reportTime: 'after-hours',
    reportDate: 'Jan 27, 2025',
    reportPeriod: '2025 FY Q3',
    dateRange: '2025.06.30-2025.09.30',
    currency: 'USD',
    estEPS: -0.095,
    estRevenue: '$120M',
    surprise: -2.1,
    financials: {
      revenue: { actual: '$119M', actualChange: 82.08, forecast: '$120M', forecastChange: 83.84, status: 'miss' },
      ebit: { actual: '-$4.84M', actualChange: 59.01, forecast: '-$5.79M', forecastChange: 50.97, status: 'beat' },
      eps: { actual: '-$0.28', actualChange: 33.33, forecast: '-$0.095', forecastChange: 77.38, status: 'miss' }
    },
    summary: 'Applied Optoelectronics (AAOI) reported Q3 revenue of $119M (+82.08%), missing forecasts; EBIT was -$4.84M (+59.01%), beating expectations; EPS was -$0.28 (+33.33%), missing forecasts.',
    historicalData: [
      { quarter: 'Q1', actual: 100, forecast: 99.4 },
      { quarter: 'Q2', actual: 99.9, forecast: 99.4 },
      { quarter: 'Q3', actual: 103, forecast: 106 },
      { quarter: 'Q4', actual: 119, forecast: 120 },
      { quarter: 'Q5', actual: 132, forecast: 132 }
    ]
  },
  {
    symbol: 'NVDA',
    name: 'NVIDIA Corp',
    price: 135.58,
    change: 3.25,
    changePercent: 2.45,
    reportTime: 'pre-market',
    reportDate: 'Jan 27, 2025',
    reportPeriod: '2025 FY Q4',
    dateRange: '2025.10.01-2025.12.31',
    currency: 'USD',
    estEPS: 0.74,
    estRevenue: '$22.1B',
    surprise: 2.3,
    financials: {
      revenue: { actual: '$22.6B', actualChange: 122.5, forecast: '$22.1B', forecastChange: 118.2, status: 'beat' },
      ebit: { actual: '$8.9B', actualChange: 89.2, forecast: '$8.5B', forecastChange: 82.4, status: 'beat' },
      eps: { actual: '$0.76', actualChange: 156.8, forecast: '$0.74', forecastChange: 148.2, status: 'beat' }
    },
    summary: 'NVIDIA Corp reported Q4 revenue of $22.6B (+122.5%), beating forecasts; EBIT was $8.9B (+89.2%), exceeding expectations; EPS was $0.76 (+156.8%), above forecasts.',
    historicalData: [
      { quarter: 'Q1', actual: 7.19, forecast: 6.52 },
      { quarter: 'Q2', actual: 13.5, forecast: 11.0 },
      { quarter: 'Q3', actual: 18.1, forecast: 16.1 },
      { quarter: 'Q4', actual: 22.6, forecast: 22.1 },
      { quarter: 'Q5', actual: 24.0, forecast: 24.5 }
    ]
  },
  {
    symbol: 'AAPL',
    name: 'Apple Inc',
    price: 228.34,
    change: 2.56,
    changePercent: 1.12,
    reportTime: 'after-hours',
    reportDate: 'Jan 28, 2025',
    reportPeriod: '2025 FY Q1',
    dateRange: '2025.10.01-2025.12.31',
    currency: 'USD',
    estEPS: 2.10,
    estRevenue: '$118.5B',
    surprise: 1.2,
    financials: {
      revenue: { actual: '$119.6B', actualChange: 6.2, forecast: '$118.5B', forecastChange: 5.2, status: 'beat' },
      ebit: { actual: '$36.1B', actualChange: 8.4, forecast: '$35.2B', forecastChange: 5.8, status: 'beat' },
      eps: { actual: '$2.18', actualChange: 10.2, forecast: '$2.10', forecastChange: 6.5, status: 'beat' }
    },
    summary: 'Apple Inc reported Q1 revenue of $119.6B (+6.2%), beating forecasts; EBIT was $36.1B (+8.4%), exceeding expectations; EPS was $2.18 (+10.2%), above forecasts.',
    historicalData: [
      { quarter: 'Q1\'24', actual: 117.2, forecast: 116.8 },
      { quarter: 'Q2\'24', actual: 90.8, forecast: 89.5 },
      { quarter: 'Q3\'24', actual: 85.8, forecast: 83.2 },
      { quarter: 'Q4\'24', actual: 94.9, forecast: 94.5 },
      { quarter: 'Q1\'25', actual: 119.6, forecast: 118.5 }
    ]
  }
]

export const mockFundHoldings: FundHolding[] = [
  {
    fund: 'ARK Innovation ETF',
    manager: 'Cathie Wood',
    ticker: 'ARKK',
    aum: '$8.9B',
    holdings: 39,
    concentration: 67,
    latest: 'Q4 2024',
    movements: [
      { type: 'NEW', symbol: 'NVDA', name: 'NVIDIA Corp', shares: '+2.3M', weight: 6.86 },
      { type: 'ADD', symbol: 'TSLA', name: 'Tesla Inc', shares: '+1.1M', weight: 9.42 },
      { type: 'REDUCE', symbol: 'COIN', name: 'Coinbase', shares: '-500K', weight: 3.21 }
    ]
  }
]

export const mockSignals: Signal[] = [
  {
    symbol: 'NVDA',
    name: 'NVIDIA Corp',
    price: 62.34,
    change: 2.91,
    changePercent: 4.9,
    timestamp: '15:49:34',
    signalType: 'Support Jump',
    priceMove: 4.9,
    volumeSpike: 2.3
  },
  {
    symbol: 'TSLA',
    name: 'Tesla Inc',
    price: 248.50,
    change: 12.34,
    changePercent: 5.21,
    timestamp: '15:32:12',
    signalType: 'Volume Breakout',
    priceMove: 5.21,
    volumeSpike: 3.1
  }
]

export const mockRankings: RankingStock[] = [
  { rank: 1, symbol: 'TSLA', name: 'Tesla Inc', price: 248.50, change: 12.34, changePercent: 5.21, turnover: '$8.92B' },
  { rank: 2, symbol: 'NVDA', name: 'NVIDIA Corp', price: 62.34, change: 2.91, changePercent: 4.90, turnover: '$4.52B' },
  { rank: 3, symbol: 'AMD', name: 'AMD Inc', price: 156.78, change: 4.56, changePercent: 3.00, turnover: '$3.21B' },
  { rank: 4, symbol: 'AAPL', name: 'Apple Inc', price: 178.23, change: 5.92, changePercent: 3.45, turnover: '$3.21B' },
  { rank: 5, symbol: 'MSFT', name: 'Microsoft Corp', price: 378.92, change: 8.45, changePercent: 2.28, turnover: '$2.89B' },
  { rank: 6, symbol: 'GOOGL', name: 'Alphabet Inc', price: 141.80, change: -1.23, changePercent: -0.86, turnover: '$2.45B' },
  { rank: 7, symbol: 'AMZN', name: 'Amazon.com Inc', price: 178.25, change: 3.45, changePercent: 1.97, turnover: '$2.12B' },
  { rank: 8, symbol: 'META', name: 'Meta Platforms', price: 505.12, change: -4.23, changePercent: -0.83, turnover: '$1.89B' },
]

export const mockIndustryChains: IndustryChain[] = [
  {
    id: 'semiconductor',
    name: 'Semiconductor',
    description: 'Global chip supply chain',
    marketCap: '$18.00T',
    stockCount: 53,
    gradient: 'from-indigo-900/60 via-purple-900/40 to-zinc-900/20',
    stocks: ['NVDA', 'TSM', 'ASML'],
    segments: [
      {
        level: 'upstream',
        subSectors: [
          {
            id: 'equipment',
            name: 'Equipment & Materials',
            stocks: [
              { symbol: 'ASML', name: 'ASML Holding', price: 892.34, change: 18.92, changePercent: 2.17 },
              { symbol: 'AMAT', name: 'Applied Materials', price: 187.92, change: -1.52, changePercent: -0.80 },
              { symbol: 'LRCX', name: 'Lam Research', price: 756.23, change: 12.45, changePercent: 1.67 },
              { symbol: 'KLAC', name: 'KLA Corp', price: 623.45, change: 8.92, changePercent: 1.45 }
            ]
          }
        ]
      },
      {
        level: 'midstream',
        subSectors: [
          {
            id: 'foundry',
            name: 'Foundry',
            stocks: [
              { symbol: 'TSM', name: 'Taiwan Semi', price: 142.56, change: 2.12, changePercent: 1.51 },
              { symbol: 'UMC', name: 'United Micro', price: 7.89, change: 0.12, changePercent: 1.54 },
              { symbol: 'GFS', name: 'GlobalFoundries', price: 54.23, change: -0.89, changePercent: -1.62 }
            ]
          },
          {
            id: 'software',
            name: 'System & App Software',
            stocks: [
              { symbol: 'SNPS', name: 'Synopsys', price: 512.34, change: 8.45, changePercent: 1.68 },
              { symbol: 'CDNS', name: 'Cadence Design', price: 289.56, change: 4.23, changePercent: 1.48 }
            ]
          }
        ]
      },
      {
        level: 'downstream',
        subSectors: [
          {
            id: 'cloud',
            name: 'Cloud Platform',
            stocks: [
              { symbol: 'NVDA', name: 'NVIDIA Corp', price: 135.58, change: 3.25, changePercent: 2.45 },
              { symbol: 'AMD', name: 'AMD Inc', price: 156.78, change: 4.56, changePercent: 3.00 },
              { symbol: 'INTC', name: 'Intel Corp', price: 42.34, change: -0.89, changePercent: -2.06 }
            ]
          },
          {
            id: 'applications',
            name: 'Industry Applications',
            stocks: [
              { symbol: 'QCOM', name: 'Qualcomm', price: 167.45, change: 2.34, changePercent: 1.42 },
              { symbol: 'AVGO', name: 'Broadcom', price: 145.67, change: 3.21, changePercent: 2.25 },
              { symbol: 'MRVL', name: 'Marvell Tech', price: 78.92, change: 1.56, changePercent: 2.02 }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'ev',
    name: 'Electric Vehicles',
    description: 'EV ecosystem chain',
    marketCap: '$2.80T',
    stockCount: 42,
    gradient: 'from-emerald-900/60 via-teal-900/40 to-zinc-900/20',
    stocks: ['TSLA', 'RIVN', 'LCID'],
    segments: [
      {
        level: 'upstream',
        subSectors: [
          {
            id: 'battery',
            name: 'Battery & Materials',
            stocks: [
              { symbol: 'ALB', name: 'Albemarle', price: 89.34, change: -1.23, changePercent: -1.36 },
              { symbol: 'SQM', name: 'Sociedad Química', price: 45.67, change: 0.89, changePercent: 1.99 },
              { symbol: 'LAC', name: 'Lithium Americas', price: 12.34, change: 0.45, changePercent: 3.78 }
            ]
          }
        ]
      },
      {
        level: 'midstream',
        subSectors: [
          {
            id: 'components',
            name: 'Components',
            stocks: [
              { symbol: 'APTV', name: 'Aptiv', price: 78.56, change: 1.23, changePercent: 1.59 },
              { symbol: 'LEA', name: 'Lear Corp', price: 134.56, change: 2.34, changePercent: 1.77 }
            ]
          },
          {
            id: 'charging',
            name: 'Charging Infrastructure',
            stocks: [
              { symbol: 'CHPT', name: 'ChargePoint', price: 2.34, change: 0.12, changePercent: 5.41 },
              { symbol: 'BLNK', name: 'Blink Charging', price: 3.45, change: -0.23, changePercent: -6.25 }
            ]
          }
        ]
      },
      {
        level: 'downstream',
        subSectors: [
          {
            id: 'oem',
            name: 'OEM Manufacturers',
            stocks: [
              { symbol: 'TSLA', name: 'Tesla Inc', price: 248.50, change: 12.34, changePercent: 5.21 },
              { symbol: 'RIVN', name: 'Rivian', price: 12.34, change: -0.45, changePercent: -3.52 },
              { symbol: 'LCID', name: 'Lucid', price: 3.45, change: 0.12, changePercent: 3.60 },
              { symbol: 'NIO', name: 'NIO Inc', price: 5.67, change: 0.23, changePercent: 4.23 }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'ai',
    name: 'Artificial Intelligence',
    description: 'AI & ML technology chain',
    marketCap: '$12.50T',
    stockCount: 38,
    gradient: 'from-cyan-900/60 via-blue-900/40 to-zinc-900/20',
    stocks: ['NVDA', 'MSFT', 'GOOGL'],
    segments: [
      {
        level: 'upstream',
        subSectors: [
          {
            id: 'compute',
            name: 'AI Compute Hardware',
            stocks: [
              { symbol: 'NVDA', name: 'NVIDIA Corp', price: 135.58, change: 3.25, changePercent: 2.45 },
              { symbol: 'AMD', name: 'AMD Inc', price: 156.78, change: 4.56, changePercent: 3.00 }
            ]
          }
        ]
      },
      {
        level: 'midstream',
        subSectors: [
          {
            id: 'platforms',
            name: 'AI Platforms',
            stocks: [
              { symbol: 'MSFT', name: 'Microsoft', price: 415.20, change: 8.45, changePercent: 2.08 },
              { symbol: 'GOOGL', name: 'Alphabet', price: 178.34, change: 3.21, changePercent: 1.83 },
              { symbol: 'AMZN', name: 'Amazon', price: 198.45, change: 4.56, changePercent: 2.35 }
            ]
          }
        ]
      },
      {
        level: 'downstream',
        subSectors: [
          {
            id: 'applications',
            name: 'AI Applications',
            stocks: [
              { symbol: 'CRM', name: 'Salesforce', price: 298.45, change: 5.67, changePercent: 1.94 },
              { symbol: 'NOW', name: 'ServiceNow', price: 892.34, change: 12.45, changePercent: 1.41 },
              { symbol: 'PLTR', name: 'Palantir', price: 78.92, change: 2.34, changePercent: 3.06 }
            ]
          }
        ]
      }
    ]
  }
]

export const mockStockMetrics: StockMetrics = {
  high: 63.25,
  low: 59.43,
  open: 59.88,
  prevClose: 59.43,
  volume: '72.45M',
  turnover: '$4.52B',
  peTTM: 35.67,
  peStatic: 33.21,
  marketCap: '$1.54T',
  totalShares: '24.7B',
  turnoverRate: '2.93%',
  pbRatio: 12.45,
  high52w: 140.76,
  low52w: 39.23,
  bidRatio: '+8.5%',
  volRatio: 1.42,
  amplitude: '6.4%',
  allTimeHigh: 140.76,
  allTimeLow: 0.89,
  avgPrice: 61.77,
  divTTM: 0.16,
  divLFY: 0.04,
  lotSize: 100,
  beta: 1.68
}

export const mockCapitalFlow: CapitalFlow = {
  netInflow: -6735.15,
  totalInflow: 41624.34,
  totalOutflow: 48359.49,
  largeInflow: 17655.15,
  largeOutflow: 24903.07,
  midInflow: 9746.45,
  midOutflow: 9688.27
}

export const sectorHeatmapData = [
  { name: 'Technology', change: 3.2, marketCap: '$2.4T', color: '#F04438' },
  { name: 'Finance', change: 1.8, marketCap: '$1.2T', color: '#10b981' },
  { name: 'Energy', change: -0.5, marketCap: '$800B', color: '#2E6BE6' },
  { name: 'Healthcare', change: 0.9, marketCap: '$600B', color: '#10b981' },
  { name: 'Consumer', change: -1.2, marketCap: '$500B', color: '#2E6BE6' },
  { name: 'Industrial', change: 2.1, marketCap: '$400B', color: '#F04438' },
]
