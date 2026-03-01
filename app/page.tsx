"use client"

import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function TopPage() {
  const router = useRouter()
  const [isNavigating, setIsNavigating] = useState(false)

  const handleStartClick = () => {
    if (isNavigating) return
    setIsNavigating(true)
    router.push('/quiz')
  }

  return (
    <div className="min-h-screen bg-green-600 flex flex-col items-center justify-center">
      <div className="mb-8">
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
