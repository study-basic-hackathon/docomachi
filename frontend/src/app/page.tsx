'use client'

import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function TopPage() {
  const router = useRouter()
  const [isNavigating, setIsNavigating] = useState(false)

  const handleStartClick = () => {
    if (isNavigating) return // Prevent duplicate navigation
    setIsNavigating(true)
    // Placeholder route - will be updated when next screen is implemented
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-green-600 flex flex-col items-center">
      {/* バナー画像 */}
      <div className="w-full max-w-4xl mt-8 px-4">
        <div className="relative w-full aspect-video">
          <Image
            src="/images/top-banner.png"
            alt="Top Banner"
            fill
            priority
            className="object-contain"
            onError={() => {
              // Image error handling - component will handle gracefully
            }}
          />
        </div>
      </div>

      {/* スタートボタン */}
      <div className="mt-12 mb-8">
        <Button
          size="lg"
          className="text-xl px-8 py-6 bg-white text-green-600 hover:bg-gray-100"
          onClick={handleStartClick}
          disabled={isNavigating}
        >
          スタート
        </Button>
      </div>
    </div>
  )
}
