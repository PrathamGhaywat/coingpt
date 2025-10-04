'use client'
import { Coins } from "lucide-react"

export function CoinDisplay({ coins }: { coins: number }) {
    return(
        <div className="flex items-center gap-2 text-yellow-500 font-semibold">
            <Coins className="w-5 h-5" /> {coins} Coins
        </div>
    )
}