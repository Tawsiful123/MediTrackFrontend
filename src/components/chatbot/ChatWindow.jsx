import { useEffect, useRef, useState } from 'react';
import { Bot, Loader2, Send } from 'lucide-react';
import ChatBubble from '@/components/chatbot/ChatBubble';

/**
 * Chat message list + composer.
 *
 * @param {Array<object>} messages
 * @param {boolean} loading            true while the assistant is replying
 * @param {(text: string) => void} onSend
 * @param {(id: number|string) => void} onRetry
 */
export default function ChatWindow({
  messages = [],
  loading = false,
  onSend,
  onRetry,
  placeholder = 'Describe your symptoms...',
}) {
  const [input, setInput] = useState('');
  const scrollRef = useRef(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
  }, [messages, loading]);

  const submit = (e) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || loading) return;
    setInput('');
    onSend(text);
  };

  return (
    <>
      <div
        ref={scrollRef}
        aria-live="polite"
        className="flex-1 space-y-4 overflow-y-auto bg-gradient-to-b from-slate-50 via-white to-indigo-50/40 p-5 sm:p-6"
      >
        {messages.map((m) => (
          <ChatBubble key={m.id} message={m} onRetry={onRetry} />
        ))}
        {loading && (
          <div className="flex w-full items-start gap-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-sm">
              <Bot className="h-4 w-4" />
            </span>
            <div className="flex items-center gap-2 rounded-2xl rounded-tl-sm border border-slate-100 bg-white px-4 py-3 text-sm text-slate-400 shadow-sm">
              <Loader2 className="h-4 w-4 animate-spin text-indigo-500" />
              Assistant is analysing your symptoms...
            </div>
          </div>
        )}
      </div>

      <form
        onSubmit={submit}
        className="flex items-center gap-3 border-t border-slate-100 bg-white p-4"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={placeholder}
          aria-label="Message the assistant"
          className="input"
        />
        <button
          type="submit"
          disabled={!input.trim() || loading}
          className="btn-primary h-11 w-11 shrink-0 rounded-xl p-0"
          aria-label="Send message"
        >
          <Send className="h-5 w-5" />
        </button>
      </form>
    </>
  );
}