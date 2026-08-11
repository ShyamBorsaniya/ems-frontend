import { getAuthData } from '../utils/storage';

export const BASE_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000';

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

  async request(endpoint, options = {}) {
    const url = endpoint.startsWith('http') ? endpoint : `${this.baseUrl}${endpoint}`;
    const headers = this.getHeaders(options.headers);

    try {
      const response = await fetch(url, {
        ...options,
        headers
      });

      const data = await response.json().catch(() => null);

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

  async delete(endpoint, options = {}) {
    return this.request(endpoint, { method: 'DELETE', ...options });
  }
}

export const axiosInstance = new AxiosInstance();
export default axiosInstance;
