'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronLeft, ChevronRight, ArrowRightLeft, SplitSquareVertical } from 'lucide-react'
import type { CorporateActionStatus } from '@/lib/types'
import { useCorporateActions } from '@/hooks/use-corporate-actions'
import { useHoldings } from '@/hooks/use-holdings'
import { getCorporateActionRatioLabel } from '@/lib/corporate-actions'

export default function CorporateActionsPage() {
  const router = useRouter()
  const { holdings } = useHoldings()
  const { actions, createMockAction, isHydrated } = useCorporateActions()
  const [activeTab, setActiveTab] = useState<CorporateActionStatus>('upcoming')

  const visibleActions = useMemo(() => {
    return actions
      .filter((action) => action.status === activeTab)
      .sort((a, b) => new Date(b.effectiveAt).getTime() - new Date(a.effectiveAt).getTime())
  }, [actions, activeTab])

  return (
    <div className="min-h-screen bg-black text-white px-4 py-4">
      <div className="mx-auto max-w-[430px]">
        <div className="flex items-center justify-between py-2">
          <button
            type="button"
            onClick={() => router.back()}
            className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center hover:bg-zinc-800"
          >
            <ChevronLeft size={20} className="text-zinc-400" />
          </button>
          <div className="text-center">
            <p className="text-sm font-black uppercase tracking-widest">Corporate Actions</p>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-600">Splits and reverse splits</p>
          </div>
          <div className="w-10 h-10" />
        </div>

        <div className="mt-6 rounded-[28px] border border-zinc-900 bg-zinc-950 p-4">
          <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-zinc-500">Create Mock Actions</p>
          <div className="mt-4 space-y-3">
            {holdings.map((holding) => (
              <div key={holding.symbol} className="rounded-2xl border border-zinc-900 bg-zinc-900/30 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-black text-white">{holding.symbol}</p>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-600">{holding.quantity} shares held</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => createMockAction(holding, 'split')}
                      className="rounded-xl bg-white px-3 py-2 text-[10px] font-black uppercase tracking-widest text-black"
                    >
                      Create Mock Split
                    </button>
                    <button
                      type="button"
                      onClick={() => createMockAction(holding, 'reverse_split')}
                      className="rounded-xl border border-zinc-800 bg-zinc-900/60 px-3 py-2 text-[10px] font-black uppercase tracking-widest text-white"
                    >
                      Mock Reverse
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 rounded-[28px] border border-zinc-900 bg-zinc-950 p-4">
          <div className="bg-zinc-900/60 rounded-full p-1 flex">
            <button
              type="button"
              onClick={() => setActiveTab('upcoming')}
              className={`flex-1 py-3 rounded-full text-[11px] font-black uppercase tracking-[0.2em] ${activeTab === 'upcoming' ? 'bg-zinc-800 text-white' : 'text-zinc-600'}`}
            >
              Upcoming
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('applied')}
              className={`flex-1 py-3 rounded-full text-[11px] font-black uppercase tracking-[0.2em] ${activeTab === 'applied' ? 'bg-zinc-800 text-white' : 'text-zinc-600'}`}
            >
              Applied
            </button>
          </div>

          {!isHydrated ? (
            <div className="py-16 text-center text-sm font-bold text-zinc-500 uppercase tracking-widest">Loading actions</div>
          ) : visibleActions.length === 0 ? (
            <div className="py-16 text-center">
              <div className="mx-auto w-16 h-16 rounded-full bg-zinc-900 flex items-center justify-center">
                <ArrowRightLeft size={26} className="text-zinc-700" />
              </div>
              <p className="mt-4 text-sm font-bold text-zinc-400">No {activeTab} corporate actions</p>
            </div>
          ) : (
            <div className="mt-4 space-y-3">
              {visibleActions.map((action) => (
                <Link
                  key={action.id}
                  href={`/corporate-actions/${action.id}`}
                  className="block rounded-2xl border border-zinc-900 bg-zinc-900/30 p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center">
                        <SplitSquareVertical size={18} className="text-amber-300" />
                      </div>
                      <div>
                        <p className="text-sm font-black text-white">{action.ticker}</p>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                          {action.type === 'split' ? 'Split' : 'Reverse Split'} · {getCorporateActionRatioLabel(action)}
                        </p>
                      </div>
                    </div>
                    <ChevronRight size={16} className="text-zinc-700" />
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-600">
                      Effective {new Date(action.effectiveAt).toLocaleDateString()}
                    </p>
                    <span className={`rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-widest ${
                      action.status === 'applied' ? 'bg-emerald-500/15 text-emerald-300' : 'bg-amber-500/15 text-amber-300'
                    }`}>
                      {action.status}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
