'use client'

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { getStorage, saveStorage } from "@/lib/storage"
import Link from "next/link"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import rehypeHighlight from "rehype-highlight"

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

  useEffect(() => {
    const data = getStorage()
    setCoins(data.coins)
    setMessages(data.chatHistory || [])
  }, [])

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    })
  }, [messages])

  const sendMessage = async () => {
    if (!input.trim()) return
    if (coins <= 0) {
      alert("You need more coins! Earn them in the Quiz broke kid.")
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
        content: data.reply || "Sorry, I didn’t understand that. Or my API isn't working",
      }

      const updated = [...newMessages, aiMessage]
      setMessages(updated)
      saveStorage({ chatHistory: updated })
    } catch (error) {
      console.error("Chat error:", error)
      alert("Something went wrong with the AI. Maybe the API isn't working")
    } finally {
      setLoading(false)
    }
  }

  const clearChat = () => {
    if (!confirm("Clear chat history? U will never get ur convos back!")) return
    setMessages([])
    saveStorage({ chatHistory: [] })
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !loading) sendMessage()
  }

  return (
    <div className="flex flex-col h-screen">
      <header className="flex justify-between items-center p-4 border-b">
        <h1 className="text-lg font-semibold">CoinGPT</h1>
        <div className="flex items-center gap-3">
          <span className="text-sm opacity-75">Coins: {coins}</span>
          <Button variant="outline" size="sm" onClick={clearChat}>
            Clear
          </Button>
          <Link href="/quiz">
            <Button size="sm" variant="secondary">
              Back to Quiz
            </Button>
          </Link>
        </div>
      </header>

      <main ref={scrollRef} className="flex-grow overflow-y-auto p-6 space-y-4">
        {messages.length === 0 ? (
          <div className="flex justify-center items-center h-full opacity-60">
            Chat with CoinGPT
          </div>
        ) : (
          messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`px-4 py-2 rounded-2xl max-w-[80%] text-sm prose dark:prose-invert break-words ${
                  msg.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeHighlight]}
                  components={{
                    code({
                      inline,
                      className,
                      children,
                      ...props
                    }: {
                      inline?: boolean
                      className?: string
                      children?: React.ReactNode
                    }) {
                      return inline ? (
                        <code
                          className="rounded px-1 py-0.5 bg-muted-foreground/10"
                          {...props}
                        >
                          {children}
                        </code>
                      ) : (
                        <pre
                          className="rounded-lg p-3 overflow-x-auto text-sm"
                          {...props}
                        >
                          <code className={className}>{children}</code>
                        </pre>
                      )
                    },
                  }}
                >
                  {msg.content}
                </ReactMarkdown>
              </div>
            </div>
          ))
        )}
      </main>

      <footer className="p-4 border-t">
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
      </footer>
    </div>
  )
}
