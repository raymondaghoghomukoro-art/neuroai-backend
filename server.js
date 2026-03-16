import express from "express";
import cors from "cors";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Home route
app.get("/", (req, res) => {
  res.send("NeuroAI backend running 🚀");
});

// Example AI route
app.post("/api/ask", (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  res.json({
    reply: `NeuroAI received your message: ${message}`
  });
});

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "OK", service: "NeuroAI Backend" });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
