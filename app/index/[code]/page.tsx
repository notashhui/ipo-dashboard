'use client'

import { useParams, useRouter } from 'next/navigation'
import { getIndexByCode } from '@/lib/mock/index-constituents'
import { IndexConstituentsModule } from '@/components/trading/index-constituents-module'

export default function IndexConstituentsPage() {
  const params = useParams()
  const router = useRouter()
  const code = typeof params.code === 'string' ? params.code : ''
  const index = getIndexByCode(code)

  if (!index) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4">
        <p className="text-zinc-500 text-sm">Index not found</p>
        <button onClick={() => router.back()} className="mt-4 text-amber-500 text-sm font-bold uppercase">
          Back
        </button>
      </div>
    )
  }

  return (
    <IndexConstituentsModule
      index={index}
      onBack={() => router.back()}
    />
  )
}
