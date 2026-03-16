'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ArrowLeft, ChevronLeft, ShieldAlert } from 'lucide-react'
import { useOptionsOrders } from '@/hooks/use-options-orders'
import { findOptionContract, formatOptionContractLabel } from '@/lib/options'
import type { OptionsOrder, OptionsOrderSide, OptionsPriceType } from '@/lib/types'

type TicketStep = 'ticket' | 'review'

const sideOptions: OptionsOrderSide[] = [
  'buy_to_open',
  'sell_to_open',
  'buy_to_close',
  'sell_to_close',
]

const formatCurrency = (value: number) =>
  `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

const generateRefId = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let result = 'OP'
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

function calculateOrderMetrics(
  pricePerContract: number,
  quantityContracts: number,
  side: OptionsOrderSide,
  multiplier: number
) {
  const premiumValue = pricePerContract * quantityContracts * multiplier
  const fees = quantityContracts > 0 ? Math.max(1.5, quantityContracts * 0.85) : 0
  const credit = Math.max(premiumValue - fees, 0)

  switch (side) {
    case 'buy_to_open':
    case 'buy_to_close':
      return {
        estimatedCost: premiumValue,
        fees,
        buyingPowerImpact: premiumValue + fees,
        maxLoss: premiumValue + fees,
        maxProfit: 'unlimited' as const,
      }
    case 'sell_to_open':
      return {
        estimatedCost: premiumValue,
        fees,
        buyingPowerImpact: Math.max(premiumValue * 0.45, multiplier * quantityContracts * pricePerContract * 0.2),
        maxLoss: 'unlimited' as const,
        maxProfit: credit,
      }
    case 'sell_to_close':
      return {
        estimatedCost: premiumValue,
        fees,
        buyingPowerImpact: 0,
        maxLoss: 0,
        maxProfit: credit,
      }
  }
}

export default function OptionsOrderPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const contractId = searchParams.get('contract') ?? ''
  const contractQuote = useMemo(() => findOptionContract(contractId), [contractId])
  const { addOrder } = useOptionsOrders()
  const [step, setStep] = useState<TicketStep>('ticket')
  const [side, setSide] = useState<OptionsOrderSide>('buy_to_open')
  const [priceType, setPriceType] = useState<OptionsPriceType>('limit')
  const [quantityContracts, setQuantityContracts] = useState(1)
  const [limitPrice, setLimitPrice] = useState(contractQuote?.ask ?? 1)

  if (!contractQuote) {
    return (
      <div className="min-h-screen bg-black px-4 py-4 text-white">
        <div className="mx-auto max-w-[430px] rounded-[28px] border border-zinc-900 bg-zinc-950 p-6 text-center">
          <p className="text-sm font-black uppercase tracking-widest">Contract not found</p>
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

  const contract = contractQuote.contract
  const executionPrice = priceType === 'market' ? contractQuote.ask : limitPrice
  const metrics = calculateOrderMetrics(executionPrice, quantityContracts, side, contract.multiplier)

  const handleSubmit = () => {
    const now = new Date()
    const order: OptionsOrder = {
      id: `OPT-${Date.now()}`,
      refId: generateRefId(),
      type: 'options',
      contract,
      side,
      quantityContracts,
      priceType,
      limitPrice: priceType === 'limit' ? executionPrice : undefined,
      status: 'submitted',
      timestamp: now,
      timestamps: {
        createdAt: now.toISOString(),
        updatedAt: now.toISOString(),
        submittedAt: now.toISOString(),
      },
      statusHistory: [
        {
          status: 'submitted',
          timestamp: now.toISOString(),
          note: 'Options order received and routed to the mock broker desk.',
        },
      ],
      filledContracts: 0,
      remainingContracts: quantityContracts,
      avgFilledPrice: undefined,
      fees: metrics.fees,
      estimatedCost: metrics.estimatedCost,
      buyingPowerImpact: metrics.buyingPowerImpact,
      maxLoss: metrics.maxLoss,
      maxProfit: metrics.maxProfit,
    }

    const created = addOrder(order)
    router.push(`/orders/confirmation/${created.id}`)
  }

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
            <p className="text-sm font-black uppercase tracking-widest">
              {step === 'ticket' ? 'Options Order' : 'Order Review'}
            </p>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-600">{contract.underlying}</p>
          </div>
          <div className="w-10 h-10" />
        </div>

        <div className="mt-6 rounded-[28px] border border-zinc-900 bg-zinc-950 p-5">
          {step === 'ticket' ? (
            <>
              <div className="rounded-2xl border border-zinc-900 bg-zinc-900/40 p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Selected Contract</p>
                <p className="mt-2 text-lg font-black text-white">{formatOptionContractLabel(contract)}</p>
                <p className="mt-2 text-[11px] font-bold uppercase tracking-widest text-zinc-500">
                  Bid {formatCurrency(contractQuote.bid)} · Ask {formatCurrency(contractQuote.ask)} · Last {formatCurrency(contractQuote.last)}
                </p>
              </div>

              <div className="mt-4 rounded-full bg-zinc-900/60 p-1">
                <div className="grid grid-cols-2 gap-1">
                  {sideOptions.map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setSide(option)}
                      className={`rounded-full px-2 py-3 text-[10px] font-black uppercase tracking-[0.18em] ${
                        side === option ? 'bg-zinc-800 text-white' : 'text-zinc-600'
                      }`}
                    >
                      {option.replaceAll('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-4 rounded-full bg-zinc-900/60 p-1 flex">
                <button
                  type="button"
                  onClick={() => setPriceType('limit')}
                  className={`flex-1 rounded-full py-3 text-[11px] font-black uppercase tracking-[0.2em] ${
                    priceType === 'limit' ? 'bg-zinc-800 text-white' : 'text-zinc-600'
                  }`}
                >
                  Limit
                </button>
                <button
                  type="button"
                  onClick={() => setPriceType('market')}
                  className={`flex-1 rounded-full py-3 text-[11px] font-black uppercase tracking-[0.2em] ${
                    priceType === 'market' ? 'bg-zinc-800 text-white' : 'text-zinc-600'
                  }`}
                >
                  Market
                </button>
              </div>

              <div className="mt-4 grid gap-4">
                <TicketField
                  label="Quantity (Contracts)"
                  value={quantityContracts}
                  onChange={(value) => setQuantityContracts(Math.max(1, Number.parseInt(value, 10) || 1))}
                />
                {priceType === 'limit' && (
                  <TicketField
                    label="Limit Price"
                    value={limitPrice}
                    step="0.05"
                    onChange={(value) => setLimitPrice(Math.max(0.05, Number.parseFloat(value) || contractQuote.ask))}
                  />
                )}
              </div>

              <div className="mt-4 rounded-2xl border border-zinc-900 bg-zinc-900/30 p-4">
                <div className="grid grid-cols-2 gap-4">
                  <InfoItem label="Estimated Cost" value={formatCurrency(metrics.estimatedCost)} />
                  <InfoItem label="Fees" value={formatCurrency(metrics.fees)} />
                  <InfoItem label="Buying Power Impact" value={formatCurrency(metrics.buyingPowerImpact)} />
                  <InfoItem label="Max Loss" value={typeof metrics.maxLoss === 'number' ? formatCurrency(metrics.maxLoss) : 'Unlimited'} />
                  <InfoItem label="Max Profit" value={typeof metrics.maxProfit === 'number' ? formatCurrency(metrics.maxProfit) : 'Unlimited'} />
                  <InfoItem label="Multiplier" value={`${contract.multiplier}x`} />
                </div>
              </div>

              <button
                type="button"
                onClick={() => setStep('review')}
                className="mt-5 w-full rounded-2xl bg-white px-4 py-4 text-sm font-black uppercase tracking-[0.25em] text-black"
              >
                Review Order
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => setStep('ticket')}
                className="mb-4 inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-zinc-500 hover:text-white"
              >
                <ArrowLeft size={14} />
                Edit Ticket
              </button>

              <div className="rounded-2xl border border-zinc-900 bg-zinc-900/40 p-4">
                <div className="grid grid-cols-2 gap-4">
                  <InfoItem label="Underlying" value={contract.underlying} />
                  <InfoItem label="Expiration" value={contract.expiration} />
                  <InfoItem label="Strike" value={contract.strike.toFixed(2)} />
                  <InfoItem label="Right" value={contract.right.toUpperCase()} />
                  <InfoItem label="Side" value={side.replaceAll('_', ' ')} />
                  <InfoItem label="Quantity" value={`${quantityContracts} contracts`} />
                  <InfoItem label="Order Type" value={priceType.toUpperCase()} />
                  <InfoItem label="Limit Price" value={priceType === 'limit' ? formatCurrency(executionPrice) : 'Market'} />
                  <InfoItem label="Estimated Cost" value={formatCurrency(metrics.estimatedCost)} />
                  <InfoItem label="Estimated Fees" value={formatCurrency(metrics.fees)} />
                  <InfoItem label="Buying Power Impact" value={formatCurrency(metrics.buyingPowerImpact)} />
                  <InfoItem label="Max Loss" value={typeof metrics.maxLoss === 'number' ? formatCurrency(metrics.maxLoss) : 'Unlimited'} />
                  <InfoItem label="Max Profit" value={typeof metrics.maxProfit === 'number' ? formatCurrency(metrics.maxProfit) : 'Unlimited'} />
                </div>
              </div>

              <div className="mt-4 rounded-2xl border border-amber-500/20 bg-amber-500/10 p-4">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/15">
                    <ShieldAlert size={18} className="text-amber-400" />
                  </div>
                  <div>
                    <p className="text-[11px] font-black uppercase tracking-widest text-amber-300">Options Risk Disclosure</p>
                    <p className="mt-2 text-xs leading-relaxed text-zinc-300">
                      Options are leveraged instruments. Time decay, implied volatility changes, assignment risk, and wide spreads can materially affect outcomes before execution or expiry.
                    </p>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleSubmit}
                className="mt-5 w-full rounded-2xl bg-white px-4 py-4 text-sm font-black uppercase tracking-[0.25em] text-black"
              >
                Place Order
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

function TicketField({
  label,
  value,
  onChange,
  step = '1',
}: {
  label: string
  value: number
  onChange: (value: string) => void
  step?: string
}) {
  return (
    <div className="rounded-2xl border border-zinc-900 bg-zinc-900/30 p-4">
      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">{label}</p>
      <input
        type="number"
        min="0"
        step={step}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-3 w-full bg-transparent text-3xl font-black tabular-nums text-white outline-none"
      />
    </div>
  )
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[9px] font-bold uppercase tracking-widest text-zinc-600">{label}</p>
      <p className="mt-1 text-sm font-black text-white">{value}</p>
    </div>
  )
}
