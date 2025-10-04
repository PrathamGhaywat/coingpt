import { NextResponse } from "next/server";

export async function GET() {
    const prompt = "Generate a simple trivia question. It should be either very easy or almost impossible to guess and only has one answer." //This should throw of the user lol
    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            model: "mistralai/mistral-small-3.2-24b-instruct:free", //this model because it is really fast. and free lol
            messages: [{ role: "system", content: prompt}]
        })
    })

    const data = await res.json();
    const question = data.choices?.[0]?.message?.content;
    return NextResponse.json({ question })

}