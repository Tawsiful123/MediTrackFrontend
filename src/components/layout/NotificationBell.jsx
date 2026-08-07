import { useState } from 'react';
import { Bell } from 'lucide-react';
import { useNotifications } from '@/hooks/notifications/useNotifications';

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const { data } = useNotifications({ page: 1, limit: 10 });
  const notifications = data?.data ?? [];
  const unread = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="relative rounded-xl p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
        aria-label="Notifications"
      >
        <Bell className="h-5 w-5" />
        {unread > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white ring-2 ring-white">
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 z-50 mt-2 w-80 card p-2 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-3 py-2">
              <span className="text-sm font-bold text-slate-800">Notifications</span>
              {unread > 0 && (
                <button className="text-xs font-semibold text-indigo-600 hover:text-indigo-700">
                  Mark all read
                </button>
              )}
            </div>
            <div className="max-h-80 overflow-y-auto">
              {notifications.length === 0 ? (
                <p className="px-3 py-8 text-center text-sm text-slate-400">You're all caught up.</p>
              ) : (
                notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`rounded-xl px-3 py-2.5 text-sm ${
                      n.isRead ? 'text-slate-500' : 'bg-indigo-50 font-medium text-slate-800'
                    }`}
                  >
                    <p>{n.message}</p>
                    <p className="mt-0.5 text-xs text-slate-400">{n.createdAt}</p>
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