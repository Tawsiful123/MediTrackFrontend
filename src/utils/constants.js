export const ROLES = {
  PATIENT: 'PATIENT',
  DOCTOR: 'DOCTOR',
  DOCTOR_ASSISTANT: 'DOCTOR_ASSISTANT',
  ADMIN: 'ADMIN',
};

export const ACCOUNT_STATUS = ['ACTIVE', 'INACTIVE', 'SUSPENDED'];

export const DOCTOR_VERIFICATION_STATUS = ['PENDING', 'APPROVED', 'REJECTED'];

export const APPOINTMENT_STATUS = ['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED', 'REJECTED'];

export const QUEUE_STATUS = ['WAITING', 'CALLED', 'IN_CONSULTATION', 'COMPLETED', 'ABSENT', 'SKIPPED'];

export const GENDER = ['MALE', 'FEMALE', 'OTHER'];

export const WEEKDAYS = [
  'SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY',
];

/**
 * Badge color mapping used by <Badge /> and <AppointmentStatusBadge /> (planning.md §12).
 */
export const STATUS_COLORS = {
  PENDING: 'yellow',
  CONFIRMED: 'blue',
  COMPLETED: 'green',
  CANCELLED: 'gray',
  REJECTED: 'red',
  WAITING: 'yellow',
  CALLED: 'blue',
  IN_CONSULTATION: 'purple',
  ABSENT: 'red',
  SKIPPED: 'gray',
  ACTIVE: 'green',
  INACTIVE: 'gray',
  SUSPENDED: 'red',
  APPROVED: 'green',
};

/**
 * Resolve a status (or role) to its badge color, defaulting to gray.
 */
export function getStatusColor(status) {
  return STATUS_COLORS[status] ?? 'gray';
}