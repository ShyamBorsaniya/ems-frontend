import { getAuthData, updateTokens, clearAuthData } from '../utils/storage';

export const BASE_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000';

let refreshPromise = null;

/**
 * Executes refresh token API request using stored refresh token
 * Endpoint: /api/user/token/refresh/
 */
async function refreshAccessToken() {
  if (refreshPromise) {
    return refreshPromise;
  }

  refreshPromise = (async () => {
    const authData = getAuthData();
    const refreshToken = authData?.refreshToken;

    if (!refreshToken) {
      return null;
    }

    try {
      const response = await fetch(`${BASE_URL}/api/user/token/refresh/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ refresh: refreshToken })
      });

      const data = await response.json().catch(() => null);

      if (response.ok && data) {
        const newAccess = data.access || data.data?.access || data.tokens?.access || data.data?.tokens?.access;
        const newRefresh = data.refresh || data.data?.refresh || data.tokens?.refresh || data.data?.tokens?.refresh;

        if (newAccess) {
          updateTokens({ access: newAccess, refresh: newRefresh });
          return newAccess;
        }
      }
      return null;
    } catch (err) {
      console.error('Refresh token request failed:', err);
      return null;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

/**
 * Custom lightweight HTTP client providing axios-like interface using native fetch API
 */
class AxiosInstance {
  constructor(baseUrl = BASE_URL) {
    this.baseUrl = baseUrl;
  }

  getHeaders(customHeaders = {}) {
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...customHeaders
    };

    const authData = getAuthData();
    if (authData && authData.accessToken) {
      headers['Authorization'] = `Bearer ${authData.accessToken}`;
    }

    return headers;
  }

  handleLogout() {
    clearAuthData();
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('auth:logout'));
    }
  }

  async request(endpoint, options = {}) {
    const url = endpoint.startsWith('http') ? endpoint : `${this.baseUrl}${endpoint}`;
    const headers = this.getHeaders(options.headers);

    try {
      const response = await fetch(url, {
        ...options,
        headers
      });

      const data = await response.json().catch(() => null);

      const isUnauthorized = response.status === 401 || data?.status_code === 401 || data?.errors?.code === 'token_not_valid';
      const isAuthEndpoint = endpoint.includes('/api/user/token/refresh/') || endpoint.includes('/api/user/login/');

      if (isUnauthorized && !isAuthEndpoint) {
        if (!options._isRetry) {
          // Call refresh token API 1 time
          const newAccessToken = await refreshAccessToken();

          if (newAccessToken) {
            // Retry request 1 time with updated token
            return this.request(endpoint, {
              ...options,
              _isRetry: true
            });
          } else {
            // Token refresh failed -> logout user
            this.handleLogout();
          }
        } else {
          // Still unauthorized after retry -> logout user
          this.handleLogout();
        }
      }

      return {
        data,
        status: response.status,
        ok: response.ok,
        headers: response.headers
      };
    } catch (error) {
      console.error('API Request Error:', error);
      return {
        data: null,
        status: 0,
        ok: false,
        error: error.message || 'Network error'
      };
    }
  }

  async get(endpoint, options = {}) {
    return this.request(endpoint, { method: 'GET', ...options });
  }

  async post(endpoint, data = {}, options = {}) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
      ...options
    });
  }

  async put(endpoint, data = {}, options = {}) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
      ...options
    });
  }

  async patch(endpoint, data = {}, options = {}) {
    return this.request(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
      ...options
    });
  }

  async delete(endpoint, options = {}) {
    return this.request(endpoint, { method: 'DELETE', ...options });
  }
}

export const axiosInstance = new AxiosInstance();
export default axiosInstance;

