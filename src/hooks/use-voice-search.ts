import { useCallback, useEffect, useRef, useState } from "react";

type SR = any;

export function useVoiceSearch(opts: { lang?: string; onResult?: (text: string) => void } = {}) {
  const { lang = "en-IN", onResult } = opts;
  const [supported, setSupported] = useState(false);
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [error, setError] = useState<string | null>(null);
  const recRef = useRef<SR | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const Ctor = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (Ctor) setSupported(true);
  }, []);

  const start = useCallback(() => {
    setError(null);
    setTranscript("");
    if (typeof window === "undefined") return;
    const Ctor = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!Ctor) {
      setError("Voice not supported on this browser. Try Chrome.");
      return;
    }
    const r: SR = new Ctor();
    r.lang = lang;
    r.interimResults = true;
    r.continuous = false;
    r.onstart = () => setListening(true);
    r.onend = () => setListening(false);
    r.onerror = (e: any) => { setError(e?.error ?? "Voice error"); setListening(false); };
    r.onresult = (e: any) => {
      let final = "";
      let interim = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const t = e.results[i][0].transcript;
        if (e.results[i].isFinal) final += t; else interim += t;
      }
      const text = (final || interim).trim();
      setTranscript(text);
      if (final && onResult) onResult(final.trim());
    };
    recRef.current = r;
    try { r.start(); } catch (err: any) { setError(err?.message ?? "Could not start voice"); }
  }, [lang, onResult]);

  const stop = useCallback(() => {
    try { recRef.current?.stop(); } catch {}
    setListening(false);
  }, []);

  return { supported, listening, transcript, error, start, stop };
}