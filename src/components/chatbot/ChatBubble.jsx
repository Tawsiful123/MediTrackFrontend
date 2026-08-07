import { Bot, User } from 'lucide-react';

export default function ChatBubble({ role, text }) {
  const isBot = role === 'bot';
  return (
    <div className={`flex items-start gap-3 ${isBot ? '' : 'flex-row-reverse'}`}>
      <span
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
          isBot ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white' : 'bg-slate-200 text-slate-600'
        }`}
      >
        {isBot ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
      </span>
      <div
        className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${
          isBot ? 'rounded-tl-sm bg-white text-slate-700' : 'rounded-tr-sm bg-brand-gradient text-white'
        }`}
      >
        {text}
      </div>
    </div>
  );
}