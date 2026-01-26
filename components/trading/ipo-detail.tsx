'use client'

import { useState } from 'react'
import { ChevronLeft, Share2, ChevronRight, ExternalLink } from 'lucide-react'
import type { IPOStock, IpoOrder } from '@/lib/types'
import { IpoOrderDrawer } from './ipo-order-drawer'
import { getSubscriptionStart, getSubscriptionEnd, formatOpensIn, getDisplayPhases } from '@/lib/ipo-utils'

interface IPODetailProps {
  ipo: IPOStock
  onBack: () => void
  onIpoOrderSubmit?: (order: IpoOrder) => void
  onNavigateToTrade?: () => void
  availableBalance?: number
}

const tabs = ['PROSPECTUS', 'FINANCING', 'ALLOTMENT']

export function IPODetail({ 
  ipo, 
  onBack, 
  onIpoOrderSubmit,
  onNavigateToTrade,
  availableBalance = 1284560
}: IPODetailProps) {
  const [activeTab, setActiveTab] = useState('PROSPECTUS')
  const [showIpoOrderDrawer, setShowIpoOrderDrawer] = useState(false)

  const startDt = getSubscriptionStart(ipo)
  const endDt = getSubscriptionEnd(ipo)
  const now = Date.now()
  const isBeforeStart = now < startDt.getTime()
  const isInWindow = now >= startDt.getTime() && now <= endDt.getTime()
  const isAfterEnd = now > endDt.getTime()

  const phases = getDisplayPhases(ipo)

  return (
    <div className="min-h-screen bg-black text-white pb-36">
      {/* Header */}
      <div className="sticky top-0 bg-black/95 backdrop-blur-md z-50 border-b border-zinc-900">
        <div className="flex items-center justify-between px-4 py-4">
          <button onClick={onBack} className="p-2 hover:bg-zinc-900 rounded-full -ml-2">
            <ChevronLeft size={22} className="text-zinc-400" />
          </button>
          <div className="text-center flex-1">
            <div className="flex items-center justify-center gap-2">
              <span className="font-black text-sm">{ipo.symbol}</span>
              <span className="text-zinc-500 text-sm font-medium">{ipo.name}</span>
            </div>
            <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">
              {ipo.status === 'subscribing' ? 'Subscribing' : ipo.status === 'pending' ? 'Pending' : 'Listed'}
            </span>
          </div>
          <button className="p-2 hover:bg-zinc-900 rounded-full -mr-2 flex items-center gap-1">
            <Share2 size={18} className="text-zinc-400" />
            <span className="text-[10px] text-zinc-500 font-bold">7k</span>
          </button>
        </div>
      </div>

      {/* Price Range Section */}
      <div className="px-4 py-6 border-b border-zinc-900">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">
              Issue Price
            </span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-4xl font-black tracking-tight text-white">
                {ipo.issuePrice.toFixed(3)}
              </span>
              {ipo.issuePriceMax && ipo.issuePriceMax !== ipo.issuePrice && (
                <>
                  <span className="text-2xl font-light text-zinc-600">~</span>
                  <span className="text-4xl font-black tracking-tight text-white">
                    {ipo.issuePriceMax.toFixed(3)}
                  </span>
                </>
              )}
            </div>
            <span className="text-xs font-bold text-zinc-600 mt-1">{ipo.currency}</span>
          </div>
          
          {/* Market flags */}
          <div className="flex gap-1">
            {ipo.currency === 'HKD' && (
              <>
                <div className="w-6 h-4 bg-red-600 rounded-sm flex items-center justify-center">
                  <span className="text-[8px] text-yellow-400">★</span>
                </div>
                <div className="w-6 h-4 rounded-sm overflow-hidden flex">
                  <div className="w-1/2 bg-red-600" />
                  <div className="w-1/2 bg-white" />
                </div>
              </>
            )}
            {ipo.currency === 'USD' && (
              <div className="w-8 h-5 bg-gradient-to-b from-blue-800 to-red-700 rounded-sm" />
            )}
          </div>
        </div>
      </div>

      {/* Participate: main CTA below price */}
      <div className="px-4 py-4">
        {isBeforeStart ? (
          <button
            disabled
            className="w-full py-4 rounded-xl font-black text-sm uppercase tracking-[0.2em] bg-zinc-800 text-zinc-500 cursor-not-allowed"
          >
            {formatOpensIn(startDt)}
          </button>
        ) : isInWindow ? (
          <button
            onClick={() => setShowIpoOrderDrawer(true)}
            className="w-full py-4 rounded-xl font-black text-sm uppercase tracking-[0.2em] bg-[#F04438] text-white shadow-lg shadow-[#F04438]/20 active:scale-[0.99] transition-transform"
          >
            Participate
          </button>
        ) : (
          <button
            disabled
            className="w-full py-4 rounded-xl font-black text-sm uppercase tracking-[0.2em] bg-zinc-800 text-zinc-500 cursor-not-allowed"
          >
            Closed
          </button>
        )}
      </div>

      {/* 5-Node Timeline */}
      <div className="px-4 py-6 border-b border-zinc-900 overflow-x-auto no-scrollbar">
        <div className="relative min-w-[500px]">
          {/* Progress Line */}
          <div className="absolute top-3 left-4 right-4 h-0.5 bg-zinc-900" />
          <div 
            className="absolute top-3 left-4 h-0.5 bg-blue-500 transition-all duration-500"
            style={{ width: `${Math.min(100, (ipo.currentPhase / 4) * 100)}%` }}
          />
          
          <div className="relative flex justify-between">
            {phases.map((phase, index) => {
              const isCompleted = index < ipo.currentPhase
              const isCurrent = index === ipo.currentPhase
              
              return (
                <div key={phase.label} className="flex flex-col items-center w-20">
                  {/* Node */}
                  <div className="relative">
                    <div 
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center z-10 ${
                        isCompleted || isCurrent
                          ? 'bg-blue-500 border-blue-500' 
                          : 'bg-zinc-900 border-zinc-800'
                      }`}
                    >
                      {(isCompleted || isCurrent) && (
                        <div className="w-2 h-2 rounded-full bg-white" />
                      )}
                    </div>
                    {isCurrent && (
                      <div className="absolute inset-0 rounded-full bg-blue-500 opacity-30 animate-ping" />
                    )}
                  </div>
                  
                  {/* Label */}
                  <span className={`text-[9px] font-bold uppercase tracking-wider mt-3 text-center ${
                    isCompleted || isCurrent ? 'text-blue-400' : 'text-zinc-600'
                  }`}>
                    {phase.label}
                  </span>
                  
                  {/* Date & Time */}
                  <span className={`text-[10px] tabular-nums mt-1 ${
                    isCompleted || isCurrent ? 'text-blue-400' : 'text-zinc-700'
                  }`}>
                    {phase.date}
                  </span>
                  {phase.time && (
                    <span className={`text-[9px] tabular-nums ${
                      isCompleted || isCurrent ? 'text-blue-400' : 'text-zinc-700'
                    }`}>
                      {phase.time}
                    </span>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Content Tabs */}
      <div className="px-4 py-4">
        <div className="flex bg-zinc-900/40 rounded-full p-1">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                activeTab === tab 
                  ? 'bg-zinc-800 text-white' 
                  : 'text-zinc-600'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="px-4 space-y-6">
        {activeTab === 'PROSPECTUS' && (
          <>
            {/* Company Intro */}
            <div className="bg-zinc-900/40 rounded-2xl p-5">
              <h3 className="text-sm font-black mb-3">Company Introduction</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                {ipo.companyIntro}
              </p>
            </div>

            {/* Basic Info - Data Matrix Style */}
            <div className="bg-zinc-900/40 rounded-2xl p-5">
              <h3 className="text-sm font-black mb-4">Basic Information</h3>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-zinc-800">
                  <span className="text-[11px] font-bold text-zinc-600 uppercase tracking-wider">Issue Price</span>
                  <span className="text-sm font-black text-white">
                    {ipo.issuePrice.toFixed(3)} ~ {ipo.issuePriceMax?.toFixed(3)} {ipo.currency}
                  </span>
                </div>
                
                <div className="flex justify-between items-center py-2 border-b border-zinc-800">
                  <span className="text-[11px] font-bold text-zinc-600 uppercase tracking-wider">Lot Size</span>
                  <span className="text-sm font-black text-white">{ipo.lotSize} Shares</span>
                </div>
                
                <div className="flex justify-between items-center py-2 border-b border-zinc-800">
                  <span className="text-[11px] font-bold text-zinc-600 uppercase tracking-wider">Prospectus</span>
                  <button className="flex items-center gap-1 text-blue-400">
                    <span className="text-sm font-bold">View PDF</span>
                    <ExternalLink size={14} />
                  </button>
                </div>
                
                <div className="flex justify-between items-center py-2 border-b border-zinc-800">
                  <span className="text-[11px] font-bold text-zinc-600 uppercase tracking-wider">Industry</span>
                  <span className="text-sm font-black text-white">{ipo.industry}</span>
                </div>
                
                <div className="py-2">
                  <span className="text-[11px] font-bold text-zinc-600 uppercase tracking-wider block mb-2">Use of Proceeds</span>
                  <div className="flex items-start justify-between">
                    <p className="text-sm text-zinc-400 leading-relaxed flex-1 pr-2">
                      {ipo.useOfProceeds}
                    </p>
                    <ChevronRight size={18} className="text-zinc-600 flex-shrink-0" />
                  </div>
                </div>
              </div>
            </div>

            {/* Intermediaries */}
            <div className="bg-zinc-900/40 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-black">Intermediaries</h3>
                <ChevronRight size={18} className="text-zinc-600" />
              </div>
              
              <div className="bg-zinc-900/60 rounded-xl p-4">
                <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Sponsor</span>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-sm font-black text-white">{ipo.sponsor}</span>
                  <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">{ipo.sponsorRole}</span>
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === 'FINANCING' && (
          <div className="bg-zinc-900/40 rounded-2xl p-5">
            <h3 className="text-sm font-black mb-4">Financing Overview</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-zinc-800">
                <span className="text-[11px] font-bold text-zinc-600 uppercase tracking-wider">Entry Fee</span>
                <span className="text-sm font-black text-white">${ipo.entryFee.toLocaleString()} {ipo.currency}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-zinc-800">
                <span className="text-[11px] font-bold text-zinc-600 uppercase tracking-wider">Min Subscription</span>
                <span className="text-sm font-black text-white">{ipo.lotSize} Shares</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-[11px] font-bold text-zinc-600 uppercase tracking-wider">Public Offer Ratio</span>
                <span className="text-sm font-black text-white">10%</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'ALLOTMENT' && (
          <div className="bg-zinc-900/40 rounded-2xl p-5">
            <h3 className="text-sm font-black mb-4">Allotment Results</h3>
            {ipo.currentPhase >= 2 ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-zinc-800">
                  <span className="text-[11px] font-bold text-zinc-600 uppercase tracking-wider">Total Applications</span>
                  <span className="text-sm font-black text-white">1,234,567</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-zinc-800">
                  <span className="text-[11px] font-bold text-zinc-600 uppercase tracking-wider">Subscription Rate</span>
                  <span className="text-sm font-black text-[#F04438]">89.5x</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-[11px] font-bold text-zinc-600 uppercase tracking-wider">Winning Rate</span>
                  <span className="text-sm font-black text-white">2.34%</span>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <span className="text-zinc-600 text-sm">Results not yet announced</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Sticky Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-black border-t border-zinc-900 max-w-[430px] mx-auto z-50">
        {/* Info Tabs */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-900">
          <div className="flex items-center gap-6">
            <button className="flex items-center gap-1">
              <span className="text-xs font-bold text-white">News</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#F04438]" />
            </button>
            <button className="flex items-center gap-1">
              <span className="text-xs font-bold text-zinc-600">Discussion</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#F04438]" />
            </button>
            <button className="flex items-center gap-1">
              <span className="text-xs font-bold text-zinc-600">Announcements</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#F04438]" />
            </button>
          </div>
          <div className="w-8 h-8 rounded-full bg-zinc-900 flex items-center justify-center">
            <span className="text-[10px]">🤖</span>
          </div>
        </div>
        
        {/* Action Bar */}
        <div className="flex items-center justify-between px-4 py-3 pb-6">
          <div className="flex items-center gap-4">
            <button className="flex flex-col items-center gap-1">
              <div className="w-8 h-8 rounded-full bg-zinc-900 flex items-center justify-center">
                <span className="text-[10px]">⊞</span>
              </div>
              <span className="text-[9px] font-bold text-zinc-600 uppercase">More</span>
            </button>
            <button className="flex flex-col items-center gap-1">
              <div className="w-8 h-8 rounded-full bg-zinc-900 flex items-center justify-center">
                <Share2 size={14} className="text-zinc-400" />
              </div>
              <span className="text-[9px] font-bold text-zinc-600 uppercase">Share</span>
            </button>
            <button className="flex flex-col items-center gap-1">
              <div className="w-8 h-8 rounded-full bg-zinc-900 flex items-center justify-center">
                <span className="text-[10px]">✎</span>
              </div>
              <span className="text-[9px] font-bold text-zinc-600 uppercase">Post</span>
            </button>
          </div>
          
          {/* Participate / Place IPO Order */}
          {isBeforeStart ? (
            <button
              disabled
              className="bg-zinc-800 px-10 py-4 rounded-full font-black text-xs uppercase tracking-[0.3em] text-zinc-500 cursor-not-allowed"
            >
              {formatOpensIn(startDt)}
            </button>
          ) : isInWindow ? (
            <button
              onClick={() => setShowIpoOrderDrawer(true)}
              className="bg-[#F04438] px-10 py-4 rounded-full font-black text-xs uppercase tracking-[0.3em] shadow-xl shadow-[#F04438]/20 active:scale-95 transition-transform"
            >
              Participate
            </button>
          ) : (
            <button
              disabled
              className="bg-zinc-800 px-10 py-4 rounded-full font-black text-xs uppercase tracking-[0.3em] text-zinc-500 cursor-not-allowed"
            >
              Closed
            </button>
          )}
        </div>
      </div>

      {/* IPO Order Drawer */}
      {showIpoOrderDrawer && (
        <IpoOrderDrawer
          ipo={ipo}
          onClose={() => setShowIpoOrderDrawer(false)}
          onSubmit={onIpoOrderSubmit}
          onNavigateToTrade={onNavigateToTrade}
          availableBalance={availableBalance}
        />
      )}
    </div>
  )
}
