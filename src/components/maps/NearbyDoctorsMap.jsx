import { useEffect, useRef, useState } from 'react';
import { GoogleMap, InfoWindow, LoadScript, Marker } from '@react-google-maps/api';
import { ExternalLink, MapPin, Navigation } from 'lucide-react';
import { Link } from 'react-router-dom';
import Spinner from '@/components/common/Spinner';
import Avatar from '@/components/common/Avatar';
import { buildDirectionsUrl, getDoctorCoords } from '@/utils/maps';

const USER_ICON =
  'data:image/svg+xml,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28">' +
      '<circle cx="14" cy="14" r="12" fill="#2563eb" stroke="#ffffff" stroke-width="3"/>' +
      '<circle cx="14" cy="14" r="4.5" fill="#ffffff"/>' +
      '</svg>',
  );

const doctorIcon = (active) =>
  'data:image/svg+xml,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="38" height="38" viewBox="0 0 38 38">' +
      `<circle cx="19" cy="19" r="18" fill="${active ? '#14b8a6' : '#4f46e5'}" stroke="#ffffff" stroke-width="3"/>` +
      '<path fill="#ffffff" d="M16.5 11h5v5.5H27v5h-5.5V27h-5v-5.5H11v-5h5.5z"/>' +
      '</svg>',
  );

const MAP_OPTIONS = {
  gestureHandling: 'greedy',
  mapTypeControl: false,
  streetViewControl: false,
  fullscreenControl: true,
  zoomControl: true,
  clickableIcons: false,
  styles: [{ featureType: 'poi', elementType: 'labels', stylers: [{ visibility: 'off' }] }],
};

const DEFAULT_CENTER = { lat: 24.8607, lng: 67.0011 };

export default function NearbyDoctorsMap({
  doctors = [],
  center = DEFAULT_CENTER,
  selectedId = null,
  onSelectDoctor,
}) {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const [loadFailed, setLoadFailed] = useState(false);

  if (!apiKey) {
    return <StaticMapPreview doctors={doctors} center={center} />;
  }

  if (loadFailed) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-gradient-to-br from-rose-50 to-slate-100 p-8 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-rose-100 text-rose-500">
          <MapPin className="h-6 w-6" />
        </div>
        <p className="text-sm font-bold text-slate-800">Could not load Google Maps</p>
        <p className="max-w-xs text-xs text-slate-500">
          Make sure VITE_GOOGLE_MAPS_API_KEY in your .env file is valid, then refresh the page.
        </p>
      </div>
    );
  }

  return (
    <LoadScript
      googleMapsApiKey={apiKey}
      onError={() => setLoadFailed(true)}
      loadingElement={
        <div className="flex h-full w-full items-center justify-center bg-slate-100">
          <Spinner label="Loading map..." />
        </div>
      }
    >
      <MapContent
        doctors={doctors}
        center={center}
        selectedId={selectedId}
        onSelectDoctor={onSelectDoctor}
      />
    </LoadScript>
  );
}

function MapContent({ doctors, center, selectedId, onSelectDoctor }) {
  const mapRef = useRef(null);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !selectedId) return;
    const doctor = doctors.find((d) => String(d.id) === String(selectedId));
    const coords = getDoctorCoords(doctor);
    if (coords) map.panTo(coords);
  }, [selectedId, doctors]);

  const positioned = doctors
    .map((doctor) => ({ doctor, coords: getDoctorCoords(doctor) }))
    .filter((item) => item.coords);

  const active = positioned.find((item) => String(item.doctor.id) === String(selectedId));

  return (
    <GoogleMap
      mapContainerStyle={{ width: '100%', height: '100%' }}
      center={center}
      zoom={13}
      options={MAP_OPTIONS}
      onLoad={(map) => {
        mapRef.current = map;
      }}
      onUnmount={() => {
        mapRef.current = null;
      }}
    >
      <Marker position={center} icon={USER_ICON} title="Your location" zIndex={2} />
      {positioned.map(({ doctor, coords }) => {
        const isActive = String(doctor.id) === String(selectedId);
        return (
          <Marker
            key={doctor.id}
            position={coords}
            icon={doctorIcon(isActive)}
            title={doctor.fullName ?? doctor.name ?? 'Doctor'}
            zIndex={isActive ? 3 : 1}
            onClick={() => onSelectDoctor(doctor.id)}
          />
        );
      })}
      {active && (
        <InfoWindow position={active.coords} onCloseClick={() => onSelectDoctor(null)}>
          <DoctorInfoCard doctor={active.doctor} origin={center} />
        </InfoWindow>
      )}
    </GoogleMap>
  );
}

function DoctorInfoCard({ doctor, origin }) {
  const name = typeof doctor.fullName === 'string' ? doctor.fullName : doctor.name ?? 'Doctor';
  const spec = doctor.specialization?.name ?? doctor.specialization ?? 'Doctor';
  const directions = buildDirectionsUrl(doctor, origin);

  return (
    <div className="w-60">
      <div className="flex items-center gap-2.5">
        <Avatar name={name} size="sm" />
        <div className="min-w-0">
          <p className="truncate text-sm font-bold text-slate-900">{name}</p>
          <p className="truncate text-xs text-slate-500">{spec}</p>
        </div>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {directions && (
          <a
            href={directions}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-indigo-600 to-teal-500 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:opacity-90"
          >
            <Navigation className="h-3.5 w-3.5" />
            Directions
          </a>
        )}
        <Link
          to={`/doctors/${doctor.id}`}
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-indigo-400 hover:text-indigo-700"
        >
          View profile
          <ExternalLink className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}

function StaticMapPreview({ doctors, center }) {
  const positioned = doctors.map(getDoctorCoords).filter(Boolean);
  const allPoints = [center, ...positioned];
  const minLat = Math.min(...allPoints.map((p) => p.lat));
  const maxLat = Math.max(...allPoints.map((p) => p.lat));
  const minLng = Math.min(...allPoints.map((p) => p.lng));
  const maxLng = Math.max(...allPoints.map((p) => p.lng));
  const latRange = maxLat - minLat || 0.01;
  const lngRange = maxLng - minLng || 0.01;

  const toPos = ({ lat, lng }) => ({
    left: `${8 + ((lng - minLng) / lngRange) * 80}%`,
    top: `${10 + ((maxLat - lat) / latRange) * 74}%`,
  });

  return (
    <div className="relative h-full w-full overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-teal-50">
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: 'radial-gradient(circle, #6366f1 1px, transparent 1px)',
          backgroundSize: '22px 22px',
        }}
      />
      <div className="absolute left-4 top-4 z-10 flex items-center gap-1.5 rounded-xl bg-white/90 px-3 py-2 text-xs font-semibold text-slate-700 shadow-md backdrop-blur">
        <MapPin className="h-3.5 w-3.5 text-indigo-600" />
        You are here
      </div>
      <div className="absolute -translate-x-1/2 -translate-y-1/2" style={toPos(center)}>
        <div className="absolute h-10 w-10 animate-ping rounded-full bg-indigo-400/30" />
        <div className="relative z-10 flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-blue-600 shadow-lg">
          <span className="h-2.5 w-2.5 rounded-full bg-white" />
        </div>
      </div>
      {positioned.map((coords, i) => (
        <div key={i} className="absolute -translate-x-1/2 -translate-y-1/2" style={toPos(coords)}>
          <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-brand-gradient text-xs font-bold text-white shadow-lg">
            {i + 1}
          </div>
        </div>
      ))}
      <p className="absolute bottom-4 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-full bg-white/90 px-4 py-1.5 text-xs font-medium text-slate-500 shadow backdrop-blur">
        Add VITE_GOOGLE_MAPS_API_KEY to .env to unlock the interactive map
      </p>
    </div>
  );
}