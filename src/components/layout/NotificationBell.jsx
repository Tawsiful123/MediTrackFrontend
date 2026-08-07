import { useState } from 'react';
import { Bell, Trash2, CheckCheck } from 'lucide-react';
import { useNotifications } from '@/hooks/notifications/useNotifications';
import { useMarkAsRead } from '@/hooks/notifications/useMarkAsRead';
import { useMarkAllAsRead } from '@/hooks/notifications/useMarkAllAsRead';
import { useDeleteNotification } from '@/hooks/notifications/useDeleteNotification';

function timeAgo(dateStr) {
  if (!dateStr) return '';
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return days < 7 ? `${days}d ago` : new Date(dateStr).toLocaleDateString();
}

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const { data, isLoading } = useNotifications({ page: 1, limit: 10 });
  const { mutate: markAsRead, isPending: reading } = useMarkAsRead();
  const { mutate: markAllAsRead, isPending: markingAll } = useMarkAllAsRead();
  const { mutate: deleteNotification } = useDeleteNotification();

  const notifications = data?.data?.notifications ?? data?.data?.items ?? data?.data ?? [];
  const unread = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="relative rounded-xl p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        aria-label={`Notifications${unread ? `, ${unread} unread` : ''}`}
        aria-expanded={open}
      >
        <Bell className="h-5 w-5" />
        {unread > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-gradient-to-br from-rose-500 to-rose-600 px-1 text-[10px] font-bold text-white ring-2 ring-white">
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="animate-zoom-in absolute right-0 z-50 mt-2 w-80 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white px-4 py-3">
              <span className="text-sm font-bold text-slate-800">Notifications</span>
              {unread > 0 && (
                <button
                  className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-semibold text-indigo-600 transition hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
                  disabled={markingAll}
                  onClick={() => markAllAsRead()}
                >
                  <CheckCheck className="h-3.5 w-3.5" />
                  {markingAll ? 'Marking...' : 'Mark all read'}
                </button>
              )}
            </div>
            <div className="max-h-80 overflow-y-auto">
              {isLoading ? (
                <div className="space-y-2 px-4 py-6">
                  {[0, 1, 2].map((i) => (
                    <div key={i} className="h-12 animate-pulse rounded-xl bg-slate-100" />
                  ))}
                </div>
              ) : notifications.length === 0 ? (
                <div className="flex flex-col items-center gap-2 px-4 py-10 text-center">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 text-indigo-500">
                    <Bell className="h-6 w-6" />
                  </span>
                  <p className="text-sm font-semibold text-slate-600">You're all caught up</p>
                  <p className="text-xs text-slate-400">New updates will appear here.</p>
                </div>
              ) : (
                notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`group flex items-start gap-2.5 px-4 py-3 transition ${
                      n.isRead ? '' : 'bg-indigo-50/60'
                    } ${n.isRead ? '' : 'hover:bg-indigo-50'}`}
                  >
                    <button
                      onClick={() => !n.isRead && !reading && markAsRead(n.id)}
                      className="min-w-0 flex-1 text-left focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-lg"
                    >
                      <p className={`text-sm leading-snug ${n.isRead ? 'text-slate-500' : 'font-medium text-slate-800'}`}>
                        {n.message}
                      </p>
                      <p className="mt-0.5 text-xs text-slate-400">{timeAgo(n.createdAt)}</p>
                    </button>
                    <button
                      onClick={() => deleteNotification(n.id)}
                      className="shrink-0 rounded-md p-1 text-slate-300 opacity-0 transition hover:bg-rose-50 hover:text-rose-500 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-rose-400 group-hover:opacity-100"
                      aria-label="Delete notification"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
