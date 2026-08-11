/**
 * Parses backend DRF error response format into user friendly message
 */
export function parseApiErrorMessage(data, fallbackMessage = 'An unexpected error occurred. Please try again.') {
  if (!data) return fallbackMessage;

  if (data.errors && typeof data.errors === 'object') {
    const errs = data.errors;

    if (errs.non_field_errors) {
      if (Array.isArray(errs.non_field_errors) && errs.non_field_errors.length > 0) {
        return errs.non_field_errors.join(' ');
      }
      if (typeof errs.non_field_errors === 'string') {
        return errs.non_field_errors;
      }
    }

    const fieldErrorMessages = [];
    Object.keys(errs).forEach((field) => {
      const fieldErr = errs[field];
      const fieldLabel = field.replace('_', ' ');
      if (Array.isArray(fieldErr) && fieldErr.length > 0) {
        fieldErrorMessages.push(`${fieldLabel}: ${fieldErr.join(' ')}`);
      } else if (typeof fieldErr === 'string') {
        fieldErrorMessages.push(`${fieldLabel}: ${fieldErr}`);
      }
    });

    if (fieldErrorMessages.length > 0) {
      return fieldErrorMessages.join(' | ');
    }
  }

  if (data.message && data.message !== 'Login failed') {
    return data.message;
  }

  if (data.detail) {
    if (typeof data.detail === 'string') return data.detail;
    if (Array.isArray(data.detail)) return data.detail.join(' ');
  }

  return fallbackMessage;
}

/**
 * Determines if user role is an employee or management user
 */
export function isEmployeeUser(user) {
  if (!user) return true;

  const roleStr = (user.role_name || user.role || '').toString().toLowerCase();

  if (
    roleStr.includes('admin') ||
    roleStr.includes('manager') ||
    roleStr.includes('hr') ||
    roleStr.includes('director') ||
    roleStr.includes('executive') ||
    roleStr.includes('supervisor')
  ) {
    return false;
  }

  if (user.role_id === 5 || roleStr.includes('employee')) {
    return true;
  }

  return false;
}

/**
 * Formats time in seconds to HH:MM:SS format
 */
export function formatSecondsToTimer(totalSecs) {
  const hrs = Math.floor(totalSecs / 3600);
  const mins = Math.floor((totalSecs % 3600) / 60);
  const secs = totalSecs % 60;
  return `${hrs.toString().padStart(2, '0')}h ${mins.toString().padStart(2, '0')}m ${secs.toString().padStart(2, '0')}s`;
}
