'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ChevronLeft, ChevronRight, Search } from 'lucide-react'
import { getSupportedOptionsUnderlyings } from '@/lib/options'

const formatCurrency = (value: number) =>
  `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

export default function OptionsHomePage() {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const underlyings = getSupportedOptionsUnderlyings()

  const visible = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    if (!normalized) return underlyings

    return underlyings.filter((stock) =>
      stock.symbol.toLowerCase().includes(normalized) ||
      stock.name.toLowerCase().includes(normalized)
    )
  }, [query, underlyings])

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
            <p className="text-sm font-black uppercase tracking-widest">Options</p>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-600">Select underlying</p>
          </div>
          <div className="w-10 h-10" />
        </div>

        <div className="mt-6 rounded-[28px] border border-zinc-900 bg-zinc-950 p-4">
          <div className="flex items-center gap-3 rounded-2xl border border-zinc-900 bg-zinc-900/50 px-4 py-3">
            <Search size={16} className="text-zinc-600" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search ticker or company"
              className="flex-1 bg-transparent text-sm font-medium text-white outline-none placeholder:text-zinc-600"
            />
          </div>

          <div className="mt-4 rounded-2xl border border-zinc-900 bg-zinc-900/20 p-4">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Workflow</p>
            <p className="mt-2 text-xs leading-relaxed text-zinc-400">
              Select an underlying, review the option chain, choose a contract, then submit a two-step options order ticket.
            </p>
          </div>

          <div className="mt-4 space-y-3">
            {visible.map((stock) => (
              <Link
                key={stock.symbol}
                href={`/options/${stock.symbol}`}
                className="flex items-center justify-between rounded-2xl border border-zinc-900 bg-zinc-900/30 px-4 py-4 transition-colors hover:bg-zinc-900/50"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-base font-black text-white">{stock.symbol}</p>
                    <span className="rounded-full bg-zinc-800 px-2.5 py-1 text-[10px] font-black uppercase tracking-widest text-zinc-300">
                      Options
                    </span>
                  </div>
                  <p className="mt-1 truncate text-xs text-zinc-500">{stock.name}</p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-sm font-black tabular-nums text-white">{formatCurrency(stock.price)}</p>
                    <p className={`text-[10px] font-black uppercase tracking-widest ${stock.change >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                      {stock.change >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                    </p>
                  </div>
                  <ChevronRight size={16} className="text-zinc-700" />
                </div>
              </Link>
            ))}
          </div>

          {visible.length === 0 && (
            <div className="py-14 text-center">
              <p className="text-sm font-black uppercase tracking-widest text-zinc-500">No matching underlyings</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
