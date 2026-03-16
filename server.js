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

  // Temporary response (you can connect OpenAI later)
  res.json({
    reply: `NeuroAI received your message: ${message}`
  });
});

// Health check route
app.get("/health", (req, res) => {
  res.json({ status: "OK", service: "NeuroAI Backend" });
});

// Render port
const PORT = process.env.PORT || 3000;

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
