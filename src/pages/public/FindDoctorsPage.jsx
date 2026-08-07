import { useState } from 'react';
import { Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import DoctorCard from '@/components/doctors/DoctorCard';
import DoctorFilterBar from '@/components/doctors/DoctorFilterBar';
import Spinner from '@/components/common/Spinner';
import Pagination from '@/components/common/Pagination';

const MOCK_DOCTORS = Array.from({ length: 6 }, (_, i) => ({
  id: `d${i + 1}`,
  fullName: ['Dr. Ayesha Siddiqui', 'Dr. John Carter', 'Dr. Maria Lopez', 'Dr. Ethan Brooks', 'Dr. Priya Sharma', 'Dr. Lucas Meyer'][i],
  specialization: { name: ['Cardiology', 'Dermatology', 'Neurology', 'Orthopedics', 'Pediatrics', 'General Medicine'][i] },
  hospitalName: ['City General', 'Sunrise Clinic', 'Central Care', 'River Valley', 'Springfield Health', 'Metro Hospital'][i],
  clinicAddress: `123 ${['Main', 'Oak', 'Elm', 'Pine', 'Maple', 'Cedar'][i]} Street, Springfield`,
  consultationFee: 40 + i * 15,
  averageRating: 4.2 + (i % 4) * 0.2,
  experienceYears: 5 + i * 3,
  verificationStatus: 'Approved',
}));

export default function FindDoctorsPage() {
  const [filters, setFilters] = useState({ search: '', specialization: '', sortBy: 'rating' });
  const [page, setPage] = useState(1);
  const isLoading = false;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="max-w-2xl">
        <span className="badge bg-indigo-100 text-indigo-700">Find your doctor</span>
        <h1 className="mt-3 text-3xl font-extrabold text-slate-900 sm:text-4xl">Browse our doctors</h1>
        <p className="mt-3 text-slate-500">
          Search by name, specialization, or location — then book directly from their profile.
        </p>
      </div>

      <div className="card mt-8 flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={filters.search}
            onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))}
            placeholder="Search by doctor or specialization..."
            className="input pl-9"
          />
        </div>
        <DoctorFilterBar
          filters={filters}
          onChange={(next) => setFilters((f) => ({ ...f, ...next }))}
        />
      </div>

      {isLoading ? (
        <div className="mt-12">
          <Spinner fullScreen label="Loading doctors..." />
        </div>
      ) : (
        <>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {MOCK_DOCTORS.map((doctor) => (
              <DoctorCard key={doctor.id} doctor={doctor} />
            ))}
          </div>
          <div className="mt-10">
            <Pagination page={page} totalPages={5} onChange={setPage} />
          </div>
        </>
      )}

      <div className="mt-16 rounded-3xl bg-gradient-to-r from-indigo-600 via-purple-600 to-teal-500 p-10 text-center shadow-xl">
        <h2 className="text-2xl font-extrabold text-white">Can't find who you're looking for?</h2>
        <p className="mx-auto mt-2 max-w-lg text-indigo-100">
          Join MediTrack and get personalized doctor recommendations near you.
        </p>
        <Link to="/register/patient" className="btn-primary mt-6 bg-white text-indigo-700 hover:bg-indigo-50">
          Create free account
        </Link>
      </div>
    </div>
  );
}