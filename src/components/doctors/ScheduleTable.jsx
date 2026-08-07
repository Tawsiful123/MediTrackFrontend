import { CalendarRange, Clock, Coffee } from 'lucide-react';
import { useDoctorSchedule } from '@/hooks/doctors/useDoctorSchedule';
import Spinner from '@/components/common/Spinner';
import EmptyState from '@/components/common/EmptyState';
import ErrorState from '@/components/common/ErrorState';
import { WEEKDAYS } from '@/utils/constants';

function formatTime(value) {
  if (!value) return null;
  if (value.includes('T')) {
    const d = new Date(value);
    if (!Number.isNaN(d.getTime())) {
      return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    }
  }
  const [h, m] = value.split(':').map(Number);
  if (Number.isNaN(h)) return value;
  const hour = h % 12 || 12;
  const minutes = m ? `:${String(m).padStart(2, '0')}` : '';
  return `${hour}${minutes} ${h < 12 ? 'AM' : 'PM'}`;
}

function toEntries(raw) {
  const data = raw?.data ?? raw ?? {};
  if (Array.isArray(data)) return data;
  return data.schedules ?? data.slots ?? data.weekly ?? data.days ?? [];
}

export default function ScheduleTable({ doctorId }) {
  const { data, isLoading, isError, refetch } = useDoctorSchedule(doctorId);
  const entries = toEntries(data);

  if (isLoading) {
    return (
      <div className="flex justify-center py-10">
        <Spinner label="Loading schedule..." />
      </div>
    );
  }

  if (isError) {
    return (
      <ErrorState
        title="Could not load the schedule"
        message="The schedule for this doctor is temporarily unavailable."
        onRetry={refetch}
      />
    );
  }

  if (entries.length === 0) {
    return (
      <EmptyState
        icon={CalendarRange}
        title="No schedule published yet"
        message="This doctor hasn't published a weekly schedule yet. Check back soon."
      />
    );
  }

  const allStrings = entries.every((e) => typeof e === 'string');

  return (
    <div className="card overflow-hidden">
      <div className="flex items-center gap-3 border-b border-slate-100 bg-slate-50/60 px-5 py-4">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 text-white shadow-md">
          <CalendarRange className="h-5 w-5" />
        </span>
        <div>
          <h3 className="font-bold text-slate-900">Weekly schedule</h3>
          <p className="text-xs text-slate-500">Consultation hours across the week</p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-100 text-xs font-semibold uppercase tracking-wide text-slate-400">
              <th className="px-5 py-3">Day</th>
              <th className="px-5 py-3">Opening hours</th>
              <th className="px-5 py-3">Break</th>
              <th className="px-5 py-3 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {allStrings
              ? entries.map((time) => (
                  <tr key={time}>
                    <td className="px-5 py-3.5 font-semibold text-slate-700">Available daily</td>
                    <td className="px-5 py-3.5">
                      <span className="inline-flex items-center gap-1.5 font-medium text-slate-600">
                        <Clock className="h-4 w-4 text-indigo-500" />
                        {time}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-slate-400">—</td>
                    <td className="px-5 py-3.5 text-right">
                      <span className="badge bg-green-100 text-green-800">Available</span>
                    </td>
                  </tr>
                ))
              : entries.map((entry, i) => {
                  const day = entry.day ?? entry.dayOfWeek ?? (entry.date ? WEEKDAYS[new Date(entry.date).getDay()] : null);
                  const start = formatTime(entry.startTime ?? entry.start ?? entry.openTime);
                  const end = formatTime(entry.endTime ?? entry.end ?? entry.closeTime);
                  const breakStart = formatTime(entry.breakStartTime ?? entry.breakStart);
                  const breakEnd = formatTime(entry.breakEndTime ?? entry.breakEnd);
                  const available = entry.isAvailable ?? entry.active ?? !entry.isClosed;
                  const today = new Date().getDay();

                  return (
                    <tr key={entry.id ?? day ?? i} className={day && WEEKDAYS.indexOf(day) === today ? 'bg-indigo-50/50' : ''}>
                      <td className="px-5 py-3.5">
                        <span className="font-semibold capitalize text-slate-700">
                          {(day ?? 'Day').toLowerCase()}
                        </span>
                        {day && WEEKDAYS.indexOf(day) === today && (
                          <span className="badge ml-2 bg-indigo-100 text-indigo-700">Today</span>
                        )}
                      </td>
                      <td className="px-5 py-3.5">
                        {start || end ? (
                          <span className="inline-flex items-center gap-1.5 font-medium text-slate-600">
                            <Clock className="h-4 w-4 text-indigo-500" />
                            {start ?? '—'} – {end ?? '—'}
                          </span>
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
                      </td>
                      <td className="px-5 py-3.5 text-slate-500">
                        {breakStart || breakEnd ? (
                          <span className="inline-flex items-center gap-1.5">
                            <Coffee className="h-4 w-4 text-amber-500" />
                            {breakStart ?? '—'} – {breakEnd ?? '—'}
                          </span>
                        ) : (
                          <span className="text-slate-300">—</span>
                        )}
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        {available === false ? (
                          <span className="badge bg-slate-100 text-slate-600">Closed</span>
                        ) : (
                          <span className="badge bg-green-100 text-green-800">Available</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
