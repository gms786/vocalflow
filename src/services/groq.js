import { GROQ_API_KEY } from "../config/config";

const BASE_URL = "https://api.groq.com/openai/v1";

const buildHeaders = () => ({
  Authorization: `Bearer ${GROQ_API_KEY}`,
  "Content-Type": "application/json"
});

export async function improveText(transcript) {
  if (!GROQ_API_KEY || GROQ_API_KEY === "YOUR_KEY") {
    throw new Error("Add your Groq API key in config/config.js");
  }

  const response = await fetch(`${BASE_URL}/chat/completions`, {
    method: "POST",
    headers: buildHeaders(),
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      temperature: 0.2,
      messages: [
        {
          role: "system",
          content:
            "You polish spoken transcripts. Fix grammar, remove filler words, keep meaning, and return a clean paragraph only."
        },
        {
          role: "user",
          content: transcript
        }
      ]
    })
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Groq error: ${text}`);
  }

  const data = await response.json();
  return data?.choices?.[0]?.message?.content?.trim() || "";
}

export async function fetchGroqBalance() {
  if (!GROQ_API_KEY || GROQ_API_KEY === "YOUR_KEY") {
    throw new Error("Add your Groq API key in config/config.js");
  }

  const response = await fetch(`${BASE_URL}/models`, {
    method: "GET",
    headers: buildHeaders()
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Groq status error: ${text}`);
  }

  return {
    connected: true,
    note: "Groq does not currently expose a public balance endpoint. This confirms the key is valid."
  };
}
