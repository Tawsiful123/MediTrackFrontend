import { ArrowRight, Bot, RotateCcw, User } from 'lucide-react';
import UrgencyBadge from '@/components/chatbot/UrgencyBadge';

/**
 * A single chat message bubble.
 *
 * @param {object} message
 * @param {'user'|'bot'} message.role
 * @param {string} message.text
 * @param {string[]} [message.suggestions]   suggested next steps from the assistant
 * @param {string} [message.urgencyLevel]    LOW / MILD / MODERATE / HIGH / SEVERE / EMERGENCY
 * @param {string} [message.disclaimer]      optional clarifying note
 * @param {boolean} [message.error]          true when the request failed (retryable)
 */
export default function ChatBubble({ message, onRetry }) {
  const isBot = message.role === 'bot';
  const { text, suggestions = [], urgencyLevel, disclaimer, error } = message;

  return (
    <div className={`flex w-full items-start gap-3 ${isBot ? '' : 'flex-row-reverse'}`}>
      <span
        aria-hidden="true"
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full shadow-sm ${
          isBot
            ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white'
            : 'bg-slate-200 text-slate-600'
        }`}
      >
        {isBot ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
      </span>

      <div className="flex max-w-[78%] flex-col gap-2 sm:max-w-[75%]">
        <div
          className={`rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${
            isBot
              ? `rounded-tl-sm border bg-white text-slate-700 ${
                  error ? 'border-rose-200' : 'border-slate-100'
                }`
              : error
                ? 'rounded-tr-sm border border-rose-200 bg-rose-600 text-white'
                : 'rounded-tr-sm bg-brand-gradient text-white'
          }`}
        >
          {error ? (
            <p className="whitespace-pre-line opacity-90">{text}</p>
          ) : (
            <>
              <p className="whitespace-pre-line">{text}</p>

              {suggestions.length > 0 && (
                <ul className="mt-3 space-y-2">
                  {suggestions.map((s, i) => {
                    const suggestion = typeof s === 'string' ? s : s?.text ?? s?.label ?? '';
                    return suggestion ? (
                      <li
                        key={`${i}-${suggestion}`}
                        className="flex items-start gap-2 rounded-xl border border-indigo-100 bg-indigo-50/60 px-3 py-2 text-xs font-medium text-indigo-800"
                      >
                        <ArrowRight className="mt-0.5 h-3.5 w-3.5 shrink-0 text-indigo-500" />
                        <span className="whitespace-pre-line">{suggestion}</span>
                      </li>
                    ) : null;
                  })}
                </ul>
              )}
            </>
          )}
        </div>

        {urgencyLevel && !error && <UrgencyBadge urgencyLevel={urgencyLevel} className="self-start" />}

        {!isBot && error && onRetry && (
          <button
            onClick={() => onRetry(message.id)}
            className="inline-flex items-center gap-1.5 self-end rounded-lg border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-700 transition hover:bg-rose-100"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Retry
          </button>
        )}

        {isBot && disclaimer && (
          <p className="px-1 text-[11px] leading-snug text-slate-400">{disclaimer}</p>
        )}
      </div>
    </div>
  );
}