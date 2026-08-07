import { SlidersHorizontal } from 'lucide-react';
import Select from '@/components/common/Select';

const specializations = [
  'Cardiology', 'Dermatology', 'Neurology', 'Orthopedics',
  'Pediatrics', 'General Medicine', 'Gynecology', 'Ophthalmology',
];

export default function DoctorFilterBar({ filters, onChange }) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex items-center gap-2 text-slate-500">
        <SlidersHorizontal className="h-4 w-4" />
        <span className="text-sm font-medium">Filters</span>
      </div>
      <div className="w-48">
        <Select
          placeholder="All specializations"
          value={filters.specialization}
          onChange={(e) => onChange({ specialization: e.target.value })}
          options={specializations}
        />
      </div>
      <div className="w-40">
        <Select
          placeholder="Sort by"
          value={filters.sortBy}
          onChange={(e) => onChange({ sortBy: e.target.value })}
          options={[
            { value: 'rating', label: 'Top rated' },
            { value: 'fee_asc', label: 'Lowest fee' },
            { value: 'experience', label: 'Most experienced' },
          ]}
        />
      </div>
    </div>
  );
}