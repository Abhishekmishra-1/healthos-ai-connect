import { Mic, MicOff, Search as SearchIcon, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useVoiceSearch } from "@/hooks/use-voice-search";

export function VoiceSearchInput({
  value,
  onChange,
  placeholder = "Search or tap the mic to speak",
  ariaLabel = "Search",
  onSubmit,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  ariaLabel?: string;
  onSubmit?: (v: string) => void;
}) {
  const { supported, listening, transcript, error, start, stop } = useVoiceSearch({
    onResult: (t) => onChange(t),
  });

  useEffect(() => {
    if (listening && transcript) onChange(transcript);
  }, [listening, transcript, onChange]);

  return (
    <div className="space-y-2">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit?.(value);
        }}
        className="relative"
        role="search"
      >
        <SearchIcon aria-hidden className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
        <input
          type="search"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          aria-label={ariaLabel}
          className="w-full rounded-full border border-border bg-card py-4 pl-14 pr-16 text-base outline-none focus:ring-2 focus:ring-primary"
        />
        {value && (
          <button type="button" aria-label="Clear" onClick={() => onChange("")}
            className="absolute right-16 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full hover:bg-secondary">
            <X className="h-4 w-4" />
          </button>
        )}
        <button
          type="button"
          onClick={listening ? stop : start}
          aria-label={listening ? "Stop listening" : "Speak to search"}
          aria-pressed={listening}
          className={`absolute right-2 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full text-white shadow-glow transition ${
            listening ? "bg-red-600 animate-pulse" : "gradient-brand"
          }`}
        >
          {listening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
        </button>
      </form>
      {listening && (
        <div className="rounded-2xl border border-primary/30 bg-primary/5 px-4 py-2 text-sm">
          <span className="font-medium">Listening…</span>{" "}
          <span className="text-muted-foreground">{transcript || "say a symptom, doctor or medicine"}</span>
        </div>
      )}
      {error && !listening && (
        <p className="text-xs text-red-600" role="alert">{error}</p>
      )}
      {!supported && !error && (
        <p className="text-xs text-muted-foreground">Voice search works best on Chrome / Android.</p>
      )}
    </div>
  );
}