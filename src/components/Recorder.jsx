import { useEffect, useRef, useState } from "react";
import { transcribeAudio } from "../services/deepgram";
import { improveText } from "../services/groq";

const initialHint = "Hold to record or press Space";

export default function Recorder({ onTranscript, onProcessed, onStatus }) {
  const [hint, setHint] = useState(initialHint);
  const recorderRef = useRef(null);
  const streamRef = useRef(null);
  const chunksRef = useRef([]);
  const isRecordingRef = useRef(false);

  const updateStatus = (patch) => {
    onStatus((prev) => ({ ...prev, ...patch }));
  };

  const cleanupStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  };

  const startRecording = async () => {
    if (isRecordingRef.current) return;
    try {
      onTranscript("");
      onProcessed("");
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const mediaRecorder = new MediaRecorder(stream);
      recorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        cleanupStream();
        const blob = new Blob(chunksRef.current, {
          type: mediaRecorder.mimeType || "audio/webm"
        });
        chunksRef.current = [];
        isRecordingRef.current = false;
        updateStatus({ recording: false });
        setHint("Transcribing...");

        if (!blob.size) {
          updateStatus({
            transcribing: false,
            improving: false,
            error: "No audio captured. Try again."
          });
          setHint(initialHint);
          return;
        }

        try {
          updateStatus({ transcribing: true, error: null });
          const transcript = await transcribeAudio(blob);
          onTranscript(transcript || "");
          updateStatus({ transcribing: false });

          if (transcript) {
            updateStatus({ improving: true });
            const improved = await improveText(transcript);
            onProcessed(improved || "");
            updateStatus({ improving: false });
            setHint(initialHint);
          } else {
            setHint("No speech detected");
          }
        } catch (error) {
          updateStatus({
            transcribing: false,
            improving: false,
            error: error.message || "Transcription failed."
          });
          setHint(initialHint);
        }
      };

      mediaRecorder.start();
      isRecordingRef.current = true;
      updateStatus({ recording: true, transcribing: false, improving: false, error: null });
      setHint("Recording... release to stop");
    } catch (error) {
      updateStatus({
        recording: false,
        error: error.message || "Microphone permission denied."
      });
      setHint(initialHint);
    }
  };

  const stopRecording = () => {
    if (!recorderRef.current || !isRecordingRef.current) return;
    recorderRef.current.stop();
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.code === "Space") {
        event.preventDefault();
        startRecording();
      }
    };

    const handleKeyUp = (event) => {
      if (event.code === "Space") {
        event.preventDefault();
        stopRecording();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      cleanupStream();
    };
  }, []);

  return (
    <div className="glass rounded-3xl p-6 space-y-6">
      <div className="space-y-2">
        <p className="text-sm uppercase tracking-[0.2em] text-electric/70">Hold-to-Record</p>
        <h2 className="text-2xl font-semibold">Capture your voice instantly</h2>
        <p className="text-sm text-slate-200/70">{hint}</p>
      </div>

      <button
        type="button"
        onPointerDown={startRecording}
        onPointerUp={stopRecording}
        onPointerLeave={stopRecording}
        className="relative flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-br from-electric/90 via-neon/80 to-emerald-200 text-ink font-semibold shadow-glow transition-transform duration-200 hover:scale-105 active:scale-95"
      >
        <span className="text-base">Hold</span>
        <span className="pointer-events-none absolute -inset-1 rounded-full border border-electric/30" />
        <span className="pointer-events-none absolute -inset-1 rounded-full opacity-60 animate-pulseRing" />
      </button>

      <div className="rounded-2xl bg-slate/60 p-4 text-sm text-slate-200/80">
        Tip: You can press and hold the Space bar to mimic the macOS hotkey flow.
      </div>
    </div>
  );
}
