import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const { messages } = await req.json()

  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "alibaba/tongyi-deepresearch-30b-a3b:free",
      messages,
    }),
  })

  const data = await res.json()
  const reply = data.choices?.[0]?.message?.content
  return NextResponse.json({ reply })
}
