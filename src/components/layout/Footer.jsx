import { Link } from 'react-router-dom';
import { HeartPulse, ShieldCheck, Clock3, MapPin } from 'lucide-react';

const columns = [
  {
    title: 'Platform',
    links: [
      { label: 'Find Doctors', to: '/doctors' },
      { label: 'Nearby Clinics', to: '/patient/doctors/nearby' },
      { label: 'Patient Portal', to: '/patient/dashboard' },
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
      { label: 'Help Center', to: '/' },
      { label: 'Contact Us', to: '/' },
    ],
  },
];

const trust = [
  { icon: ShieldCheck, text: 'Verified doctors' },
  { icon: Clock3, text: 'Live queue updates' },
  { icon: MapPin, text: 'Nearby clinics' },
];

export default function Footer() {
  return (
    <footer className="relative border-t border-slate-200 bg-gradient-to-b from-white to-slate-50">
      <div className="h-1 bg-brand-gradient" />
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-4">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-gradient text-white shadow-md shadow-indigo-200">
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
            <div className="mt-4 flex flex-wrap gap-2">
              {trust.map((t) => (
                <span
                  key={t.text}
                  className="badge bg-indigo-50 text-indigo-700 ring-1 ring-inset ring-indigo-100"
                >
                  <t.icon className="h-3 w-3" />
                  {t.text}
                </span>
              ))}
            </div>
          </div>
          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="text-sm font-bold uppercase tracking-wide text-slate-900">{col.title}</h4>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      to={l.to}
                      className="text-sm text-slate-500 transition hover:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-1 rounded"
                    >
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
          <p className="text-xs text-slate-400">
            Built with <span className="text-rose-500">♥</span> for patients, doctors &amp; staff.
          </p>
        </div>
      </div>
    </footer>
  );
}
