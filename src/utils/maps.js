/**
 * Shared helpers for the Google Maps "Nearby doctors" feature (planning.md §11).
 */

/**
 * Extract a { lat, lng } pair from a doctor object.
 * Accepts `latitude`/`longitude`, `lat`/`lng`, or a nested `location` object.
 * Returns null when no usable coordinates exist.
 */
export function getDoctorCoords(doctor) {
  if (!doctor) return null;
  const loc = doctor.location && typeof doctor.location === 'object' ? doctor.location : {};
  const lat = Number(doctor.latitude ?? doctor.lat ?? loc.lat);
  const lng = Number(doctor.longitude ?? doctor.lng ?? loc.lng);
  return Number.isFinite(lat) && Number.isFinite(lng) ? { lat, lng } : null;
}

/**
 * Build a Google Maps directions URL for a doctor.
 * Prefers the API-provided `directionsUrl`, otherwise constructs one
 * between the user's origin and the doctor's coordinates.
 */
export function buildDirectionsUrl(doctor, origin) {
  if (!doctor) return null;
  if (typeof doctor.directionsUrl === 'string' && doctor.directionsUrl) {
    return doctor.directionsUrl;
  }
  const dest = getDoctorCoords(doctor);
  if (!dest || !origin) return null;
  return `https://www.google.com/maps/dir/?api=1&origin=${origin.lat},${origin.lng}&destination=${dest.lat},${dest.lng}&travelmode=driving`;
}
