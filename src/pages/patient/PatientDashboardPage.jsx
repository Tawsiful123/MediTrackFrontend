import { Link } from 'react-router-dom';
import { CalendarCheck, ClipboardList, ListChecks, Star, ArrowRight, MapPin, Bot } from 'lucide-react';
import StatCard from '@/components/common/StatCard';
import PageHeader from '@/components/common/PageHeader';
import Button from '@/components/common/Button';
import Badge from '@/components/common/Badge';
import Avatar from '@/components/common/Avatar';

const upcoming = [
  { id: 1, doctor: 'Dr. Ayesha Siddiqui', spec: 'Cardiology', date: 'Today, 10:30 AM', status: 'CONFIRMED' },
  { id: 2, doctor: 'Dr. John Carter', spec: 'Dermatology', date: 'Mon, Aug 10 · 2:00 PM', status: 'PENDING' },
];

const queuePosition = { position: 3, estimatedWait: '~15 min' };

export default function PatientDashboardPage() {
  return (
    <div>
      <PageHeader
        title="Welcome back, Rahul 👋"
        subtitle="Here's what's happening with your health today."
        action={
          <Link to="/doctors" className="btn-primary">
            <CalendarCheck className="h-4 w-4" />
            Book new appointment
          </Link>
        }
      />

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={ClipboardList} label="Total appointments" value="12" accent="indigo" trend="+2 this month" />
        <StatCard icon={CalendarCheck} label="Upcoming" value="2" accent="purple" />
        <StatCard icon={Star} label="Reviews written" value="5" accent="amber" />
        <StatCard icon={ListChecks} label="Queue position" value={`#${queuePosition.position}`} accent="teal" trend={queuePosition.estimatedWait} trendDirection="down" />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="card p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900">Upcoming appointments</h2>
              <Link to="/patient/appointments" className="flex items-center gap-1 text-sm font-semibold text-indigo-600 hover:text-indigo-700">
                View all <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="mt-5 space-y-4">
              {upcoming.map((a) => (
                <div key={a.id} className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-slate-50/60 p-4 transition hover:border-indigo-200 hover:bg-white">
                  <Avatar name={a.doctor} size="lg" />
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-slate-900">{a.doctor}</p>
                    <p className="text-sm text-slate-500">{a.spec} · {a.date}</p>
                  </div>
                  <Badge status={a.status}>{a.status}</Badge>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl bg-brand-gradient p-6 text-white shadow-lg">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15 backdrop-blur">
                <MapPin className="h-5 w-5" />
              </span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-indigo-100">Live queue</p>
                <p className="text-lg font-extrabold">Position #{queuePosition.position}</p>
              </div>
            </div>
            <p className="mt-3 text-sm text-indigo-100">
              Estimated wait: <span className="font-bold text-white">{queuePosition.estimatedWait}</span> at
              City General Hospital.
            </p>
            <Link to="/patient/queue" className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white py-2.5 text-sm font-bold text-indigo-700 transition hover:bg-indigo-50">
              Track queue
            </Link>
          </div>

          <div className="card p-6">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                <Bot className="h-5 w-5" />
              </span>
              <div>
                <p className="font-bold text-slate-900">Health Assistant</p>
                <p className="text-xs text-slate-500">AI symptom guidance, 24/7</p>
              </div>
            </div>
            <p className="mt-3 text-sm text-slate-600">
              Not sure what your symptoms mean? Chat with our AI assistant for instant guidance.
            </p>
            <Link to="/patient/chatbot" className="mt-4 block">
              <Button variant="outline" className="w-full">Start chatting</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}