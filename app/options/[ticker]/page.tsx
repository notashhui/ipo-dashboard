'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ChevronLeft } from 'lucide-react'
import { getOptionsChain } from '@/lib/options'

const formatCurrency = (value: number) =>
  `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

export default function OptionsChainPage() {
  const router = useRouter()
  const params = useParams()
  const ticker = typeof params.ticker === 'string' ? params.ticker : ''
  const chain = useMemo(() => getOptionsChain(ticker), [ticker])
  const [selectedExpiration, setSelectedExpiration] = useState(chain?.expirations[0] ?? '')

  if (!chain) {
    return (
      <div className="min-h-screen bg-black px-4 py-4 text-white">
        <div className="mx-auto max-w-[430px] rounded-[28px] border border-zinc-900 bg-zinc-950 p-6 text-center">
          <p className="text-sm font-black uppercase tracking-widest">Options chain not found</p>
          <Link
            href="/options"
            className="mt-6 inline-flex rounded-xl bg-white px-4 py-3 text-xs font-black uppercase tracking-widest text-black"
          >
            Back to Options
          </Link>
        </div>
      </div>
    )
  }

  const rows = chain.rowsByExpiration[selectedExpiration] ?? []

  return (
    <div className="min-h-screen bg-black px-4 py-4 text-white">
      <div className="mx-auto max-w-[430px]">
        <div className="flex items-center justify-between py-2">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-900 hover:bg-zinc-800"
          >
            <ChevronLeft size={20} className="text-zinc-400" />
          </button>
          <div className="text-center">
            <p className="text-sm font-black uppercase tracking-widest">Options Chain</p>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-600">{chain.underlying.symbol}</p>
          </div>
          <Link
            href="/options"
            className="text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-white"
          >
            Search
          </Link>
        </div>

        <div className="mt-2">
          <Link
            href={`/stock/${chain.underlying.symbol}`}
            className="inline-flex items-center rounded-full border border-zinc-900 bg-zinc-950/80 px-3 py-2 text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-white"
          >
            Back to {chain.underlying.symbol}
          </Link>
        </div>

        <div className="mt-6 rounded-[28px] border border-zinc-900 bg-zinc-950 p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-2xl font-black italic tracking-tight">{chain.underlying.symbol}</p>
              <p className="mt-1 text-xs text-zinc-500">{chain.underlying.name}</p>
            </div>
            <div className="text-right">
              <p className="text-xl font-black tabular-nums text-white">{formatCurrency(chain.underlying.price)}</p>
              <p className={`mt-1 text-[10px] font-black uppercase tracking-widest ${chain.underlying.change >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                {chain.underlying.change >= 0 ? '+' : ''}{chain.underlying.changePercent.toFixed(2)}%
              </p>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            {chain.expirations.map((expiration) => (
              <button
                key={expiration}
                type="button"
                onClick={() => setSelectedExpiration(expiration)}
                className={`rounded-full px-3 py-2 text-[10px] font-black uppercase tracking-widest ${
                  selectedExpiration === expiration ? 'bg-white text-black' : 'bg-zinc-900/60 text-zinc-500'
                }`}
              >
                {expiration}
              </button>
            ))}
          </div>

          <div className="mt-5 overflow-hidden rounded-2xl border border-zinc-900">
            <div className="grid grid-cols-[1fr_82px_1fr] bg-zinc-900/70 px-3 py-3 text-[9px] font-black uppercase tracking-widest text-zinc-500">
              <div className="grid grid-cols-4 gap-2">
                <span>Bid</span>
                <span>Ask</span>
                <span>Last</span>
                <span>IV</span>
              </div>
              <div className="text-center">Strike</div>
              <div className="grid grid-cols-4 gap-2 text-right">
                <span>Bid</span>
                <span>Ask</span>
                <span>Last</span>
                <span>IV</span>
              </div>
            </div>

            <div className="divide-y divide-zinc-900 bg-zinc-950/60">
              {rows.map((row) => (
                <div key={row.strike} className="grid grid-cols-[1fr_82px_1fr] items-stretch">
                  <Link
                    href={`/options/order?contract=${row.call.contract.symbolId}`}
                    className="grid grid-cols-4 gap-2 px-3 py-3 text-left transition-colors hover:bg-zinc-900/40"
                  >
                    <ChainMetric value={row.call.bid.toFixed(2)} tone="text-emerald-300" />
                    <ChainMetric value={row.call.ask.toFixed(2)} />
                    <ChainMetric value={row.call.last.toFixed(2)} />
                    <ChainMetric value={`${Math.round(row.call.iv * 100)}%`} />
                    <div className="col-span-4 mt-1 flex items-center justify-between text-[9px] font-bold uppercase tracking-widest text-zinc-600">
                      <span>Vol {row.call.volume}</span>
                      <span>OI {row.call.openInterest}</span>
                    </div>
                  </Link>

                  <div className="flex flex-col items-center justify-center border-x border-zinc-900 bg-zinc-900/30 px-2 text-center">
                    <p className="text-sm font-black tabular-nums text-white">{row.strike.toFixed(2)}</p>
                    <p className="mt-1 text-[9px] font-black uppercase tracking-widest text-zinc-600">Strike</p>
                  </div>

                  <Link
                    href={`/options/order?contract=${row.put.contract.symbolId}`}
                    className="grid grid-cols-4 gap-2 px-3 py-3 text-right transition-colors hover:bg-zinc-900/40"
                  >
                    <ChainMetric value={row.put.bid.toFixed(2)} tone="text-red-300" align="text-right" />
                    <ChainMetric value={row.put.ask.toFixed(2)} align="text-right" />
                    <ChainMetric value={row.put.last.toFixed(2)} align="text-right" />
                    <ChainMetric value={`${Math.round(row.put.iv * 100)}%`} align="text-right" />
                    <div className="col-span-4 mt-1 flex items-center justify-between text-[9px] font-bold uppercase tracking-widest text-zinc-600">
                      <span>Vol {row.put.volume}</span>
                      <span>OI {row.put.openInterest}</span>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 rounded-2xl border border-zinc-900 bg-zinc-900/20 p-4">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Chain usage</p>
            <p className="mt-2 text-xs leading-relaxed text-zinc-400">
              Tap any call or put quote block to open an order ticket for that contract. The ticket includes review, estimated cost, fees, and risk disclosure.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function ChainMetric({
  value,
  tone = 'text-zinc-300',
  align = 'text-left',
}: {
  value: string
  tone?: string
  align?: string
}) {
  return <p className={`text-[11px] font-black tabular-nums ${tone} ${align}`}>{value}</p>
}
