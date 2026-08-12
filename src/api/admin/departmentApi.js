import { axiosInstance } from '../../services/axiosInstance';

/**
 * Fetches department list from backend API
 * Endpoint: GET /api/department/
 * Filters: search, is_active, page
 */
export async function fetchDepartmentsApi(filters = {}) {
  try {
    const params = new URLSearchParams();

    if (filters.page) {
      params.append('page', filters.page);
    }
    if (filters.search && filters.search.trim()) {
      params.append('search', filters.search.trim());
    }
    if (filters.is_active !== undefined && filters.is_active !== '' && filters.is_active !== 'all') {
      params.append('is_active', filters.is_active);
    }

    const queryString = params.toString() ? `?${params.toString()}` : '';
    const res = await axiosInstance.get(`/api/department/${queryString}`);

    if (res.ok && res.data) {
      return res.data;
    }

    return {
      status_code: res.status || 400,
      success: false,
      message: res.data?.message || 'Failed to retrieve department list',
      data: { results: [], pagination: null }
    };
  } catch (error) {
    console.error('Error in fetchDepartmentsApi:', error);
    return {
      status_code: 500,
      success: false,
      message: error.message || 'Network error retrieving department list',
      data: { results: [], pagination: null }
    };
  }
}

/**
 * Creates a new department
 * Endpoint: POST /api/department/
 */
export async function createDepartmentApi(departmentData) {
  const res = await axiosInstance.post('/api/department/', departmentData);
  return res.data;
}

/**
 * Updates an existing department by ID
 * Endpoint: PUT /api/department/{deptId}/
 */
export async function updateDepartmentApi(deptId, departmentData) {
  const res = await axiosInstance.put(`/api/department/${deptId}/`, departmentData);
  return res.data;
}

/**
 * Deletes a department by ID
 * Endpoint: DELETE /api/department/{deptId}/
 */
export async function deleteDepartmentApi(deptId) {
  const res = await axiosInstance.delete(`/api/department/${deptId}/`);
  return res.data;
}

/**
 * Fetches a single department details by ID
 * Endpoint: GET /api/department/{deptId}/
 */
export async function fetchDepartmentByIdApi(deptId) {
  try {
    const res = await axiosInstance.get(`/api/department/${deptId}/`);
    return res.data;
  } catch (error) {
    console.error(`Error in fetchDepartmentByIdApi (${deptId}):`, error);
    return null;
  }
}
