import { Link } from 'react-router-dom';
import { Bot, MessageSquare, Search } from 'lucide-react';
import PageHeader from '@/components/common/PageHeader';
import EmptyState from '@/components/common/EmptyState';

const history = [
  { id: 1, date: 'Aug 05, 2026', preview: 'Asked about persistent headaches and dizziness...', unread: true },
  { id: 2, date: 'Jul 28, 2026', preview: 'Asked about skin rash on forearm...', unread: false },
  { id: 3, date: 'Jul 15, 2026', preview: 'Asked about acid reflux symptoms...', unread: false },
];

export default function ChatbotHistoryPage() {
  return (
    <div>
      <PageHeader
        title="Chat history"
        subtitle="Your past conversations with the health assistant."
        action={
          <Link to="/patient/chatbot" className="btn-primary">
            <Bot className="h-4 w-4" /> New chat
          </Link>
        }
      />

      {history.length === 0 ? (
        <EmptyState
          title="No conversations yet"
          message="Start a chat and it will appear here for reference."
        />
      ) : (
        <div className="space-y-3">
          {history.map((h) => (
            <div key={h.id} className="card flex items-center gap-4 p-5 transition hover:shadow-lg">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
                <MessageSquare className="h-5 w-5" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-slate-900">{h.date}</p>
                <p className="truncate text-sm text-slate-500">{h.preview}</p>
              </div>
              <Search className="h-4 w-4 text-slate-400" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}