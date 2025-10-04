'use client'
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
//I swear i am never going to use any component library other than shad f*cking cn...the rest are just a pain in the ass
import { getStorage, saveStorage } from "@/lib/storage"
import { CoinDisplay } from "@/components/coin-display"
import { CountdownTimer } from "@/components/countdown-timer"

export default function QuizPage() {
    const [question, setQuestion] = useState<string>("")
    const [answer, setAnswer] = useState<string>("")
    const [coins, setCoins] = useState<number>(0)
    const [cooldownUntil, setCooldownUntil] = useState<number>(0)
    const [loading, setLoading] = useState<boolean>(false)

    useEffect(() => {
        const data = getStorage()
        //fetching ur coins and cooldown data
        setCoins(data.coins)
        setCooldownUntil(data.cooldownUntil)
        if (data.cooldownUntil < Date.now()) fetchQuestion()
    }, [])

    //new question. stop reading my code u sniffer
    const fetchQuestion = async () => {
        setLoading(true)
        try {
            const res = await fetch("/api/question") 
            const data = await res.json()
            setQuestion(data.question)
        } catch (error) {
            console.error("Smthing broke and stop reading my debuggin bro: ", error)
            setQuestion("1 + 1 = ?")
        } finally {
            setLoading(false)
        }
    }
    
    //lets see if ur right
    const handleSubmit = async () => {
        try {
            const res = await fetch("/api/check", {
                method: "POST",
                headers: { "Content-Type": "application/json"},
                body: JSON.stringify({ question, answer})
            })
            const data = await res.json()
            const store = getStorage()

            if (data.correct) {
                store.coins += 5
                alert("Good job. Ur IQ is probably more than 21, unlike the popular belief society has about u")
            } else {
                store.cooldownUntil = Date.now() + 10 * 60 *1000
                alert("Gain more IQ and come back in 10 mins")
            }

            saveStorage(store)
            setCoins(store.coins)
            setCooldownUntil(store.cooldownUntil)
            setAnswer("")
            if (data.correct) fetchQuestion()
        } catch (error) {
            console.error("failed getting answer :-( ", error)
            alert("Failed fetching answer :sad:")
    }
    }
}