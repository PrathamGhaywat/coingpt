'use client'

import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { v4 as uuidv4 } from "uuid"

type Coin = { id: string; x: number; y: number; size: number; delay: number }

export default function LandingPage() {
  const [coins, setCoins] = useState<Coin[]>([])
  useEffect(() => {
    const newCoins: Coin[] = Array.from({ length: 15 }, () => ({
      id: uuidv4(),
      x: Math.random() * 90 + 5, 
      y: Math.random() * 90 + 5,
      size: Math.random() * 30 + 20, 
      delay: Math.random() * 2, 
    }))
    setCoins(newCoins)
  }, [])
  return (
    <div className="relative h-screen flex flex-col items-center justify-center overflow-hidden">
      {coins.map((coin) => (
        <div
          key={coin.id}
          className="absolute text-yellow-400 animate-bounce"
          style={{
            left: `${coin.x}vw`,
            top: `${coin.y}vh`,
            fontSize: `${coin.size}px`,
            animationDelay: `${coin.delay}s`,
          }}
        >
          🪙
        </div>
      ))}

      <div className="text-center z-10 px-4">
        <h1 className="text-6xl md:text-8xl font-extrabold text-primary mb-4 drop-shadow-lg">
          CoinGPT
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground mb-8">
          You want AI, earn AI
        </p>
        <Button size="lg" className="px-8 py-4" asChild>
          <a href="/quiz">Try Now</a>
        </Button>
      </div>
    </div>
  )
}
