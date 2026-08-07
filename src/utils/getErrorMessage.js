/**
 * Extracts a human-readable message from an axios error consistently.
 * Prefers the API `errorMessages[]` array, then `message`, then a fallback.
 */
export function getErrorMessage(error, fallback = 'Something went wrong, please try again') {
  if (!error) return fallback;

  const data = error.response?.data;
  if (data) {
    if (Array.isArray(data.errorMessages) && data.errorMessages.length > 0) {
      return data.errorMessages.map((e) => (typeof e === 'string' ? e : e?.message)).join(', ');
    }
    if (typeof data.message === 'string' && data.message) return data.message;
  }
  if (error.message) return error.message;
  return fallback;
}