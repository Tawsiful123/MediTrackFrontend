import { Inbox } from 'lucide-react';

export default function EmptyState({ title = 'Nothing here yet', message, action, icon: Icon = Inbox }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-100 to-purple-100 text-indigo-500 shadow-inner">
        <Icon className="h-8 w-8" />
      </div>
      <h3 className="text-base font-bold text-slate-800">{title}</h3>
      {message && <p className="mt-1 max-w-sm text-sm text-slate-500">{message}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
