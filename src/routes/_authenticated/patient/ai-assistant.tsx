import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useRef, useState, useEffect } from "react";
import { askHealthAssistant } from "@/lib/health-ai.functions";
import { Bot, Send, Loader2, Sparkles, Mic, Image as ImageIcon, ShieldAlert } from "lucide-react";

export const Route = createFileRoute("/_authenticated/patient/ai-assistant")({
  head: () => ({ meta: [{ title: "AI Health Assistant — HealthOS AI" }] }),
  component: AssistantPage,
});

type Msg = { role: "user" | "assistant"; content: string };

const SUGGESTIONS = [
  "Explain my last blood test in simple language",
  "What are the side effects of Metformin?",
  "I have a mild headache and fever, what should I do?",
  "Suggest a diet for pre-diabetes",
  "Can I take Paracetamol with Azithromycin?",
];

export function AssistantPage() {
  const ask = useServerFn(askHealthAssistant);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, loading]);

  async function send(text?: string) {
    const content = (text ?? input).trim();
    if (!content || loading) return;
    const next: Msg[] = [...messages, { role: "user", content }];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      const { reply } = await ask({ data: { messages: next } });
      setMessages([...next, { role: "assistant", content: reply }]);
    } catch (e: any) {
      setMessages([...next, { role: "assistant", content: "Sorry, I couldn't reach the AI service. Please try again." }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex h-[calc(100dvh-12rem)] flex-col gap-4 md:h-[calc(100dvh-10rem)]">
      <div className="flex items-center gap-3">
        <span className="grid h-11 w-11 place-items-center rounded-2xl gradient-brand text-white shadow-glow"><Bot className="h-5 w-5" /></span>
        <div>
          <h1 className="text-xl font-semibold tracking-tight md:text-2xl">AI Health Assistant</h1>
          <p className="text-xs text-muted-foreground">Ask about medicines, symptoms, reports and wellness.</p>
        </div>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto rounded-3xl border border-border/60 bg-card p-4 md:p-6">
        {messages.length === 0 && (
          <div className="grid h-full place-items-center text-center">
            <div className="max-w-md">
              <div className="mx-auto grid h-16 w-16 place-items-center rounded-3xl gradient-brand text-white shadow-glow"><Sparkles className="h-6 w-6" /></div>
              <p className="mt-4 text-lg font-semibold">How can I help you today?</p>
              <p className="mt-1 text-sm text-muted-foreground">Try a suggestion or ask anything about your health.</p>
              <div className="mt-6 grid gap-2 text-left">
                {SUGGESTIONS.map((s) => (
                  <button key={s} onClick={() => send(s)} className="rounded-2xl border border-border bg-background px-4 py-2.5 text-sm hover:bg-secondary">
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[85%] whitespace-pre-wrap rounded-3xl px-4 py-3 text-sm leading-relaxed ${m.role === "user" ? "gradient-brand text-white shadow-glow" : "bg-secondary/60"}`}>
              {m.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="rounded-3xl bg-secondary/60 px-4 py-3 text-sm">
              <Loader2 className="inline h-4 w-4 animate-spin" /> Thinking…
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      <div className="rounded-3xl border border-border/60 bg-card p-3">
        <div className="flex items-end gap-2">
          <button className="grid h-10 w-10 shrink-0 place-items-center rounded-full hover:bg-secondary" aria-label="Voice"><Mic className="h-4 w-4" /></button>
          <button className="grid h-10 w-10 shrink-0 place-items-center rounded-full hover:bg-secondary" aria-label="Upload image"><ImageIcon className="h-4 w-4" /></button>
          <textarea
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
            placeholder="Ask about your health, a medicine, or a report…"
            className="min-h-[40px] max-h-32 flex-1 resize-none bg-transparent px-2 py-2 text-sm outline-none"
          />
          <button onClick={() => send()} disabled={loading || !input.trim()} className="grid h-10 w-10 shrink-0 place-items-center rounded-full gradient-brand text-white shadow-glow disabled:opacity-50">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <p className="flex items-center gap-2 text-[11px] text-muted-foreground">
        <ShieldAlert className="h-3.5 w-3.5" />
        AI provides educational information only. Always consult a licensed doctor for medical advice.
      </p>
    </div>
  );
}