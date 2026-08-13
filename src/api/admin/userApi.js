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

/**
 * Fetches pending users list from backend API
 * Endpoint: /api/user/pending/ (fallback: /api/users/pending/)
 * Query parameters: search, company, page
 */
export async function fetchPendingUsersApi(filters = {}) {
  try {
    const params = new URLSearchParams();

    if (filters.page) {
      params.append('page', filters.page);
    }
    if (filters.search && filters.search.trim()) {
      params.append('search', filters.search.trim());
    }
    if (filters.company) {
      params.append('company', filters.company);
    }

    const queryString = params.toString() ? `?${params.toString()}` : '';
    let res = await axiosInstance.get(`/api/user/pending/${queryString}`);

    // Fallback if 404
    if (!res.ok && res.status === 404) {
      res = await axiosInstance.get(`/api/users/pending/${queryString}`);
    }

    if (res.ok && res.data) {
      return res.data;
    }

    return {
      status_code: res.status || 400,
      success: false,
      message: res.data?.message || 'Failed to retrieve pending users list',
      data: { results: [], pagination: null }
    };
  } catch (error) {
    console.error('Error in fetchPendingUsersApi:', error);
    return {
      status_code: 500,
      success: false,
      message: error.message || 'Network error retrieving pending users list',
      data: { results: [], pagination: null }
    };
  }
}

/**
 * Approves a pending user account
 * Endpoint: POST /api/user/{id}/approve/ (fallback: /api/users/{id}/approve/)
 */
export async function approveUserApi(userId) {
  try {
    let res = await axiosInstance.post(`/api/user/${userId}/approve/`);
    if (!res.ok && res.status === 404) {
      res = await axiosInstance.post(`/api/users/${userId}/approve/`);
    }
    return res.data || { success: res.ok, status_code: res.status };
  } catch (error) {
    console.error(`Error approving user (${userId}):`, error);
    return {
      success: false,
      message: error.message || 'Network error approving user'
    };
  }
}

/**
 * Rejects a user account
 * Endpoint: POST /api/user/{id}/reject/ (fallback: /api/users/{id}/reject/)
 */
export async function rejectUserApi(userId) {
  try {
    let res = await axiosInstance.post(`/api/user/${userId}/reject/`);
    if (!res.ok && res.status === 404) {
      res = await axiosInstance.post(`/api/users/${userId}/reject/`);
    }
    return res.data || { success: res.ok, status_code: res.status };
  } catch (error) {
    console.error(`Error rejecting user (${userId}):`, error);
    return {
      success: false,
      message: error.message || 'Network error rejecting user'
    };
  }
}
