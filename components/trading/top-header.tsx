'use client'

import { ChevronLeft, Share2, Star } from 'lucide-react'

interface TopHeaderProps {
  title: string
  subtitle?: string
  badge?: string
  badgeColor?: string
  showBack?: boolean
  onBack?: () => void
}

export function TopHeader({ 
  title, 
  subtitle, 
  badge, 
  badgeColor = 'from-blue-600 to-purple-600',
  showBack = false,
  onBack 
}: TopHeaderProps) {
  return (
    <div className="sticky top-0 bg-black/95 backdrop-blur-md z-50 flex items-center justify-between px-4 py-3 border-b border-zinc-900/50">
      {showBack ? (
        <button 
          onClick={onBack}
          className="p-2 hover:bg-zinc-900 rounded-full"
        >
          <ChevronLeft size={22} className="text-zinc-400" />
        </button>
      ) : (
        <div className="w-10" />
      )}
      
      <div className="flex-1 text-center">
        <div className="flex items-center justify-center gap-2">
          <h2 className="font-black text-xs tracking-tight uppercase">{title}</h2>
          {badge && (
            <div className={`px-3 py-1.5 rounded-full bg-gradient-to-r ${badgeColor}`}>
              <span className="text-[9px] font-black uppercase tracking-widest">{badge}</span>
            </div>
          )}
        </div>
        {subtitle && (
          <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest mt-1">
            {subtitle}
          </p>
        )}
      </div>
      
      <div className="flex gap-2">
        <button className="p-2 hover:bg-zinc-900 rounded-full">
          <Star size={18} className="text-zinc-400" />
        </button>
        <button className="p-2 hover:bg-zinc-900 rounded-full">
          <Share2 size={18} className="text-zinc-400" />
        </button>
      </div>
    </div>
  )
}
