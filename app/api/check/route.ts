import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const { question, answer } = await req.json()

    const checkPrompt = `Question: ${question} \nAnswer: {answer} \nDecide if the answe is correct. Reply only "true" or false. ` //The prompt should have been to shut him down if gets it wrong but idk
    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            model: "google/gemma-3n-e2b-it:free", //this model because it is really fast. and free lol
            messages: [{ role: "system", content: checkPrompt}]
        })
    })

    const data = await res.json();
    const correct = /true/i.test(data.choices?.[0]?.message?.content);
    return NextResponse.json({ correct })
}