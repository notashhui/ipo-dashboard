'use client'

import { LayoutGrid, BarChart3, Zap, Wallet } from 'lucide-react'

export type TabType = 'square' | 'markets' | 'trade' | 'assets'

interface BottomNavProps {
  currentTab: TabType
  onTabChange: (tab: TabType) => void
}

export function BottomNav({ currentTab, onTabChange }: BottomNavProps) {
  const tabs = [
    { id: 'square' as const, label: 'Square', icon: LayoutGrid },
    { id: 'markets' as const, label: 'Markets', icon: BarChart3 },
    { id: 'trade' as const, label: 'Trade', icon: Zap },
    { id: 'assets' as const, label: 'Assets', icon: Wallet },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-black border-t border-zinc-900 z-50 max-w-[430px] mx-auto">
      <div className="flex items-center justify-around py-2.5 pb-5">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = currentTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className="flex flex-col items-center gap-1.5 px-4 py-1"
            >
              <Icon 
                size={22} 
                strokeWidth={isActive ? 2 : 1.5}
                className={isActive ? 'text-teal-400' : 'text-zinc-600'} 
              />
              <span 
                className={`text-[10px] font-bold uppercase tracking-wider ${
                  isActive ? 'text-teal-400' : 'text-zinc-600'
                }`}
              >
                {tab.label}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
