import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const { question, answer } = await req.json()

    const checkPrompt = `Question: ${question} \nAnswer: ${answer}\nDecide if the answe is correct. Reply only "true" or false. ` //The prompt should have been to shut him down if gets it wrong but idk
    const res = await fetch("https://ai.hackclub.com/chat/completions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            model: "openai/gpt-oss-20b", //this model because it is really fast. and free lol
            messages: [{ role: "system", content: checkPrompt}]
        })
    })

    const data = await res.json();
    const correct = /true/i.test(data.choices?.[0]?.message?.content);
    return NextResponse.json({ correct })
}