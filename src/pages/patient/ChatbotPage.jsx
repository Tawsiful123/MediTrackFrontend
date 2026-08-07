import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { Bot, History, Info, ShieldCheck, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import ChatWindow from '@/components/chatbot/ChatWindow';
import { useAskChatbot } from '@/hooks/chatbot/useAskChatbot';
import { getErrorStatus } from '@/utils/getErrorMessage';

const WELCOME =
  "Hi, I'm the MediTrack health assistant. Describe how you're feeling and I'll help you\nunderstand your symptoms, suggest next steps and give you an idea of how urgent it might be.";

const QUICK_PROMPTS = [
  'Persistent headache and dizziness',
  "Sore throat that won't go away",
  'Should I worry about my cough?',
];

export default function ChatbotPage() {
  const queryClient = useQueryClient();
  const { mutateAsync } = useAskChatbot();
  const [messages, setMessages] = useState([{ id: 0, role: 'bot', text: WELCOME }]);
  const [loading, setLoading] = useState(false);
  const idRef = useRef(1);

  const handleAsk = async (text, pendingId) => {
    const id = pendingId ?? idRef.current++;
    if (!pendingId) {
      setMessages((prev) => [...prev, { id, role: 'user', text }]);
    }
    setLoading(true);

    try {
      const res = await mutateAsync(text);
      const parsed = res?.data ?? res ?? {};
      const reply =
        parsed.message ??
        parsed.response ??
        parsed.answer ??
        parsed.text ??
        "Got it — I couldn't quite parse that, but tell me a bit more and I'll take another look.";
      const suggestions = Array.isArray(parsed.suggestions)
        ? parsed.suggestions
        : Array.isArray(parsed.recommendations)
          ? parsed.recommendations
          : [];
      const urgencyLevel = parsed.urgencyLevel ?? parsed.urgency ?? parsed.severity ?? null;
      const disclaimer =
        typeof parsed.disclaimer === 'string' && parsed.disclaimer ? parsed.disclaimer : null;

      setMessages((prev) => [
        ...prev,
        {
          id: idRef.current++,
          role: 'bot',
          text: reply,
          suggestions,
          urgencyLevel,
          disclaimer,
        },
      ]);
      queryClient.invalidateQueries({ queryKey: ['chatbot', 'history'] });
    } catch (error) {
      setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, error: true } : m)));
      if (getErrorStatus(error) === 500) {
        toast.error('The assistant hit a snag. Your message is saved — tap Retry to resend it.');
      } else {
        toast.error('Could not reach the assistant. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = (text) => {
    handleAsk(text);
  };

  const retryMessage = (id) => {
    const failed = messages.find((m) => m.id === id);
    if (!failed) return;
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, error: false } : m)));
    handleAsk(failed.text, id);
  };

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 via-purple-600 to-teal-500 p-6 text-white shadow-lg sm:p-8">
        <div className="pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-20 right-24 h-56 w-56 rounded-full bg-teal-300/20 blur-3xl" />
        <div className="pointer-events-none absolute left-1/3 top-0 h-32 w-32 rounded-full bg-indigo-300/20 blur-2xl" />
        <div className="relative">
          <span className="badge bg-white/20 text-white">
            <Sparkles className="mr-1 h-3.5 w-3.5" />
            AI health guidance
          </span>
          <h1 className="mt-3 text-2xl font-extrabold sm:text-3xl">Health Assistant</h1>
          <p className="mt-2 max-w-xl text-sm text-indigo-100">
            Chat about your symptoms any time, day or night. Get a clearer picture of what might be
            going on and what to do next.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/patient/chatbot/history"
              className="btn border border-white/30 bg-white/10 text-white backdrop-blur hover:bg-white/20"
            >
              <History className="h-4 w-4" />
              Chat history
            </Link>
          </div>
        </div>
      </section>

      <div className="card flex h-[70vh] flex-col overflow-hidden">
        <div className="flex items-center gap-3 border-b border-slate-100 bg-white px-5 py-4 sm:px-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-gradient text-white shadow-md shadow-indigo-200">
            <Bot className="h-5 w-5" />
          </div>
          <div>
            <p className="font-bold text-slate-900">MediTrack Assistant</p>
            <p className="flex items-center gap-1.5 text-xs text-slate-500">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Online · replies instantly
            </p>
          </div>
        </div>

        <ChatWindow
          messages={messages}
          loading={loading}
          onSend={sendMessage}
          onRetry={retryMessage}
          placeholder="Describe your symptoms..."
        />
      </div>

      {messages.length === 1 && !loading && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-slate-500">Try asking:</span>
          {QUICK_PROMPTS.map((p) => (
            <button
              key={p}
              onClick={() => sendMessage(p)}
              className="btn-outline px-3 py-1.5 text-xs"
            >
              {p}
            </button>
          ))}
        </div>
      )}

      <div className="mt-4 flex items-start gap-2 rounded-xl border border-amber-100 bg-amber-50 px-4 py-3 text-xs text-amber-800">
        <Info className="mt-0.5 h-4 w-4 shrink-0" />
        <p>
          Responses are informational only and should not replace diagnosis or treatment from a
          licensed healthcare professional. In an emergency, call your local emergency number.
        </p>
      </div>

      <div className="flex items-center gap-2 rounded-xl border border-indigo-100 bg-indigo-50/60 px-4 py-3 text-xs text-slate-500">
        <ShieldCheck className="h-4 w-4 shrink-0 text-indigo-500" />
        Your conversations are private and stored securely so you can review them later.
      </div>
    </div>
  );
}