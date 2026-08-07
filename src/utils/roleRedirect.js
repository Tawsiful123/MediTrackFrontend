import { ROLES } from '@/utils/constants';

/**
 * Maps each role to its default dashboard path (planning.md §5).
 */
export const roleRedirect = {
  [ROLES.PATIENT]: '/patient/dashboard',
  [ROLES.DOCTOR]: '/doctor/dashboard',
  [ROLES.DOCTOR_ASSISTANT]: '/assistant/dashboard',
  [ROLES.ADMIN]: '/admin/dashboard',
};

/**
 * Returns the dashboard path for a role, falling back to a safe default.
 */
export function getRedirectPath(role) {
  return roleRedirect[role] ?? '/';
}

/**
 * Returns the route prefix for a role's portal (used for nav construction).
 */
export function roleBasePath(role) {
  return roleRedirect[role]?.split('/').slice(0, 2).join('/') ?? '/';
}