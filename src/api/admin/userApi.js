import { axiosInstance } from '../../services/axiosInstance';

/**
 * Fetches user list from backend API
 * Endpoint: /api/user/
 * Filters: search, role, is_active
 */
export async function fetchUsersApi(filters = {}) {
  try {
    const params = new URLSearchParams();

    if (filters.page) {
      params.append('page', filters.page);
    }
    if (filters.search && filters.search.trim()) {
      params.append('search', filters.search.trim());
    }
    if (filters.role && filters.role !== 'All' && filters.role !== 'all') {
      params.append('role', filters.role);
    }
    if (filters.is_active !== undefined && filters.is_active !== '' && filters.is_active !== 'all') {
      params.append('is_active', filters.is_active);
    }

    const queryString = params.toString() ? `?${params.toString()}` : '';
    const res = await axiosInstance.get(`/api/user/${queryString}`);

    if (res.ok && res.data) {
      return res.data;
    }

    return {
      status_code: res.status || 400,
      success: false,
      message: res.data?.message || 'Failed to retrieve user list',
      data: { results: [], pagination: null }
    };
  } catch (error) {
    console.error('Error in fetchUsersApi:', error);
    return {
      status_code: 500,
      success: false,
      message: error.message || 'Network error retrieving user list',
      data: { results: [], pagination: null }
    };
  }
}

export async function createUserApi(userData) {
  const res = await axiosInstance.post('/api/user/', userData);
  return res.data;
}

export async function updateUserApi(userId, userData) {
  const res = await axiosInstance.put(`/api/user/${userId}/`, userData);
  return res.data;
}

export async function deleteUserApi(userId) {
  const res = await axiosInstance.delete(`/api/user/${userId}/`);
  return res.data;
}

export async function restoreUserApi(userId) {
  const res = await axiosInstance.post(`/api/user/${userId}/restore/`);
  return res.data;
}

export async function fetchUserByIdApi(userId) {
  try {
    const res = await axiosInstance.get(`/api/user/${userId}/`);
    return res.data;
  } catch (error) {
    console.error(`Error in fetchUserByIdApi (${userId}):`, error);
    return null;
  }
}



