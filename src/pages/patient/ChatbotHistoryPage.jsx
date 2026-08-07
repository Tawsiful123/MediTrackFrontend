import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bot, CalendarDays, ChevronDown, MessageSquare, MessagesSquare } from 'lucide-react';
import PageHeader from '@/components/common/PageHeader';
import EmptyState from '@/components/common/EmptyState';
import ErrorState from '@/components/common/ErrorState';
import Spinner from '@/components/common/Spinner';
import Pagination from '@/components/common/Pagination';
import ChatBubble from '@/components/chatbot/ChatBubble';
import UrgencyBadge from '@/components/chatbot/UrgencyBadge';
import { useChatbotHistory } from '@/hooks/chatbot/useChatbotHistory';
import { formatDateTime } from '@/utils/formatDate';

const getMessages = (conversation) => {
  if (Array.isArray(conversation.messages)) return conversation.messages;
  if (Array.isArray(conversation.chat)) return conversation.chat;
  if (Array.isArray(conversation.items)) return conversation.items;
  const out = [];
  if (conversation.question) out.push({ role: 'user', text: conversation.question });
  if (conversation.answer ?? conversation.response) {
    out.push({ role: 'bot', text: conversation.answer ?? conversation.response });
  }
  return out;
};

const toBubbleMessage = (m) => {
  const role = String(m.role ?? m.from ?? m.sender ?? '').toLowerCase().includes('bot')
    ? 'bot'
    : 'user';
  const text = m.text ?? m.message ?? m.content ?? '';
  return {
    id: m.id ?? `${m.createdAt ?? Date.now()}-${role}-${text.length}`,
    role,
    text,
    suggestions: Array.isArray(m.suggestions) ? m.suggestions : [],
    urgencyLevel: m.urgencyLevel ?? m.urgency ?? m.severity ?? null,
  };
};

export default function ChatbotHistoryPage() {
  const [page, setPage] = useState(1);
  const [expandedId, setExpandedId] = useState(null);

  const { data, isLoading, isError, refetch } = useChatbotHistory({ page, limit: 5 });

  const result = data?.data ?? {};
  const history = result.conversations ?? result.history ?? result.items ?? result.data ?? [];
  const totalPages =
    result.meta?.totalPages ??
    (result.meta?.limit > 0 ? Math.ceil((result.meta?.total ?? 0) / result.meta.limit) : 1);

  const toggle = (id) => setExpandedId((prev) => (prev === id ? null : id));

  return (
    <div>
      <PageHeader
        title="Chat history"
        subtitle="Review your past conversations with the health assistant."
        action={
          <Link to="/patient/chatbot" className="btn-primary">
            <Bot className="h-4 w-4" />
            New chat
          </Link>
        }
      />

      {isLoading ? (
        <div className="card flex items-center justify-center py-16">
          <Spinner label="Loading conversations..." />
        </div>
      ) : isError ? (
        <ErrorState
          title="Could not load chat history"
          message="Something went wrong while fetching your conversations."
          onRetry={refetch}
        />
      ) : history.length === 0 ? (
        <EmptyState
          icon={MessagesSquare}
          title="No conversations yet"
          message="Start a chat and it will be saved here so you can revisit it anytime."
          action={
            <Link to="/patient/chatbot" className="btn-primary">
              <Bot className="h-4 w-4" />
              Start a chat
            </Link>
          }
        />
      ) : (
        <>
          <div className="space-y-4">
            {history.map((conversation) => {
              const id = conversation.id ?? conversation._id ?? conversation.createdAt;
              const messages = getMessages(conversation);
              const firstUser =
                messages.find((m) =>
                  String(m.role ?? m.from ?? m.sender ?? '').toLowerCase().includes('user'),
                ) ?? messages[0];
              const preview = firstUser?.text ?? conversation.snippet ?? 'Conversation';
              const date = conversation.createdAt ?? conversation.date ?? conversation.timestamp;
              const urgency =
                conversation.urgencyLevel ??
                conversation.urgency ??
                messages.find((m) => m.urgencyLevel ?? m.urgency ?? m.severity)?.urgencyLevel ??
                messages.find((m) => m.urgencyLevel ?? m.urgency ?? m.severity)?.urgency ??
                null;
              const isExpanded = expandedId === id;

              return (
                <article key={id} className="card overflow-hidden">
                  <button
                    onClick={() => toggle(id)}
                    className="flex w-full items-center gap-4 p-5 text-left transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    aria-expanded={isExpanded}
                  >
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-md shadow-indigo-200">
                      <MessageSquare className="h-5 w-5" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex flex-wrap items-center gap-2 text-sm font-bold text-slate-900">
                        {date && (
                          <span className="flex items-center gap-1.5">
                            <CalendarDays className="h-3.5 w-3.5 text-slate-400" />
                            {formatDateTime(date)}
                          </span>
                        )}
                        <span className="badge bg-slate-100 text-slate-600">
                          {messages.length} {messages.length === 1 ? 'message' : 'messages'}
                        </span>
                        {urgency && <UrgencyBadge urgencyLevel={urgency} />}
                      </span>
                      <span className="mt-1 block truncate text-sm text-slate-500">{preview}</span>
                    </span>
                    <ChevronDown
                      className={`h-5 w-5 shrink-0 text-slate-400 transition-transform ${
                        isExpanded ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {isExpanded && messages.length > 0 && (
                    <div className="space-y-4 border-t border-slate-100 bg-gradient-to-b from-slate-50 via-white to-indigo-50/40 p-5">
                      {messages.map((m, index) => (
                        <ChatBubble
                          key={m.id ?? `${index}-${m.role ?? index}`}
                          message={toBubbleMessage(m)}
                        />
                      ))}
                    </div>
                  )}
                </article>
              );
            })}
          </div>

          {totalPages > 1 && (
            <div className="mt-8">
              <Pagination meta={result.meta} page={page} totalPages={totalPages} onChange={setPage} />
            </div>
          )}
        </>
      )}
    </div>
  );
}