import toast from 'react-hot-toast';

export const DEFAULT_ERROR_MESSAGE = 'Something went wrong, please try again';

/**
 * Extracts a human-readable message from an axios error consistently.
 * Prefers the API `errorMessages[]` array, then `message`, then a fallback.
 */
export function getErrorMessage(error, fallback = DEFAULT_ERROR_MESSAGE) {
  if (!error) return fallback;

  const data = error.response?.data;
  if (data) {
    if (Array.isArray(data.errorMessages) && data.errorMessages.length > 0) {
      return data.errorMessages
        .map((e) => (typeof e === 'string' ? e : e?.message))
        .filter(Boolean)
        .join(', ');
    }
    if (typeof data.message === 'string' && data.message.trim()) return data.message;
  }
  if (error.message) return error.message;
  return fallback;
}

/**
 * Returns the HTTP status code for an axios error, or null if none.
 */
export function getErrorStatus(error) {
  return error?.response?.status ?? null;
}

/**
 * Extracts field-level errors from a 400 response so forms can set errors
 * next to the relevant field via react-hook-form `setError`.
 *
 * Supports two shapes:
 *   - `{ errorMessages: [{ field, message }, ...] }`
 *   - `{ data: { fieldErrors: { field: "msg" } } }`
 */
export function getFieldErrors(error) {
  const result = {};

  const env = error?.response?.data;
  const errorMessages = Array.isArray(env?.errorMessages) ? env.errorMessages : [];
  errorMessages.forEach((e) => {
    if (typeof e === 'object' && e?.field && e?.message) {
      result[e.field] = e.message;
    }
  });

  if (Object.keys(result).length) return result;

  const inner = env?.data ?? env;
  if (typeof inner?.fieldErrors === 'object' && inner.fieldErrors !== null) {
    return inner.fieldErrors;
  }

  if (Array.isArray(inner?.errors)) {
    inner.errors.forEach((e) => {
      if (e?.path && typeof e.path === 'string') result[e.path] = e.message;
    });
  }

  return result;
}

/**
 * Applies the status-code behavior table from planning.md §11 and shows a toast:
 *
 * | Status | Behavior |
 * |--------|----------|
 * | 400    | show field errors (returned) + fallback toast |
 * | 401    | (handled by axios interceptor — silent refresh) |
 * | 403    | toast "You don't have permission to do that" (+ optional onForbidden redirect) |
 * | 404    | toast with the API message / fallback |
 * | 409    | toast with the API's exact `message` |
 * | 500    | generic retry toast + console.error in dev |
 *
 * @param {Error} error   the axios error
 * @param {Object} options
 * @param {string} options.fallback      fallback text when no API message exists
 * @param {boolean} options.showToast    set false when the caller shows its own UI
 * @param {() => void} options.onForbidden  callback for 403s (e.g. navigate to /forbidden)
 * @returns {{ status: number|null, message: string, fieldErrors: object }}
 */
export function handleApiError(error, options = {}) {
  const { fallback = DEFAULT_ERROR_MESSAGE, showToast = true, onForbidden } = options;
  const status = getErrorStatus(error);

  let message;
  if (status === 403) {
    message = "You don't have permission to do that";
  } else if (status === 500) {
    message = DEFAULT_ERROR_MESSAGE;
  } else {
    message = getErrorMessage(error, fallback);
  }

  if (showToast) toast.error(message);
  if (status === 403 && onForbidden) onForbidden();
  if (status === 500 && import.meta.env.DEV) console.error('[API error]', error);

  return {
    status,
    message,
    fieldErrors: status === 400 ? getFieldErrors(error) : {},
  };
}