import { NextResponse } from "next/server";

export async function GET() {
    const prompt = "Generate a trivia question. Not something ordinary, always new question. It should be not hard. Something an average human would know. Don't give me the answer only the question no text and no formating" //This should throw of the user lol
    const res = await fetch("https://ai.hackclub.com/chat/completions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            model: "openai/gpt-oss-20b", //this model because it is really fast. and free lol
            messages: [{ role: "system", content: prompt}]
        })
    })

    const data = await res.json();
    const question = data.choices?.[0]?.message?.content;
    return NextResponse.json({ question })

}