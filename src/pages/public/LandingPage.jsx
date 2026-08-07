import { Link } from 'react-router-dom';
import {
  CalendarCheck, Stethoscope, Clock, MapPin,
  ArrowRight, Star, Users, HeartPulse, Search, ClipboardList,
} from 'lucide-react';

const features = [
  {
    icon: Stethoscope,
    title: 'Find the right doctor',
    desc: 'Search by name, specialization, clinic location or rating — with verified profiles.',
  },
  {
    icon: CalendarCheck,
    title: 'Book in seconds',
    desc: 'See live availability, pick a time slot, and confirm your appointment instantly.',
  },
  {
    icon: Clock,
    title: 'Live queue tracking',
    desc: 'Know exactly when you are next. No more guessing in a waiting room.',
  },
  {
    icon: MapPin,
    title: 'Nearby care',
    desc: 'Locate the closest doctors and clinics around you on an interactive map.',
  },
  {
    icon: HeartPulse,
    title: 'Smart health assistant',
    desc: 'Get quick, AI-powered guidance for your symptoms when you need it.',
  },
  {
    icon: Star,
    title: 'Honest reviews',
    desc: 'Read and share real experiences to help the community choose better.',
  },
];

const stats = [
  { value: '500+', label: 'Verified Doctors' },
  { value: '25k+', label: 'Appointments booked' },
  { value: '4.8', label: 'Average rating' },
  { value: '60+', label: 'Specializations' },
];

export default function LandingPage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-brand-gradient">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.18),transparent_55%)]" />
        <div className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-white/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 pb-24 pt-20 sm:px-6 lg:px-8 lg:pb-32 lg:pt-28">
          <div className="grid items-center gap-16 lg:grid-cols-2">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-sm font-medium text-white backdrop-blur">
                <HeartPulse className="h-4 w-4" />
                Your health, simplified
              </span>
              <h1 className="mt-6 text-4xl font-extrabold leading-tight text-white sm:text-5xl lg:text-6xl">
                Find the right doctor,
                <span className="block text-cyan-200">book in moments.</span>
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-indigo-100">
                MediTrack connects you with verified doctors, live appointment slots, and real-time
                queue updates — everything you need for better healthcare, in one place.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  to="/register/patient"
                  className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-bold text-indigo-700 shadow-lg transition hover:bg-indigo-50"
                >
                  Get started free
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to="/doctors"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/40 bg-white/10 px-6 py-3.5 text-sm font-bold text-white backdrop-blur transition hover:bg-white/20"
                >
                  <Search className="h-4 w-4" />
                  Find a doctor
                </Link>
              </div>

              <div className="mt-10 flex items-center gap-4">
                <div className="flex -space-x-2">
                  {['AS', 'RM', 'KL', 'TD'].map((initials, i) => (
                    <div
                      key={initials}
                      className={`flex h-9 w-9 items-center justify-center rounded-full border-2 border-white text-xs font-bold text-white ${
                        ['bg-indigo-500', 'bg-purple-500', 'bg-teal-500', 'bg-rose-500'][i]
                      }`}
                    >
                      {initials}
                    </div>
                  ))}
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="mt-0.5 text-sm text-indigo-100">Loved by thousands of patients</p>
                </div>
              </div>
            </div>

            <div className="relative hidden lg:block">
              <div className="card max-w-md p-6 shadow-2xl">
                <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-teal-500 to-emerald-500 text-white">
                    <Stethoscope className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">Dr. Ayesha Siddiqui</p>
                    <p className="text-xs text-slate-500">Cardiologist · City General Hospital</p>
                  </div>
                  <span className="ml-auto badge bg-green-100 text-green-800">Available</span>
                </div>
                <div className="space-y-3 py-4">
                  {[
                    { t: 'Morning slot', s: '10:30 AM · Confirmed' },
                    { t: 'Next free slot', s: 'Today, 2:00 PM' },
                    { t: 'Your position', s: '#3 in queue' },
                  ].map((row, i) => (
                    <div
                      key={row.t}
                      className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3"
                    >
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                          {row.t}
                        </p>
                        <p className="text-sm font-bold text-slate-800">{row.s}</p>
                      </div>
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-gradient text-xs font-bold text-white">
                        {['✓', '✓', '#'][i] === '#' ? '3' : '✓'}
                      </div>
                    </div>
                  ))}
                </div>
                <button className="btn-primary w-full">Book appointment</button>
              </div>

              <div className="absolute -left-10 -top-10 animate-pulse rounded-2xl bg-white/90 px-4 py-3 shadow-xl backdrop-blur">
                <p className="text-2xl font-extrabold text-emerald-500">98%</p>
                <p className="text-xs font-medium text-slate-500">On-time care</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="relative border-t border-white/15 bg-black/10 backdrop-blur">
          <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-8 sm:px-6 lg:grid-cols-4 lg:px-8">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-3xl font-extrabold text-white">{s.value}</p>
                <p className="mt-1 text-sm font-medium text-indigo-100">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="badge bg-indigo-100 text-indigo-700">How it works</span>
          <h2 className="mt-4 text-3xl font-extrabold sm:text-4xl">Healthcare without the runaround</h2>
          <p className="mt-4 text-lg text-slate-500">
            A three-step flow designed to save your time and your sanity.
          </p>
        </div>
        <div className="mt-14 grid gap-8 md:grid-cols-3">
          {[
            { step: '01', title: 'Search & compare', desc: 'Browse verified doctors by specialization, rating and location.' },
            { step: '02', title: 'Book your slot', desc: 'Choose a time that works, from live doctor schedules.' },
            { step: '03', title: 'Track & get care', desc: 'Follow your queue in real time and get reminders instantly.' },
          ].map((s) => (
            <div key={s.step} className="card relative p-8 transition hover:shadow-lg hover:-translate-y-1">
              <span className="bg-brand-gradient bg-clip-text text-5xl font-extrabold text-transparent">
                {s.step}
              </span>
              <h3 className="mt-4 text-lg font-bold text-slate-900">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-500">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <span className="badge bg-purple-100 text-purple-700">Features</span>
            <h2 className="mt-4 text-3xl font-extrabold sm:text-4xl">Everything you need for your health</h2>
          </div>
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => {
              const Icon = f.icon;
              return (
                <div
                  key={f.title}
                  className="card group p-6 transition hover:shadow-lg hover:-translate-y-1"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-md transition group-hover:scale-110">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-5 text-lg font-bold text-slate-900">{f.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-500">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl overflow-hidden rounded-3xl bg-brand-gradient px-8 py-16 text-center shadow-2xl">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">Ready to take charge of your health?</h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-indigo-100">
            Join MediTrack today and make your next appointment the easiest part of your week.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              to="/register/patient"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-bold text-indigo-700 shadow-lg transition hover:bg-indigo-50"
            >
              Create free account
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/register/doctor"
              className="inline-flex items-center gap-2 rounded-xl border border-white/40 bg-white/10 px-6 py-3.5 text-sm font-bold text-white backdrop-blur transition hover:bg-white/20"
            >
              <Users className="h-4 w-4" />
              Join as a doctor
            </Link>
            <Link
              to="/register/assistant"
              className="inline-flex items-center gap-2 rounded-xl border border-white/40 bg-white/10 px-6 py-3.5 text-sm font-bold text-white backdrop-blur transition hover:bg-white/20"
            >
              <ClipboardList className="h-4 w-4" />
              Join as an assistant
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}