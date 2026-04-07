import { DEEPGRAM_API_KEY } from "../config/config";

const BASE_URL = "https://api.deepgram.com/v1";

const buildHeaders = () => ({
  Authorization: `Token ${DEEPGRAM_API_KEY}`
});

export async function transcribeAudio(audioBlob) {
  if (!DEEPGRAM_API_KEY || DEEPGRAM_API_KEY === "YOUR_KEY") {
    throw new Error("Add your Deepgram API key in config/config.js");
  }

  const response = await fetch(
    `${BASE_URL}/listen?model=nova-2&smart_format=true&punctuate=true`,
    {
      method: "POST",
      headers: {
        ...buildHeaders(),
        "Content-Type": audioBlob.type || "audio/webm"
      },
      body: audioBlob
    }
  );

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Deepgram error: ${text}`);
  }

  const data = await response.json();
  const channel = data?.results?.channels?.[0];
  const alternative = channel?.alternatives?.[0];
  return alternative?.transcript || "";
}

export async function fetchDeepgramBalances(projectId) {
  if (!DEEPGRAM_API_KEY || DEEPGRAM_API_KEY === "YOUR_KEY") {
    throw new Error("Add your Deepgram API key in config/config.js");
  }

  const response = await fetch(`${BASE_URL}/projects/${projectId}/balances`, {
    method: "GET",
    headers: {
      ...buildHeaders(),
      "Content-Type": "application/json"
    }
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Deepgram balance error: ${text}`);
  }

  return response.json();
}
