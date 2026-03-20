// ✅ ADD THIS AT THE VERY TOP
process.on("uncaughtException", (err) => {
  console.error("UNCAUGHT EXCEPTION:", err);
});

process.on("unhandledRejection", (err) => {
  console.error("UNHANDLED REJECTION:", err);
});

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// 🔥 OPTIONAL DEBUG (you can remove later)
console.log("API KEY:", process.env.OPENAI_API_KEY);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post("/api/ask", async (req, res) => {
  console.log("📩 Request received");

  const userMessage = req.body.message;

  if (!userMessage) {
    return res.status(400).json({ error: "Message is required" });
  }

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
  console.error("❌ FULL ERROR:", error);

  res.status(500).json({
    error: error?.message || JSON.stringify(error)
  });
}

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
