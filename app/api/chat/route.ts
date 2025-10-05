import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const { messages } = await req.json()

  const res = await fetch("https://ai.hackclub.com/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "openai/gpt-oss-20b",
      messages,
    }),
  })

  const data = await res.json()
  const reply = data.choices?.[0]?.message?.content
  return NextResponse.json({ reply })
}
