import { format } from 'date-fns';

export function formatDate(date, pattern = 'MMM d, yyyy') {
  if (!date) return '—';
  return format(new Date(date), pattern);
}

export function formatTime(date, pattern = 'h:mm a') {
  if (!date) return '—';
  return format(new Date(date), pattern);
}

export function formatDateTime(date) {
  if (!date) return '—';
  return format(new Date(date), 'MMM d, yyyy · h:mm a');
}