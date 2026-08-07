import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bot, Send, History, Loader2, Info } from 'lucide-react';
import PageHeader from '@/components/common/PageHeader';
import ChatBubble from '@/components/chatbot/ChatBubble';

const initial =
  "Hi there! I'm the MediTrack health assistant. Describe your symptoms and I'll help you understand them and decide next steps. Remember — I'm not a substitute for professional medical advice.";

export default function ChatbotPage() {
  const [messages, setMessages] = useState([
    { id: 0, from: 'bot', text: initial },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async (e) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || loading) return;

    const userMsg = { id: Date.now(), from: 'user', text };
    setMessages((m) => [...m, userMsg]);
    setInput('');
    setLoading(true);

    // TODO: wire to POST /chatbot/ask (useAskChatbot)
    setTimeout(() => {
      setMessages((m) => [
        ...m,
        {
          id: Date.now() + 1,
          from: 'bot',
          text: 'Thanks for sharing. Based on common patterns, this could be a mild condition — but please monitor your symptoms and consult a doctor if they persist. Would you like me to suggest a nearby specialist?',
        },
      ]);
      setLoading(false);
    }, 900);
  };

  return (
    <div>
      <PageHeader
        title="Health Assistant"
        subtitle="AI-powered guidance for your symptoms, available 24/7."
        action={
          <Link to="/patient/chatbot/history" className="btn-outline">
            <History className="h-4 w-4" />
            Chat history
          </Link>
        }
      />

      <div className="card flex h-[65vh] flex-col overflow-hidden">
        <div className="flex items-center gap-3 border-b border-slate-100 px-6 py-4">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-gradient text-white">
            <Bot className="h-5 w-5" />
          </span>
          <div>
            <p className="font-bold text-slate-900">MediTrack Assistant</p>
            <p className="flex items-center gap-1.5 text-xs text-emerald-600">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Online
            </p>
          </div>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto bg-slate-50/60 p-6">
          {messages.map((m) => (
            <ChatBubble key={m.id} role={m.from} text={m.text} />
          ))}
          {loading && (
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <Loader2 className="h-4 w-4 animate-spin text-indigo-500" />
              Assistant is typing...
            </div>
          )}
        </div>

        <form onSubmit={sendMessage} className="flex items-center gap-3 border-t border-slate-100 bg-white p-4">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Describe your symptoms..."
            className="input"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="btn-primary h-11 w-11 shrink-0 rounded-xl p-0"
            aria-label="Send"
          >
            <Send className="h-5 w-5" />
          </button>
        </form>
      </div>

      <div className="mt-4 flex items-start gap-2 rounded-xl border border-amber-100 bg-amber-50 px-4 py-3 text-xs text-amber-800">
        <Info className="mt-0.5 h-4 w-4 shrink-0" />
        <p>
          Responses are informational only and should not replace diagnosis or treatment from a
          licensed healthcare professional. In an emergency, call your local emergency number.
        </p>
      </div>
    </div>
  );
}