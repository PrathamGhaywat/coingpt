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
        content: data.reply || "Sorry, I didn’t understand that.",
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

    return (
        <div className="flex flex-col items-center justify-cneter h-screen p-4">
            <Card className="w-full max-w-2xl h-[80vh] flex flex-col">
                <CardHeader className="fley justify-between items-center">
                    <CardTitle>Chat with AI</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col flex-grow">
                    <ScrollArea ref={scrollRef} className="flex-grow border rounded-md p-3 mb-3">
                        {messages.length === 0 ? (
                        <p className="text-muted-foreground text-center">
                            Start chatting with CoinGPT!
                        </p>
                        ) : (
                        messages.map((msg, i) => (
                            <div
                            key={i}
                            className={`mb-2 p-2 rounded-lg ${
                                msg.role === "user"
                                ? "bg-primary text-primary-foreground self-end ml-auto max-w-[80%]"
                                : "bg-muted text-muted-foreground max-w-[80%]"
                            }`}
                            >
                            {msg.content}
                            </div>
                        ))
                        )}
                    </ScrollArea>

                    <div className="flex gap-2">
                        <Input
                        placeholder={coins > 0 ? "Type your message..." : "No coins left!"}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        disabled={loading || coins <= 0}
                        />
                        <Button onClick={sendMessage} disabled={loading || coins <= 0}>
                        {loading ? "..." : "Send"}
                        </Button>
                    </div>

                    <div className="flex justify-between mt-4">
                        <Button variant="outline" onClick={clearChat}>
                        Clear Chat
                        </Button>
                        <Link href="/quiz">
                        <Button variant="secondary">Back to Quiz</Button>
                        </Link>
                    </div>
            </CardContent>
            </Card>
        </div>
    )
  }