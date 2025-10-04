'use client'

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { getStorage, saveStorage } from "@/lib/storage"
import { CoinDisplay } from "@/components/coin-display"
import Link from "next/link"

type ChatMessage = {
  role: "user" | "assistant"
  content: string
}

export default function ChatPage() {
  const [coins, setCoins] = useState<number>(0)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const scrollRef = useRef<HTMLDivElement | null>(null)

  // Load your chat
  useEffect(() => {
    const data = getStorage()
    setCoins(data.coins)
    setMessages(data.chatHistory || [])
  }, [])

  // Auto scroll - not doom scroll. Helpline: this-doesn't-exist-muhahaha
  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    })
  }, [messages])

  const sendMessage = async () => {
    if (!input.trim()) return
    if (coins <= 0) {
      alert("💰 You need more coins! Earn them in the Quiz.")
      return
    }

    const userMessage: ChatMessage = { role: "user", content: input }
    const newMessages = [...messages, userMessage]
    setMessages(newMessages)
    setInput("")
    setCoins((c) => c - 1)
    setLoading(true)
    saveStorage({ coins: coins - 1, chatHistory: newMessages })

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      })
      const data = await res.json()

      const aiMessage: ChatMessage = {
        role: "assistant",
        content: data.reply || "🤖 Sorry, I didn’t understand that.",
      }

      const updated = [...newMessages, aiMessage]
      setMessages(updated)
      saveStorage({ chatHistory: updated })
    } catch (error) {
      console.error("Chat error:", error)
      alert("Something went wrong with the AI.")
    } finally {
      setLoading(false)
    }
    }
    const clearChat = () => {
        if (!confirm("Clear chat history")) return 
        setMessages([])
        saveStorage({ chatHistory: []})
    }
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && !loading) sendMessage()
    }
  }