import { axiosInstance } from '../../services/axiosInstance';

/**
 * Fetches role list from backend API
 * Endpoint: /api/role/
 * Filters: search, page
 */
export async function fetchRolesApi(filters = {}) {
  try {
    const params = new URLSearchParams();

    if (filters.page) {
      params.append('page', filters.page);
    }
    if (filters.search && filters.search.trim()) {
      params.append('search', filters.search.trim());
    }

    const queryString = params.toString() ? `?${params.toString()}` : '';
    const res = await axiosInstance.get(`/api/role/${queryString}`);

    if (res.ok && res.data) {
      return res.data;
    }

    return {
      status_code: res.status || 400,
      success: false,
      message: res.data?.message || 'Failed to retrieve role list',
      data: { results: [], pagination: null }
    };
  } catch (error) {
    console.error('Error in fetchRolesApi:', error);
    return {
      status_code: 500,
      success: false,
      message: error.message || 'Network error retrieving role list',
      data: { results: [], pagination: null }
    };
  }
}

/**
 * Creates a new role
 * Endpoint: POST /api/role/
 */
export async function createRoleApi(roleData) {
  const res = await axiosInstance.post('/api/role/', roleData);
  return res.data;
}

/**
 * Updates an existing role by ID
 * Endpoint: PUT /api/role/{roleId}/
 */
export async function updateRoleApi(roleId, roleData) {
  const res = await axiosInstance.put(`/api/role/${roleId}/`, roleData);
  return res.data;
}

/**
 * Deletes a role by ID
 * Endpoint: DELETE /api/role/{roleId}/
 */
export async function deleteRoleApi(roleId) {
  const res = await axiosInstance.delete(`/api/role/${roleId}/`);
  return res.data;
}

/**
 * Fetches a single role details by ID
 * Endpoint: GET /api/role/{roleId}/
 */
export async function fetchRoleByIdApi(roleId) {
  try {
    const res = await axiosInstance.get(`/api/role/${roleId}/`);
    return res.data;
  } catch (error) {
    console.error(`Error in fetchRoleByIdApi (${roleId}):`, error);
    return null;
  }
}
