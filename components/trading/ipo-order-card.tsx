'use client'

import type { IpoOrder } from '@/lib/types'
import { getIpoOrderDisplayStatus, getIpoOrderDisplayStage } from '@/lib/ipo-utils'

interface IpoOrderCardProps {
  order: IpoOrder
  formatTime?: (iso: string) => string
}

const defaultFormatTime = (iso: string) => {
  const d = new Date(iso)
  return d.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
}

export function IpoOrderCard({ order, formatTime = defaultFormatTime }: IpoOrderCardProps) {
  const status = getIpoOrderDisplayStatus(order)
  const stage = getIpoOrderDisplayStage(order)
  const currencySym = order.currency === 'HKD' ? 'HK$' : '$'
  const priceDecimals = order.currency === 'HKD' ? 3 : 2

  return (
    <div className="bg-zinc-900/40 rounded-2xl p-4 border border-zinc-900">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-500 text-[9px] font-black uppercase tracking-widest">
            IPO
          </span>
          <span className="font-black text-base">{order.symbol}</span>
        </div>
        <p className="text-[10px] font-bold text-zinc-600 tabular-nums">{formatTime(order.createdAt)}</p>
      </div>
      <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-wide mb-3">{order.name}</p>
      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-zinc-800 pt-3">
        <div>
          <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">Price</p>
          <p className="text-sm font-black text-white tabular-nums">{currencySym}{order.price.toFixed(priceDecimals)}</p>
        </div>
        <div>
          <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">Qty</p>
          <p className="text-sm font-black text-white">{order.shares} shares</p>
        </div>
        <div>
          <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">Status</p>
          <p className={`text-sm font-black ${status === 'Ready' ? 'text-emerald-500' : 'text-amber-500'}`}>
            {status}
          </p>
        </div>
        <div>
          <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">Stage</p>
          <p className="text-sm font-black text-zinc-400">{stage}</p>
        </div>
      </div>
    </div>
  )
}
