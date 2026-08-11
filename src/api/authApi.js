import { axiosInstance, BASE_URL } from '../services/axiosInstance';
import { parseApiErrorMessage } from '../utils/helpers';

/**
 * Sends authentication login request to backend API
 * Endpoint: /api/user/login/
 */
export async function loginApi(credentials) {
  const inputVal = (credentials.email || credentials.username || '').trim();

  const payload = {
    email: inputVal,
    username: inputVal,
    password: credentials.password
  };

  try {
    const res = await axiosInstance.post('/api/user/login/', payload);
    const data = res.data;

    if (!res.ok || (data && data.success === false)) {
      const errorMessage = parseApiErrorMessage(data, 'Login failed. Please verify your email/username and password.');
      return {
        success: false,
        message: errorMessage,
        status_code: data?.status_code || res.status,
        errors: data?.errors || null,
        rawResponse: data
      };
    }

    return data;
  } catch (error) {
    console.error('Login Error:', error);
    return {
      success: false,
      message: 'Unable to connect to backend server. Please verify Django server is running at ' + BASE_URL,
      isNetworkError: true
    };
  }
}

/**
 * Sends logout request
 */
export async function logoutApi() {
  try {
    const res = await axiosInstance.post('/api/user/logout/', {});
    return res.data || { success: true };
  } catch (error) {
    return { success: true };
  }
}
