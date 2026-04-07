# VocalFlow (Web)

A Windows-compatible rebuild of the macOS VocalFlow menu bar app, recreated with React + Vite, TailwindCSS, and modern browser audio APIs. This project is inspired by the original Swift-based app from the VocalFlow repo.

## Features

- Hold-to-record button (mouse down to record, mouse up to stop)
- Optional hotkey behavior using the Space bar
- Microphone recording via MediaRecorder
- Deepgram speech-to-text transcription
- Groq-powered transcript enhancement (grammar + clarity)
- Live API balance/status cards for Deepgram and Groq
- Dark, modern dashboard UI with loading and error states

## Tech Stack

- React (Vite)
- TailwindCSS
- Web MediaRecorder API
- Deepgram STT API
- Groq LLM API

## Setup

1. Install dependencies:

```bash
npm install
```

2. Add your API keys in `src/config/config.js`:

```js
export const DEEPGRAM_API_KEY = "YOUR_KEY";
export const GROQ_API_KEY = "YOUR_KEY";
```

3. Start the dev server:

```bash
npm run dev
```

## API Balance Notes

- Deepgram balance requests require your Project ID. Enter it in the UI to fetch balances.
- Groq does not currently expose a public balance endpoint. The app confirms connectivity by fetching the model list and shows a status note.

## Inspiration

This project is a JavaScript/React rebuild inspired by the original macOS Swift app:
- VocalFlow (macOS menu bar app)

## Project Structure

```
vocalflow/
 ├── src/
 │    ├── components/
 │    │     ├── Recorder.jsx
 │    │     ├── Balance.jsx
 │    ├── services/
 │    │     ├── deepgram.js
 │    │     ├── groq.js
 │    ├── config/
 │    │     ├── config.js
 │    ├── App.jsx
 │    ├── main.jsx
 ├── package.json
 ├── README.md
```
