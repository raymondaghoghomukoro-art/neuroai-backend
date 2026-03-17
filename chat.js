import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function getAIResponse(userMessage) {
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: "You are a helpful NeuroAI assistant." },
      { role: "user", content: userMessage }
    ],
  });

  return response.choices[0].message.content;
}

async function main() {
  const reply = await getAIResponse("Hello");
  console.log("AI:", reply);
}

main();