import { MapPin } from 'lucide-react';

export default function NearbyDoctorsMap() {

  const markers = [
    { lat: 24.8647, lng: 67.0011 },
    { lat: 24.8587, lng: 67.0041 },
    { lat: 24.8627, lng: 66.9961 },
  ];

  return (
    <div className="card relative h-[420px] overflow-hidden bg-gradient-to-br from-indigo-100 via-white to-teal-50">
      <div className="absolute inset-0 opacity-[0.15]" style={{ backgroundImage: 'radial-gradient(circle, #6366f1 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
      <div className="absolute left-4 top-4 z-10 flex items-center gap-2 rounded-xl bg-white/90 px-3 py-2 text-sm font-semibold text-slate-700 shadow-md backdrop-blur">
        <MapPin className="h-4 w-4 text-indigo-600" />
        You are here
      </div>
      {markers.map((m, i) => (
        <div
          key={i}
          className="absolute flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-brand-gradient text-white shadow-lg"
          style={{
            left: `${30 + i * 18}%`,
            top: `${30 + (i % 2) * 22}%`,
          }}
        >
          <span className="text-xs font-bold">{i + 1}</span>
        </div>
      ))}
      <div
        className="absolute flex -translate-x-1/2 -translate-y-1/2 items-center justify-center"
        style={{ left: '30%', top: '30%' }}
      >
        <div className="absolute h-16 w-16 animate-ping rounded-full bg-indigo-400/30" />
        <div className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 text-white shadow-lg">
          <MapPin className="h-4 w-4" />
        </div>
      </div>
      <p className="absolute bottom-4 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-full bg-white/90 px-4 py-1.5 text-xs font-medium text-slate-500 shadow backdrop-blur">
        Interactive map — connect your Google Maps key in .env (VITE_GOOGLE_MAPS_API_KEY)
      </p>
    </div>
  );
}