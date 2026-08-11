export const BASE_URL = 'http://127.0.0.1:8000';

/**
 * Helper to parse backend error responses in standard DRF format:
 * {
 *   "status_code": 400,
 *   "success": false,
 *   "message": "Login failed",
 *   "errors": {
 *     "non_field_errors": ["Invalid credentials."]
 *   }
 * }
 */
export function parseApiErrorMessage(data, fallbackMessage = 'Login failed. Please check your credentials.') {
  if (!data) return fallbackMessage;

  // 1. Check for 'errors' object (DRF standard)
  if (data.errors && typeof data.errors === 'object') {
    const errs = data.errors;

    // Check non_field_errors (e.g. "Invalid credentials.")
    if (errs.non_field_errors) {
      if (Array.isArray(errs.non_field_errors) && errs.non_field_errors.length > 0) {
        return errs.non_field_errors.join(' ');
      }
      if (typeof errs.non_field_errors === 'string') {
        return errs.non_field_errors;
      }
    }

    // Check field specific errors e.g. email, password
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

  // 2. Check specific message / detail properties
  if (data.message && data.message !== 'Login failed') {
    return data.message;
  }

  if (data.detail) {
    if (typeof data.detail === 'string') return data.detail;
    if (Array.isArray(data.detail)) return data.detail.join(' ');
  }

  if (data.message) {
    return data.message;
  }

  return fallbackMessage;
}

/**
 * Sends login request to Django backend API
 * Endpoint: http://127.0.0.1:8000/api/user/login/
 */
export async function loginApi(credentials) {
  const inputVal = (credentials.email || credentials.username || '').trim();
  
  const payload = {
    email: inputVal,
    username: inputVal,
    password: credentials.password
  };

  try {
    const response = await fetch(`${BASE_URL}/api/user/login/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json().catch(() => null);

    // If HTTP error status OR API returned success: false
    if (!response.ok || (data && data.success === false)) {
      const errorMessage = parseApiErrorMessage(data, 'Login failed. Please verify your email/username and password.');
      return {
        success: false,
        message: errorMessage,
        status_code: data?.status_code || response.status,
        errors: data?.errors || null,
        rawResponse: data
      };
    }

    return data;
  } catch (error) {
    console.error('Login Network Error:', error);
    return {
      success: false,
      message: 'Unable to connect to backend server. Please verify Django server is running at ' + BASE_URL,
      isNetworkError: true
    };
  }
}
