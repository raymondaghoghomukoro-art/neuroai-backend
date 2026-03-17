export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { message, mode } = req.body;

  let systemPrompt = "You are a helpful AI assistant.";

  if (mode === "kids") {
    systemPrompt = "You are a friendly AI teacher that tells fun and educational stories for children.";
  }

  if (mode === "business") {
    systemPrompt = "You are a smart business coach that helps people make money, start businesses, and grow online.";
  }

  try {

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: message }
        ]
      })
    });

    const data = await response.json();

    // Debugging if OpenAI returns an error
    if (!data.choices) {
      console.error("OpenAI error:", data);
      return res.status(500).json({ error: "OpenAI API error" });
    }

    const reply = data.choices[0].message.content;

    res.status(200).json({ reply });

  } catch (error) {

    console.error("Server error:", error);

    res.status(500).json({ error: "AI request failed" });

  }

}
