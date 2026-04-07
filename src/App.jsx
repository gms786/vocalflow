import { useState } from "react";
import Recorder from "./components/Recorder";
import Balance from "./components/Balance";

const emptyStatus = {
  recording: false,
  transcribing: false,
  improving: false,
  error: null
};

export default function App() {
  const [transcript, setTranscript] = useState("");
  const [processed, setProcessed] = useState("");
  const [status, setStatus] = useState(emptyStatus);

  return (
    <div className="min-h-screen px-6 py-10">
      <div className="mx-auto max-w-6xl space-y-10">
        <header className="flex flex-col gap-4 rounded-3xl border border-electric/20 bg-slate/70 p-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-electric/70">VocalFlow</p>
              <h1 className="text-3xl font-semibold">Windows Voice Command Studio</h1>
            </div>
            <div className="hidden md:block text-right text-sm text-slate-200/70">
              <p>Hold-to-record flow · Deepgram + Groq</p>
              <p className="text-electric/80">Inspired by the macOS menu bar app</p>
            </div>
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            <div className="rounded-2xl bg-ink/70 px-4 py-3 text-sm">
              <span className="text-electric/80">Status:</span>{" "}
              {status.recording ? "Recording" : status.transcribing ? "Transcribing" : status.improving ? "Enhancing" : "Idle"}
            </div>
            <div className="rounded-2xl bg-ink/70 px-4 py-3 text-sm">
              <span className="text-electric/80">Mic:</span> Web Audio (MediaRecorder)
            </div>
            <div className="rounded-2xl bg-ink/70 px-4 py-3 text-sm">
              <span className="text-electric/80">Mode:</span> Hold + release
            </div>
          </div>
        </header>

        {status.error && (
          <div className="rounded-2xl border border-ember/40 bg-ember/10 px-6 py-4 text-sm text-ember">
            {status.error}
          </div>
        )}

        <div className="grid gap-8 lg:grid-cols-[1.05fr_1.4fr]">
          <div className="space-y-8">
            <Recorder
              onTranscript={setTranscript}
              onProcessed={setProcessed}
              onStatus={setStatus}
            />
            <Balance />
          </div>

          <div className="space-y-8">
            <section className="glass rounded-3xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.2em] text-electric/70">Transcript</p>
                  <h3 className="text-xl font-semibold">Raw speech output</h3>
                </div>
                {status.transcribing && (
                  <span className="text-xs uppercase tracking-[0.2em] text-neon/80">Listening...</span>
                )}
              </div>
              <div className="scroll-sleek max-h-64 overflow-y-auto rounded-2xl bg-ink/70 p-4 text-sm text-slate-200/80">
                {transcript || "Your transcript will appear here after you record."}
              </div>
            </section>

            <section className="glass rounded-3xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.2em] text-electric/70">Enhanced</p>
                  <h3 className="text-xl font-semibold">Groq-optimized output</h3>
                </div>
                {status.improving && (
                  <span className="text-xs uppercase tracking-[0.2em] text-neon/80">Polishing...</span>
                )}
              </div>
              <div className="scroll-sleek max-h-64 overflow-y-auto rounded-2xl bg-ink/70 p-4 text-sm text-slate-200/80">
                {processed || "Processed text will appear here after Groq improves it."}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
