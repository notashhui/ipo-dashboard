'use client'

import Link from 'next/link'
import { useMemo } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ChevronLeft, ChevronRight, ArrowRightLeft } from 'lucide-react'
import { getCorporateActionRatioLabel } from '@/lib/corporate-actions'
import { useCorporateActions } from '@/hooks/use-corporate-actions'
import { useHoldings } from '@/hooks/use-holdings'

const formatCurrency = (value: number) =>
  `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

export default function CorporateActionDetailPage() {
  const router = useRouter()
  const params = useParams()
  const actionId = typeof params.id === 'string' ? params.id : ''
  const { holdings, setHoldings } = useHoldings()
  const { getActionById, applyAction, isHydrated } = useCorporateActions()
  const action = getActionById(actionId)

  const holding = useMemo(() => {
    if (!action) return undefined
    return holdings.find((entry) => entry.symbol === action.ticker)
  }, [action, holdings])

  if (!isHydrated) {
    return <div className="min-h-screen bg-black text-white flex items-center justify-center">Loading corporate action</div>
  }

  if (!action) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
        <div className="w-full max-w-[430px] rounded-3xl border border-zinc-900 bg-zinc-950 p-6 text-center">
          <p className="text-sm font-black uppercase tracking-widest">Corporate action not found</p>
          <Link href="/corporate-actions" className="mt-6 inline-flex rounded-xl bg-white px-4 py-3 text-xs font-black uppercase tracking-widest text-black">
            Back to Corporate Actions
          </Link>
        </div>
      </div>
    )
  }

  const handleApply = () => {
    applyAction(action.id, holdings, setHoldings)
  }

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
            <p className="text-sm font-black uppercase tracking-widest">Corporate Action</p>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-600">{action.ticker}</p>
          </div>
          <Link href="/corporate-actions" className="text-[10px] font-black uppercase tracking-widest text-zinc-500">List</Link>
        </div>

        <div className="mt-6 rounded-[28px] border border-zinc-900 bg-zinc-950 p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center">
                <ArrowRightLeft size={18} className="text-amber-300" />
              </div>
              <div>
                <p className="text-xl font-black text-white">{action.type === 'split' ? 'Stock Split' : 'Reverse Split'}</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                  Ratio {getCorporateActionRatioLabel(action)} · Effective {new Date(action.effectiveAt).toLocaleDateString()}
                </p>
              </div>
            </div>
            <span className={`rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-widest ${
              action.status === 'applied' ? 'bg-emerald-500/15 text-emerald-300' : 'bg-amber-500/15 text-amber-300'
            }`}>
              {action.status}
            </span>
          </div>

          <div className="mt-6 rounded-2xl border border-zinc-900 bg-zinc-900/30 p-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-zinc-500">Impact Preview</p>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <ImpactItem label="Before Shares" value={`${action.snapshots.before.shares}`} />
              <ImpactItem label="After Shares" value={`${action.snapshots.after.shares}`} />
              <ImpactItem label="Before Avg Cost" value={formatCurrency(action.snapshots.before.avgCost)} />
              <ImpactItem label="After Avg Cost" value={formatCurrency(action.snapshots.after.avgCost)} />
              <ImpactItem label="Before Total Cost" value={formatCurrency(action.snapshots.before.totalCost)} />
              <ImpactItem label="After Total Cost" value={formatCurrency(action.snapshots.after.totalCost)} />
              <ImpactItem label="Est. Price After" value={formatCurrency(action.snapshots.after.estimatedPriceAfter)} />
              <ImpactItem label="Est. Value" value={formatCurrency(action.snapshots.after.estimatedValue)} />
            </div>
            {action.cashInLieu !== undefined && (
              <div className="mt-4 rounded-xl border border-amber-500/20 bg-amber-500/10 p-3">
                <p className="text-[10px] font-bold uppercase tracking-widest text-amber-300">Cash in lieu</p>
                <p className="mt-1 text-sm font-black text-white">{formatCurrency(action.cashInLieu)}</p>
                <p className="mt-1 text-xs text-zinc-300">Reverse split rounds down fractional shares and pays cash in lieu using the last mocked price.</p>
              </div>
            )}
          </div>

          <div className="mt-4 rounded-2xl border border-zinc-900 bg-zinc-900/20 p-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-zinc-500">Disclosures</p>
            <ul className="mt-3 space-y-2">
              {action.notes.concat(action.disclosures).map((entry) => (
                <li key={entry} className="text-xs text-zinc-300">{entry}</li>
              ))}
            </ul>
            <p className="mt-3 text-xs text-zinc-500">
              Market value should remain approximately unchanged aside from price movement and any cash in lieu.
            </p>
          </div>

          {action.status === 'upcoming' && holding && (
            <button
              type="button"
              onClick={handleApply}
              className="mt-6 w-full rounded-2xl bg-white px-4 py-4 text-sm font-black uppercase tracking-[0.25em] text-black"
            >
              Apply Corporate Action
            </button>
          )}

          {action.status === 'applied' && (
            <div className="mt-6 space-y-3">
              <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4">
                <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-300">Applied</p>
                <p className="mt-1 text-sm text-white">Holding updated on {new Date(action.appliedAt ?? action.effectiveAt).toLocaleString()}.</p>
              </div>
              <Link
                href="/corporate-actions"
                className="flex items-center justify-between rounded-2xl border border-zinc-900 bg-zinc-900/30 px-4 py-4"
              >
                <span className="text-sm font-black text-white">Back to Corporate Actions</span>
                <ChevronRight size={16} className="text-zinc-700" />
              </Link>
            </div>
          )}
        </div>

        <div className="mt-4 rounded-[28px] border border-zinc-900 bg-zinc-950 p-5">
          <p className="text-sm font-black uppercase tracking-widest text-white">Timeline</p>
          <div className="mt-4 space-y-4">
            {action.history.map((entry) => (
              <div key={`${entry.timestamp}-${entry.note}`} className="flex gap-3">
                <div className={`mt-1 w-3 h-3 rounded-full ${entry.status === 'applied' ? 'bg-emerald-400' : 'bg-amber-300'}`} />
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">{new Date(entry.timestamp).toLocaleString()}</p>
                  <p className="mt-1 text-sm text-white">{entry.note}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function ImpactItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[9px] font-bold uppercase tracking-widest text-zinc-600">{label}</p>
      <p className="mt-1 text-sm font-black text-white">{value}</p>
    </div>
  )
}
