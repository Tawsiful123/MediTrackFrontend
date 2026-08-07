import { CalendarCheck, Clock } from 'lucide-react';

const slots = ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'];

export default function SlotPicker({ value, onChange, availableSlots }) {
  const list = availableSlots?.length ? availableSlots : slots;

  return (
    <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
      {list.map((s) => {
        const selected = value === s;
        const disabled = false;
        return (
          <button
            type="button"
            key={s}
            disabled={disabled}
            onClick={() => onChange(s)}
            className={`flex items-center justify-center gap-1.5 rounded-xl border px-3 py-2.5 text-sm font-semibold transition ${
              selected
                ? 'border-indigo-600 bg-indigo-600 text-white shadow-md'
                : disabled
                  ? 'cursor-not-allowed border-slate-100 bg-slate-50 text-slate-300'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-indigo-400 hover:bg-indigo-50'
            }`}
          >
            {disabled ? <Clock className="h-3.5 w-3.5" /> : <CalendarCheck className="h-3.5 w-3.5" />}
            {s}
          </button>
        );
      })}
    </div>
  );
}