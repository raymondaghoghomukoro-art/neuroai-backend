// ✅ ERROR HANDLING
process.on("uncaughtException", (err) => {
  console.error("UNCAUGHT EXCEPTION:", err);
});

process.on("unhandledRejection", (err) => {
  console.error("UNHANDLED REJECTION:", err);
});

// ✅ IMPORTS
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// ✅ OPENAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// 🧠 MEMORY STORE (simple in-memory storage)
const conversations = {}; // { sessionId: [messages] }

// ✅ MAIN ROUTE
app.post("/api/ask", async (req, res) => {
  const { message, mode, sessionId } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  // 🧠 CREATE SESSION IF NOT EXISTS
  if (!conversations[sessionId]) {
    conversations[sessionId] = [];
  }

  try {
    // 🎭 PERSONALITY SYSTEM
    let systemPrompt = "You are NeuroAI.";

    if (mode === "neuro") {
      systemPrompt = "You are NeuroAI, a highly intelligent, futuristic AI with deep reasoning, clarity, and powerful insights. Speak confidently and intelligently.";
    }

    if (mode === "science") {
      systemPrompt = "You are a scientific AI. Explain things clearly, logically, and based on facts. Make complex ideas simple.";
    }

    if (mode === "business") {
      systemPrompt = "You are a business expert AI. Focus on money, growth, strategy, and actionable advice.";
    }

    if (mode === "general") {
      systemPrompt = "You are a friendly and helpful AI assistant.";
    }

    // 🧠 BUILD MESSAGE HISTORY
    const history = conversations[sessionId];

    const messages = [
      { role: "system", content: systemPrompt },
      ...history,
      { role: "user", content: message },
    ];

    // 🤖 CALL OPENAI
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages,
    });

    const reply = completion.choices[0].message.content;

    // 💾 SAVE MEMORY
    history.push({ role: "user", content: message });
    history.push({ role: "assistant", content: reply });

    // 🔒 LIMIT MEMORY (last 10 messages)
    if (history.length > 10) {
      history.splice(0, history.length - 10);
    }

    res.json({ reply });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: error.message || "Something went wrong",
    });
  }
});

// ✅ START SERVER
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
