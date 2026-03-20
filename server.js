import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post("/api/ask", async (req, res) => {
  console.log("📩 Request received");

  const userMessage = req.body.message;

  try {
    console.log("🧠 Sending request to OpenAI...");

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are NeuroAI." },
        { role: "user", content: userMessage },
      ],
    });

    console.log("✅ OpenAI responded");

    res.json({
      reply: completion.choices[0].message.content,
    });

  } catch (error) {
    console.error("❌ ERROR:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
});
