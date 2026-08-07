export function getPatientName(entry) {
  if (!entry) return 'Patient';
  return typeof entry.patient === 'string' ? entry.patient : entry.patient?.fullName ?? entry.name ?? 'Patient';
}

export function getQueueNo(entry) {
  return entry?.queueNo ?? entry?.queueNumber ?? '#—';
}