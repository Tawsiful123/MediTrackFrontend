import { Link } from 'react-router-dom';
import { HeartPulse } from 'lucide-react';

const columns = [
  {
    title: 'Platform',
    links: [
      { label: 'Find Doctors', to: '/doctors' },
      { label: 'Book Appointment', to: '/patient/appointments' },
      { label: 'Nearby Clinics', to: '/patient/doctors/nearby' },
    ],
  },
  {
    title: 'Account',
    links: [
      { label: 'Sign in', to: '/login' },
      { label: 'Patient Registration', to: '/register/patient' },
      { label: 'Doctor Registration', to: '/register/doctor' },
    ],
  },
  {
    title: 'Support',
    links: [
      { label: 'Forgot Password', to: '/forgot-password' },
      { label: 'Contact Us', to: '/' },
      { label: 'Help Center', to: '/' },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-4">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-gradient text-white">
                <HeartPulse className="h-5 w-5" />
              </span>
              <span className="text-lg font-extrabold tracking-tight">
                Medi<span className="bg-brand-gradient bg-clip-text text-transparent">Track</span>
              </span>
            </div>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-slate-500">
              Your unified healthcare platform — find the right doctor, book instantly, and track
              every visit from one place.
            </p>
          </div>
          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="text-sm font-bold uppercase tracking-wide text-slate-900">{col.title}</h4>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link to={l.to} className="text-sm text-slate-500 transition hover:text-indigo-600">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-slate-200 pt-6 sm:flex-row">
          <p className="text-xs text-slate-400">
            &copy; {new Date().getFullYear()} MediTrack. All rights reserved.
          </p>
          <p className="text-xs text-slate-400">Built with care for patients, doctors & staff.</p>
        </div>
      </div>
    </footer>
  );
}